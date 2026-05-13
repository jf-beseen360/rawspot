import type { MediaId, PlayerId } from "@/domain/shared/id";
import type { Media } from "./types";

export interface MediaRepository {
  findById(id: MediaId): Promise<Media | null>;
  listByPlayer(playerId: PlayerId): Promise<Media[]>;
}
