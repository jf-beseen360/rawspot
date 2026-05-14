import type { PlayerId } from "@/domain/shared/id";
import type { Scoring } from "./types";

export interface ScoringRepository {
  findByPlayer(playerId: PlayerId): Promise<Scoring | null>;
}
