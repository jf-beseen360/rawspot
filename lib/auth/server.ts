import { createServerClient } from "@supabase/ssr";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db/client";
import { players } from "@/lib/db/schema/players";
import type { PlayerId } from "@/domain/shared/id";
import { isRole, type Role } from "./types";

// Client Supabase côté serveur (Server Components, Server Actions, proxy).
// cookies() est async depuis Next.js 15+ — toutes les fonctions consumers de
// ce factory doivent être async.
export async function createServerSupabaseClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Contexte read-only (Server Component pendant render).
            // Le refresh des cookies se fera côté proxy.
          }
        },
      },
    },
  );
}

// Session actuelle (avec access_token + user). Retourne null si non
// authentifié.
export async function getServerSession(): Promise<Session | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

// User actuel. Authentifie via JWT cookie (sécurisé contre cookie tampering).
export async function getServerUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

// Rôle de l'utilisateur courant, lu depuis user.app_metadata.role
// (alimenté par raw_app_meta_data côté SQL — cf. migration 0002).
export async function getServerUserRole(): Promise<Role | null> {
  const user = await getServerUser();
  if (!user) return null;
  const raw = (user.app_metadata as Record<string, unknown> | undefined)?.role;
  return isRole(raw) ? raw : null;
}

// ============ GUARDS ============

export class AuthError extends Error {
  constructor(public code: "unauthorized" | "forbidden" | "not_found") {
    super(code);
    this.name = "AuthError";
  }
}

// Exige une session authentifiée. Retourne le User. Throw "unauthorized" sinon.
export async function requireSession(): Promise<User> {
  const user = await getServerUser();
  if (!user) throw new AuthError("unauthorized");
  return user;
}

// Exige que le rôle utilisateur corresponde. Admin bypass autorisé.
export async function requireRole(role: Role): Promise<User> {
  const user = await requireSession();
  const userRole = await getServerUserRole();
  if (userRole !== role && userRole !== "admin") {
    throw new AuthError("forbidden");
  }
  return user;
}

// Exige que l'utilisateur courant soit propriétaire du Player (user_id match)
// OU admin. Throw unauthorized si non connecté, forbidden si pas owner,
// not_found si le Player n'existe pas.
export async function requirePlayerOwnership(
  playerId: PlayerId,
): Promise<User> {
  const user = await requireSession();
  const userRole = await getServerUserRole();
  if (userRole === "admin") return user;

  const rows = await getDb()
    .select({ userId: players.userId })
    .from(players)
    .where(eq(players.id, playerId))
    .limit(1);

  const row = rows[0];
  if (!row) throw new AuthError("not_found");
  if (row.userId !== user.id) throw new AuthError("forbidden");
  return user;
}
