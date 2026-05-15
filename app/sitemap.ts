import type { MetadataRoute } from "next";

// Sitemap — uniquement les routes statiques publiquement indexables.
// Routes exclues :
//   /non-autorise        — page utilitaire 403, pas pour indexation
//   /connexion           — page d'auth, pas pour indexation (volatile)
//   /p/[slug]            — route dynamique, sera étendue plus tard avec
//                          une fonction qui liste les slugs publiés depuis
//                          publicProfileRepository.
//
// Étendre la liste à mesure que les routes statiques sont ajoutées par les
// PRs suivantes (/agents, /scout, /inscription, /onboarding, etc.).
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rawspot.football";

const STATIC_ROUTES: ReadonlyArray<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/a-propos", changeFrequency: "monthly", priority: 0.8 },
  { path: "/decouvrir", changeFrequency: "weekly", priority: 0.9 },
  { path: "/parents", changeFrequency: "monthly", priority: 0.7 },
  { path: "/legal", changeFrequency: "monthly", priority: 0.5 },
  { path: "/bienvenue", changeFrequency: "monthly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
