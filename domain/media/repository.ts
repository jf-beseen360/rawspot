import type { MediaId, PlayerId } from "@/domain/shared/id";
import type { Media, MediaKind } from "./types";

// Metadata-only contract. Binary I/O (upload, signed URL, stream) lives in a
// separate MediaStorage interface introduced with the storage choice in PR #4.
export interface MediaRepository {
  findById(id: MediaId): Promise<Media | null>;
  listByPlayer(playerId: PlayerId): Promise<Media[]>;
  listByPlayerAndKind(playerId: PlayerId, kind: MediaKind): Promise<Media[]>;
  save(media: Media): Promise<void>;
  delete(id: MediaId): Promise<void>;
}
