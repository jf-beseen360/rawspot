import type { MediaId, PlayerId } from "@/domain/shared/id";
import type { Timestamps } from "@/domain/shared/timestamps";

// Legacy unification:
//   Video (type=match)        → match_video
//   Video (type=geste_tech.)  → tech_video
//   VideoPresentation         → presentation_video
//   Highlight                 → highlight
//   Joueur.photoDataUrl       → avatar_photo
//   posterDataUrl (inline)    → poster (own Media, referenced via posterMediaId)
export type MediaKind =
  | "match_video"
  | "tech_video"
  | "presentation_video"
  | "highlight"
  | "avatar_photo"
  | "poster";

export type MediaFormat = "vertical" | "horizontal";

// `blobRef` is an opaque storage reference (e.g. IndexedDB key in legacy,
// future Supabase Storage path or signed URL key). Resolved by the storage
// layer chosen in PR #4 — domain stays storage-agnostic.
export interface Media extends Timestamps {
  id: MediaId;
  playerId: PlayerId;
  kind: MediaKind;
  title?: string;
  durationSec?: number;
  format?: MediaFormat;
  segments?: number;
  blobRef: string;
  posterMediaId?: MediaId;
  mimeType?: string;
  sizeBytes?: number;
  uploadedAt: Date;
}
