import type { MediaId, PlayerId } from "@/domain/shared/id";
import type { Timestamps } from "@/domain/shared/timestamps";

export interface Media extends Timestamps {
  id: MediaId;
  playerId: PlayerId;
}
