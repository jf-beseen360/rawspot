import type { Metadata } from "next";

// PR #9 — Page publique "Bienvenue" (préparation à l'inscription joueur).
// IMPORTÉ TEL QUEL (copywriting préservé) PUIS CORRIGÉ : stack rawspot.
// Le CTA pointe sur /inscription (PR #12). En attendant que cette route
// existe, le clic donnera un 404 — pas bloquant pour la build.

export const metadata: Metadata = {
  title: "Bienvenue",
  description:
    "Avant de commencer ton inscription joueur, prends 2 minutes pour préparer ce qu'il te faut.",
};

const CARTES = [
  {
    icone: "📱",
    titre: "Un téléphone qui reçoit des SMS",
    texte: "On t'envoie un code à 6 chiffres pour valider.",
  },
  {
    icone: "📷",
    titre: "Une photo de profil",
    texte:
      "Visage net, lumière naturelle. Tu peux la prendre tout de suite.",
  },
  {
    icone: "🎬",
    titre: "2 à 4 vidéos de toi",
    texte:
      "Idéalement deux extraits de match et une démo technique.",
  },
  {
    icone: "📞",
    titre: "Un contact d'urgence",
    texte:
      "Une personne joignable rapidement à indiquer (jamais publique).",
  },
  {
    icone: "📏",
    titre: "Tes mensurations",
    texte: "Taille, poids, pied fort.",
  },
  {
    icone: "👨‍👩‍👧",
    titre: "Si tu as moins de 18 ans",
    texte: "L'accord d'un parent ou tuteur légal.",
  },
] as const;

export default function BienvenuePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14 sm:py-20">
      <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
        <span className="block h-px w-6 bg-brand-gold" />
        Bienvenue
      </div>
      <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
        Avant de commencer,{" "}
        <em className="not-italic text-brand-gold">prends 2 minutes</em>.
      </h1>
      <p className="mb-12 text-lg leading-relaxed text-zinc-700">
        Ton inscription prend une quinzaine de minutes. Lis ce qui suit,
        prépare ce qu&apos;il te faut, et lance-toi sereinement.
      </p>

      <section className="mb-12">
        <h2 className="mb-5 text-2xl font-semibold">Ce qu&apos;il te faut</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {CARTES.map((c) => (
            <article
              key={c.titre}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="mb-3 text-3xl" aria-hidden>
                {c.icone}
              </div>
              <div className="mb-1 font-semibold">{c.titre}</div>
              <div className="text-sm leading-relaxed text-zinc-600">
                {c.texte}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-7">
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-brand-gold">
          Bon à savoir
        </div>
        <h3 className="mb-3 text-xl font-semibold leading-tight">
          Tu peux t&apos;arrêter et reprendre.
        </h3>
        <p className="text-sm leading-relaxed text-zinc-700">
          Tes réponses sont sauvegardées au fur et à mesure. Si tu n&apos;as
          pas le temps de tout faire d&apos;un coup, ferme l&apos;onglet et
          reviens plus tard.
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="/inscription"
          className="rounded-md bg-brand-gold px-8 py-4 text-center text-base font-semibold text-brand-black transition hover:opacity-90"
        >
          C&apos;est parti, je commence
        </a>
      </div>
    </main>
  );
}
