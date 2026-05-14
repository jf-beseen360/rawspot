import { notFound } from "next/navigation";
import type { PlayerStatus } from "@/domain/player/types";
import { LEVELS } from "@/domain/scoring/level";
import type {
  ClubSituation,
  DominantFoot,
  Position,
} from "@/domain/shared/position";
import { publicProfileRepository } from "@/lib/db/repositories/public-profile.repository";
import { scoringRepository } from "@/lib/db/repositories/scoring.repository";
import { visibilityRepository } from "@/lib/db/repositories/visibility.repository";

export const dynamic = "force-dynamic";

const POSITION_LABELS: Record<Position, string> = {
  goalkeeper: "Gardien",
  centre_back: "Défenseur central",
  full_back: "Latéral",
  defensive_midfielder: "Sentinelle",
  central_midfielder: "Relayeur",
  attacking_midfielder: "Meneur",
  winger: "Ailier",
  striker: "Attaquant",
};

const FOOT_LABELS: Record<DominantFoot, string> = {
  left: "Gauche",
  right: "Droit",
  both: "Ambidextre",
};

const CLUB_SITUATION_LABELS: Record<ClubSituation, string> = {
  amateur_club: "Club amateur",
  academy: "Académie",
  no_club: "Sans club",
  training_centre: "Centre de formation",
};

const STATUS_LABELS: Record<PlayerStatus, string> = {
  draft: "Brouillon",
  videos_in_progress: "Vidéos en cours",
  in_review: "En évaluation",
  published: "Publié",
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await publicProfileRepository.findBySlug(slug);
  if (!profile) notFound();

  const [scoring, visibility] = await Promise.all([
    scoringRepository.findByPlayer(profile.playerId),
    visibilityRepository.findByPlayer(profile.playerId),
  ]);

  const level = scoring ? LEVELS[scoring.level] : null;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <header className="flex items-start gap-6">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-white"
          style={{ backgroundColor: profile.avatar.color }}
          aria-hidden
        >
          {profile.avatar.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            {profile.displayName}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {POSITION_LABELS[profile.summary.primaryPosition]} ·{" "}
            {profile.summary.ageYears} ans · {profile.summary.city},{" "}
            {profile.summary.country}
          </p>
          <span className="mt-3 inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
            {STATUS_LABELS[profile.status]}
          </span>
        </div>
        {scoring && level ? (
          <div
            className="flex flex-col items-center rounded-xl border px-4 py-3"
            style={{
              backgroundColor: level.background,
              borderColor: level.border,
              color: level.text,
            }}
          >
            <span className="text-3xl font-semibold">{scoring.value}</span>
            <span className="mt-1 text-[10px] uppercase tracking-wider">
              {level.symbol} {level.label}
            </span>
          </div>
        ) : null}
      </header>

      <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Detail
          label="Poste secondaire"
          value={
            profile.summary.secondaryPosition
              ? POSITION_LABELS[profile.summary.secondaryPosition]
              : "—"
          }
        />
        <Detail
          label="Pied fort"
          value={FOOT_LABELS[profile.summary.dominantFoot]}
        />
        <Detail label="Taille" value={`${profile.summary.heightCm} cm`} />
        <Detail label="Poids" value={`${profile.summary.weightKg} kg`} />
        <Detail
          label="Situation club"
          value={CLUB_SITUATION_LABELS[profile.summary.clubSituation]}
        />
        <Detail
          label="Club actuel"
          value={profile.summary.currentClub ?? "—"}
        />
        <Detail label="Nationalité" value={profile.summary.nationality} />
      </dl>

      {visibility ? (
        <footer className="mt-10 flex items-center gap-6 border-t border-zinc-100 pt-6 text-sm text-zinc-500">
          <span>
            <strong className="font-medium text-zinc-900">
              {visibility.viewCount}
            </strong>{" "}
            vues
          </span>
          <span>
            <strong className="font-medium text-zinc-900">
              {visibility.interestCount}
            </strong>{" "}
            intérêts
          </span>
        </footer>
      ) : null}
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-zinc-900">{value}</dd>
    </div>
  );
}
