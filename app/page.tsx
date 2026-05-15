import { Logo } from "@/components/ui/Logo";
import { BRAND_TAGLINE } from "@/lib/brand";

// Splash RawSpot — animation CSS pure, 4.5 s.
// Halo doré pulsé, logo central, tagline, 2 CTAs.
// CTAs pointent sur /decouvrir (PR #9) et /connexion (PR #11) ; <a href>
// natifs car typedRoutes ne connaît pas encore ces routes.
export default function Page() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-brand-black px-6 text-brand-white">
      {/* Halo doré derrière le logo */}
      <div
        aria-hidden
        className="splash-halo pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[60vmin] w-[60vmin] rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-brand-gold) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="splash-logo text-brand-gold">
          <Logo variant="full" size="lg" />
        </div>

        <p className="splash-tagline mt-8 text-lg font-medium tracking-wide text-brand-white/85 sm:text-xl">
          {BRAND_TAGLINE}
        </p>

        <p className="splash-tagline mt-2 text-sm text-brand-white/55">
          La visibilité qui ouvre les portes.
        </p>

        <div className="splash-ctas mt-12 flex flex-col gap-3 sm:flex-row">
          <a
            href="/decouvrir"
            className="rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition hover:opacity-90"
          >
            Découvrir RawSpot
          </a>
          <a
            href="/connexion"
            className="rounded-md border border-brand-white/30 px-6 py-3 text-sm font-medium text-brand-white transition hover:border-brand-gold hover:text-brand-gold"
          >
            Connexion
          </a>
        </div>
      </div>
    </main>
  );
}
