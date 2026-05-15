import type { Metadata } from "next";
import { LEVELS } from "@/domain/scoring/level";
import { BRAND_NAME_WITH_DEGREE, BRAND_TAGLINE } from "@/lib/brand";

// PR #9 — Pages publiques.
// IMPORTÉ PUIS CORRIGÉ depuis legacy app/a-propos/page.tsx :
// - stack rawspot (Tailwind v4 + brand tokens PR #8, pas de Fraunces).
// - retrait stats live (useStore legacy non porté ; chiffres remplacés par
//   un texte qualitatif jusqu'à ce qu'on ait une source v1).
// - scope v1 Afrique francophone — retrait "22 langues" + tour du monde.
// - CTAs en <a> natifs : routes inexistantes (/inscription PR #12,
//   /recruteur/inscription PR #16) — pas de Link pour ne pas casser typedRoutes.

export const metadata: Metadata = {
  title: "À propos",
  description: `${BRAND_NAME_WITH_DEGREE} — la visibilité qui ouvre les portes. Scoring IA déterministe, vidéos brutes, place de marché ouverte des agents FIFA.`,
};

const PROMESSES = [
  {
    chiffre: "01",
    titre: "Scoring IA objectif",
    texte:
      "Algorithme transparent qui note ton profil sur 8 critères par poste. Pas de jugement humain, pas de favoritisme. Identique pour tous.",
  },
  {
    chiffre: "02",
    titre: "Vidéos brutes, recruteur juge",
    texte:
      "Le recruteur regarde tes vidéos lui-même. On ne sélectionne pas pour lui — on amplifie ta visibilité auprès des clubs sérieux.",
  },
  {
    chiffre: "03",
    titre: "Place de marché ouverte",
    texte:
      "Tous les agents licenciés FIFA peuvent rejoindre. C'est l'athlète qui choisit son représentant. Neutralité absolue.",
  },
] as const;

const LEVEL_ORDER = ["bronze", "silver", "gold", "platinum"] as const;

export default function AProposPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-black text-brand-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--color-brand-gold), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
          <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-wider text-brand-gold">
            <span className="block h-px w-8 bg-brand-gold" />
            <span>{BRAND_NAME_WITH_DEGREE} · Football</span>
          </div>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-7xl lg:text-8xl">
            Être vu.<br />
            <em className="not-italic text-brand-gold">Être choisi.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-brand-white/80 sm:text-xl">
            La plateforme de visibilité pour jeunes talents du football
            d&apos;Afrique francophone. De Dakar à Yaoundé, de Casablanca à
            Abidjan —{" "}
            <span className="text-brand-white">
              où qu&apos;il joue, le talent peut être vu.
            </span>
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="/inscription"
              className="rounded-md bg-brand-gold px-7 py-4 text-center text-base font-semibold text-brand-black transition hover:opacity-90"
            >
              Je suis joueur
            </a>
            <a
              href="/recruteur/inscription"
              className="rounded-md border border-brand-gold px-7 py-4 text-center text-base font-medium text-brand-gold transition hover:bg-brand-gold/10"
            >
              Je suis recruteur
            </a>
          </div>
        </div>
      </section>

      {/* PROMESSES */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Notre promesse
        </div>
        <h2 className="mb-12 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Ce qui rend {BRAND_NAME_WITH_DEGREE} différent.
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {PROMESSES.map((p) => (
            <article key={p.chiffre} className="border-t-2 border-brand-gold/30 pt-6">
              <div className="mb-3 font-mono text-2xl text-brand-gold">
                {p.chiffre}
              </div>
              <h3 className="mb-3 text-2xl font-semibold leading-tight">
                {p.titre}
              </h3>
              <p className="leading-relaxed text-zinc-700">{p.texte}</p>
            </article>
          ))}
        </div>
      </section>

      {/* NIVEAUX */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Niveaux de visibilité
        </div>
        <h2 className="mb-10 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Quatre paliers, lisibles d&apos;un coup d&apos;œil.
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEVEL_ORDER.map((k) => {
            const n = LEVELS[k];
            return (
              <div
                key={k}
                className="rounded-2xl p-6 transition hover:-translate-y-0.5"
                style={{
                  backgroundColor: n.background,
                  border: `1px solid ${n.border}`,
                  color: n.text,
                }}
              >
                <div
                  className="mb-3 text-3xl"
                  style={{ color: n.accent }}
                  aria-hidden
                >
                  {n.symbol}
                </div>
                <div
                  className="mb-1 text-2xl font-semibold"
                  style={{ color: n.accent }}
                >
                  {n.label}
                </div>
                <div className="font-mono text-xs opacity-70">
                  Score {n.range[0]}–{n.range[1]}
                </div>
                <p className="mt-4 text-sm leading-relaxed opacity-90">
                  {n.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CLOSING */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10">
        <h2 className="mb-8 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Ton talent existe.<br />
          <em className="not-italic text-brand-gold">
            Maintenant, fais-le voir.
          </em>
        </h2>
        <p className="mb-8 text-zinc-600">{BRAND_TAGLINE}</p>
        <a
          href="/inscription"
          className="inline-block rounded-md bg-brand-gold px-10 py-5 text-base font-semibold text-brand-black transition hover:opacity-90"
        >
          Créer mon profil
        </a>
      </section>
    </div>
  );
}
