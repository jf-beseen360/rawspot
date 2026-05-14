import type { PlayerId } from "@/domain/shared/id";
import type { Scoring } from "./types";

export interface ScoringRepository {
  findByPlayer(playerId: PlayerId): Promise<Scoring | null>;
  // Idempotent by primary key (id): INSERT, or UPDATE if same id already exists.
  save(scoring: Scoring): Promise<void>;
  // Idempotent by playerId (unique): a player has at most one scoring row.
  // Used by the recompute flow — each call replaces value/level/evaluation
  // for the existing playerId, keeping the original row id.
  upsert(scoring: Scoring): Promise<void>;
}
