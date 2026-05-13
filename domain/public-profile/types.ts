import type {
  MediaId,
  PlayerId,
  PublicProfileId,
} from "@/domain/shared/id";
import type {
  ClubSituation,
  DominantFoot,
  Position,
} from "@/domain/shared/position";
import type { Timestamps } from "@/domain/shared/timestamps";
import type { PlayerStatus } from "@/domain/player/types";

export interface PublicProfileSummary {
  primaryPosition: Position;
  secondaryPosition?: Position;
  dominantFoot: DominantFoot;
  heightCm: number;
  weightKg: number;
  ageYears: number;
  city: string;
  country: string;
  nationality: string;
  currentClub?: string;
  clubSituation: ClubSituation;
}

export interface PublicProfileAvatar {
  initials: string;
  color: string;
  photoMediaId?: MediaId;
}

// Read-only projection of a Player for the public route (/p/[slug]).
// `slug` is the canonical public key — Player keeps an opaque id.
export interface PublicProfile extends Timestamps {
  id: PublicProfileId;
  playerId: PlayerId;
  slug: string;
  displayName: string;
  status: PlayerStatus;
  publishedAt?: Date;
  summary: PublicProfileSummary;
  avatar: PublicProfileAvatar;
}
