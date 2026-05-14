// 403 — page affichée par le middleware quand l'utilisateur est authentifié
// mais ne dispose pas du rôle requis pour la route demandée.

export default function NonAutorisePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-wider text-zinc-500">403</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        Accès non autorisé
      </h1>
      <p className="mt-4 text-sm text-zinc-600">
        Ton compte n&apos;a pas les droits nécessaires pour accéder à cette
        page. Si tu penses que c&apos;est une erreur, contacte l&apos;équipe
        RawSpot.
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:border-zinc-500"
      >
        Retour à l&apos;accueil
      </a>
    </main>
  );
}
