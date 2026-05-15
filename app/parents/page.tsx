import type { Metadata } from "next";
import { BRAND_NAME_WITH_DEGREE } from "@/lib/brand";

// PR #9 — Page publique "Parents / tuteurs".
// IMPORTÉ TEL QUEL (copywriting préservé) PUIS CORRIGÉ :
// - stack rawspot (Tailwind v4 + brand tokens).
// - retrait de la mention "22 langues" (scope v1 FR).
// - link Contact → /legal#contact (existe après PR #9).

export const metadata: Metadata = {
  title: "Pour les parents — protection des mineurs",
  description: `${BRAND_NAME_WITH_DEGREE} — comment nous protégeons les jeunes joueurs : score IA transparent, aucun contact direct, Article 19 FIFA, consentement parental, RGPD.`,
};

const CARTES: ReadonlyArray<{ titre: string; texte: string }> = [
  {
    titre: "Score IA transparent, sans intervention humaine",
    texte:
      "Notre algorithme calcule 8 critères par poste à partir d'éléments objectifs et vérifiables (taille, poids, âge, situation de formation, complétude du dossier vidéo). Il ne falsifie rien, ne monte rien, ne masque rien. Le recruteur voit le score ET les vidéos brutes.",
  },
  {
    titre: "Aucun contact direct entre votre enfant et un recruteur",
    texte:
      "Quand un club marque son intérêt, vous et votre enfant recevez une notification anonymisée. L'identité du club est dévoilée seulement quand l'agent FIFA choisi par votre enfant organise un échange formel. Aucune messagerie privée, aucun appel direct.",
  },
  {
    titre: "Place de marché ouverte des agents FIFA",
    texte:
      "Tous les agents licenciés FIFA peuvent rejoindre la plateforme. C'est votre enfant qui choisit librement son représentant, parmi tous ceux disponibles. Personne ne lui sera imposé.",
  },
  {
    titre: "Consentement parental obligatoire pour tout joueur mineur",
    texte:
      "L'inscription d'un mineur n'est validée qu'après confirmation explicite du représentant légal. Cette validation est physiquement présente dans le parcours d'inscription et journalisée.",
  },
  {
    titre: "Conformité Article 19 FIFA",
    texte:
      "L'Article 19 du Règlement FIFA encadre strictement les transferts internationaux de mineurs. RawSpot° n'organise JAMAIS de transfert direct vers un club étranger pour un joueur de moins de 18 ans, sauf dans les exceptions FIFA encadrées par un agent licencié.",
  },
  {
    titre: "Pas de partage public de coordonnées",
    texte:
      "Le numéro de téléphone, l'adresse exacte du domicile, le nom de l'établissement scolaire ne sont jamais affichés publiquement. Seuls la ville et le club d'entraînement sont visibles.",
  },
  {
    titre: "Droit de retrait à tout moment",
    texte:
      "Vous pouvez demander le retrait du profil de votre enfant à tout moment, sans justification. La suppression est effective sous 48 h, RGPD intégral.",
  },
];

export default function ParentsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
        <span className="block h-px w-6 bg-brand-gold" />
        Pour les parents et tuteurs
      </div>
      <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
        Votre enfant veut être vu.<br />
        <em className="not-italic text-brand-gold">
          Voici comment nous le protégeons.
        </em>
      </h1>
      <p className="mb-10 text-lg leading-relaxed text-zinc-700">
        {BRAND_NAME_WITH_DEGREE} est une{" "}
        <strong>place de marché neutre</strong>. Nous mettons à disposition un
        score IA objectif et des vidéos brutes ; le recruteur décide en
        autonomie. Aucun analyste humain ne juge votre enfant à notre place, et
        aucun agent ne lui est imposé.
      </p>

      <div className="space-y-5">
        {CARTES.map((c) => (
          <article
            key={c.titre}
            className="rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <h2 className="mb-2 flex items-start gap-3 text-lg font-semibold">
              <span className="text-2xl leading-none text-brand-gold" aria-hidden>
                ✓
              </span>
              <span>{c.titre}</span>
            </h2>
            <p className="pl-9 leading-relaxed text-zinc-700">{c.texte}</p>
          </article>
        ))}
      </div>

      <section className="mt-16 rounded-2xl bg-brand-black p-7 text-brand-white sm:p-10">
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-brand-gold">
          Une question, un doute, une inquiétude
        </div>
        <h2 className="mb-4 text-3xl font-semibold leading-tight">
          Parlez à un membre de l&apos;équipe {BRAND_NAME_WITH_DEGREE}.
        </h2>
        <p className="mb-6 leading-relaxed text-brand-white/80">
          L&apos;équipe répond personnellement à chaque parent qui prend
          contact, en moins de 48 heures ouvrées, en français.
        </p>
        <a
          href="/legal#contact"
          className="inline-block rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition hover:opacity-90"
        >
          Nous contacter
        </a>
      </section>

      <p className="mt-12 text-sm italic text-zinc-600">
        La plateforme amplifie la visibilité de votre enfant. Le recruteur
        reste seul juge en regardant les vidéos. Le choix de l&apos;agent
        reste libre. Voilà notre engagement.
      </p>
    </main>
  );
}
