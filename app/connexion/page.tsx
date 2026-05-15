"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { signInWithOtp, verifyOtp } from "@/lib/auth";

const emailSchema = z.string().email("Email invalide.");

// NEXT_PUBLIC_DEV_OTP_CODE est inliné côté client par Next.js au build.
// En production, cette variable est absente du bundle (ou ignorée par le
// serveur quel que soit son contenu, cf. lib/auth/index.ts verifyOtp).
const DEV_OTP_CODE =
  process.env.NODE_ENV !== "production"
    ? process.env.NEXT_PUBLIC_DEV_OTP_CODE
    : undefined;

type Step = "email" | "otp";

export default function ConnexionPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [from, setFrom] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Lecture de ?from=… au mount (évite Suspense pour useSearchParams).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setFrom(params.get("from"));
  }, []);

  const onSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Email invalide.");
      return;
    }
    setLoading(true);
    const result = await signInWithOtp(parsed.data);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setStep("otp");
  };

  const onSubmitOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!token.trim()) {
      setError("Code requis.");
      return;
    }
    setLoading(true);
    // verifyOtp redirect() en cas de succès — la fonction ne retourne jamais.
    // En cas d'échec, elle retourne { ok: false, error }.
    const result = await verifyOtp(email, token, from);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Reçois un code à 6 chiffres par email pour te connecter.
      </p>

      {step === "email" ? (
        <form onSubmit={onSubmitEmail} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none disabled:opacity-50"
              placeholder="prenom.nom@exemple.com"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Envoi…" : "Recevoir le code"}
          </button>
        </form>
      ) : (
        <form onSubmit={onSubmitOtp} className="mt-8 flex flex-col gap-4">
          <p className="text-sm text-zinc-700">
            Un code a été envoyé à{" "}
            <span className="font-medium text-zinc-900">{email}</span>.
          </p>

          {DEV_OTP_CODE ? (
            <div
              className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900"
              role="note"
            >
              <strong>Mode dev</strong> — utilise le code{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-900">
                {DEV_OTP_CODE}
              </code>{" "}
              pour te connecter sans recevoir d&apos;email.
            </div>
          ) : null}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
              Code OTP
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={token}
              onChange={(e) =>
                setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={loading}
              className="rounded-md border border-zinc-300 px-3 py-2 text-center font-mono text-lg tracking-widest focus:border-zinc-900 focus:outline-none disabled:opacity-50"
              placeholder="••••••"
              maxLength={6}
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || token.length < 6}
            className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Vérification…" : "Se connecter"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setToken("");
              setError(null);
            }}
            disabled={loading}
            className="text-xs text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline disabled:opacity-50"
          >
            Changer d&apos;email
          </button>
        </form>
      )}
    </main>
  );
}
