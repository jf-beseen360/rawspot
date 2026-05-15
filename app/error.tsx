"use client";

import { useEffect } from "react";

// PR #9 — Error boundary global.
// Affichée par Next.js sur toute erreur non-catchée dans les routes app/*.
// IMPORTÉ PUIS CORRIGÉ depuis legacy app/error.tsx :
// - stack rawspot (brand tokens PR #8, pas Fraunces).
// - email contact préservé (décision e-mail séparée non prise).
// - bouton "Réessayer" appelle reset() de Next pour ré-render le segment.
// - bouton "Retour accueil" en <a> natif (pas Link — chemin "/" est ok mais
//   garder cohérent avec les autres CTAs publics).

const CONTACT_EMAIL = "jfpitey@beseen360app.com";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("[RawSpot°] Erreur globale :", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-6 text-brand-white">
      <div className="max-w-md text-center">
        <div className="mb-4 font-mono text-xs uppercase tracking-wider text-brand-gold">
          Carton rouge
        </div>
        <h1 className="mb-4 text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Faute technique.
        </h1>
        <p className="mb-3 leading-relaxed text-brand-white/70">
          Une erreur inattendue s&apos;est produite. L&apos;équipe a été
          notifiée et corrige déjà.
        </p>
        {error.digest ? (
          <p className="mb-6 font-mono text-xs text-brand-white/40">
            Référence erreur : {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition hover:opacity-90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-block rounded-md border border-brand-white/25 px-6 py-3 text-sm font-medium text-brand-white transition hover:border-brand-gold hover:text-brand-gold"
          >
            Retour accueil
          </a>
        </div>
        <p className="mt-8 text-xs text-brand-white/40">
          Si le problème persiste :{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-brand-gold underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
