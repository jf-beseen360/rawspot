import type { PlayerId, VisibilityId } from "@/domain/shared/id";
import type { Timestamps } from "@/domain/shared/timestamps";

export interface Visibility extends Timestamps {
  id: VisibilityId;
  playerId: PlayerId;
}
