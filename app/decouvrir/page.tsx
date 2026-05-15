import type { Metadata } from "next";
import { BRAND_NAME_WITH_DEGREE } from "@/lib/brand";

// PR #9 — Page publique "Découvrir".
// IMPORTÉ PUIS CORRIGÉ : la version legacy montrait une carte d'Afrique
// interactive + liste filtrable de joueurs derrière un mur recruteur/agent.
// Cette version v1 est statique (présentation + CTA) en attendant :
// - PR #16 scout/recruteur (portail + filtres + CarteAfrique)
// - PR #13 /moi (profil joueur public en lecture)
// La cible reste la même : expliquer le périmètre Afrique francophone
// et orienter selon le rôle (joueur / recruteur-agent).

export const metadata: Metadata = {
  title: "Découvrir",
  description: `Découvre comment ${BRAND_NAME_WITH_DEGREE} rend visibles les jeunes talents du football d'Afrique francophone auprès des recruteurs et agents FIFA.`,
};

const ETAPES = [
  {
    chiffre: "01",
    titre: "Le joueur s'inscrit",
    texte:
      "Identité, profil athlétique, 2 à 4 vidéos. Inscription gratuite, 15 minutes. Mineurs : double opt-in du titulaire de compte adulte (Article 19 FIFA).",
  },
  {
    chiffre: "02",
    titre: "L'IA évalue",
    texte:
      "Notre algorithme déterministe note le profil sur 8 critères par poste à partir d'éléments objectifs : taille, âge, situation de formation, complétude vidéo. Score 0-100, niveau Bronze/Argent/Or/Platine.",
  },
  {
    chiffre: "03",
    titre: "Les recruteurs choisissent",
    texte:
      "Les recruteurs vérifiés explorent les talents par poste, âge et zone géographique. Le score IA et les vidéos brutes leur permettent de décider. RawSpot° ne sélectionne pas — RawSpot° rend visible.",
  },
] as const;

export default function DecouvrirPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
        <span className="block h-px w-6 bg-brand-gold" />
        Découvrir
      </div>
      <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
        Le football francophone,{" "}
        <em className="not-italic text-brand-gold">vu d&apos;en haut</em>.
      </h1>
      <p className="mb-12 max-w-2xl text-lg leading-relaxed text-zinc-700">
        {BRAND_NAME_WITH_DEGREE} met en visibilité les jeunes talents du
        football d&apos;Afrique francophone — Sénégal, Côte d&apos;Ivoire,
        Cameroun, Mali, Maroc, Algérie, et plus encore — auprès des
        recruteurs et agents FIFA vérifiés.
      </p>

      <section className="grid gap-6 sm:grid-cols-3">
        {ETAPES.map((e) => (
          <article
            key={e.chiffre}
            className="rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <div className="mb-3 font-mono text-2xl text-brand-gold">
              {e.chiffre}
            </div>
            <h2 className="mb-3 text-xl font-semibold leading-tight">
              {e.titre}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700">{e.texte}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-8 sm:p-10">
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-brand-gold">
          Côté recruteurs et agents
        </div>
        <h2 className="mb-4 text-2xl font-semibold leading-tight sm:text-3xl">
          L&apos;accès aux profils détaillés est réservé aux comptes vérifiés.
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-zinc-700">
          Pour protéger les jeunes joueurs et leur famille, seuls les
          recruteurs accrédités et les agents licenciés FIFA peuvent consulter
          les fiches complètes, les vidéos et marquer un intérêt. Inscription
          rapide, validation par notre équipe.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/recruteur/inscription"
            className="rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition hover:opacity-90"
          >
            S&apos;inscrire comme recruteur
          </a>
          <a
            href="/agents/inscription"
            className="rounded-md border border-zinc-900 px-6 py-3 text-sm font-medium transition hover:bg-zinc-900 hover:text-white"
          >
            S&apos;inscrire comme agent FIFA
          </a>
          <a
            href="/connexion"
            className="rounded-md border border-zinc-300 px-6 py-3 text-sm font-medium transition hover:border-zinc-500"
          >
            J&apos;ai déjà un compte
          </a>
        </div>
      </section>

      <section className="mt-16 text-center">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          Tu es joueur ?
        </h2>
        <p className="mb-6 text-zinc-600">
          Crée ton profil. Reçois ton score IA. Sois vu par les bons
          recruteurs.
        </p>
        <a
          href="/inscription"
          className="inline-block rounded-md bg-brand-black px-8 py-3 text-sm font-semibold text-brand-white transition hover:bg-zinc-800"
        >
          Créer mon profil joueur
        </a>
      </section>
    </main>
  );
}
