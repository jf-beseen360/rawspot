"use server";

import type { Session, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "./server";
import {
  defaultPathForRole,
  isRole,
  type Role,
} from "./types";

// Surface publique du module auth — toutes les exports sont des Server
// Actions ("use server" en tête de fichier). Les imports côté client
// passent par cette surface pour les flows interactifs (login form, etc.).
//
// Pour les guards (requireSession, requireRole, requirePlayerOwnership)
// utilisés à l'intérieur d'autres Server Actions, importer depuis
// "@/lib/auth/server" pour éviter le round-trip Server Action -> client.

export async function getSession(): Promise<Session | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function getUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getUserRole(): Promise<Role | null> {
  const user = await getUser();
  if (!user) return null;
  const raw = (user.app_metadata as Record<string, unknown> | undefined)?.role;
  return isRole(raw) ? raw : null;
}

export type SignInResult =
  | { ok: true }
  | { ok: false; error: string };

// Envoie un email OTP. L'utilisateur recevra un code à 6 chiffres
// (ou un magic link selon la config Supabase Auth).
export async function signInWithOtp(email: string): Promise<SignInResult> {
  const trimmed = email.trim();
  if (!trimmed) return { ok: false, error: "Email requis." };
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({ email: trimmed });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export type VerifyResult =
  | { ok: false; error: string };
// Sur succès, redirect() throw et la Server Action ne retourne jamais.

// Vérifie le code OTP. En cas de succès, le cookie de session est posé
// par @supabase/ssr et la fonction redirige vers :
//   - `from` si fourni et que c'est un chemin local (commence par "/"
//     et pas "//" — protection open-redirect),
//   - sinon, le chemin par défaut du rôle utilisateur.
export async function verifyOtp(
  email: string,
  token: string,
  from?: string | null,
): Promise<VerifyResult> {
  const trimmedEmail = email.trim();
  const trimmedToken = token.trim();
  if (!trimmedEmail || !trimmedToken) {
    return { ok: false, error: "Email et code OTP requis." };
  }
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email: trimmedEmail,
    token: trimmedToken,
    type: "email",
  });
  if (error || !data.session) {
    return { ok: false, error: error?.message ?? "Code invalide ou expiré." };
  }
  const rawRole = (data.user?.app_metadata as Record<string, unknown> | undefined)
    ?.role;
  const isLocalPath =
    typeof from === "string" && from.startsWith("/") && !from.startsWith("//");
  const target = isLocalPath
    ? from
    : isRole(rawRole)
      ? defaultPathForRole(rawRole)
      : "/";
  redirect(target as Parameters<typeof redirect>[0]);
}

// Déconnecte l'utilisateur et redirige vers l'accueil.
export async function signOut(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/" as Parameters<typeof redirect>[0]);
}
