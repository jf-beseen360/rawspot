import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        Profil introuvable
      </h1>
      <p className="mt-3 text-sm text-zinc-500">
        Le slug demandé ne correspond à aucun profil public.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-zinc-900 underline"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
