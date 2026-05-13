export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="flex items-start gap-6">
        <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-zinc-200" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
    </main>
  );
}
