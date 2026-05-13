import type { PlayerId, ScoringId } from "@/domain/shared/id";
import type { Timestamps } from "@/domain/shared/timestamps";

export interface Scoring extends Timestamps {
  id: ScoringId;
  playerId: PlayerId;
}
