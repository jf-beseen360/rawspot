"use server";

import { randomUUID } from "node:crypto";
import {
  computeScoring,
  levelForScore,
  type Scoring,
  type ScoringResult,
} from "@/domain/scoring";
import { mediaRepository } from "@/lib/db/repositories/media.repository";
import { playerRepository } from "@/lib/db/repositories/player.repository";
import { scoringRepository } from "@/lib/db/repositories/scoring.repository";
import type { PlayerId, ScoringId } from "@/domain/shared/id";

// First vertical loop: UI -> Server Action -> domain use case ->
// Drizzle repository -> Postgres -> UI.
//
// Orchestration only — no business logic. computeScoring() lives in
// domain/scoring and is the source of truth for the algorithm.
export async function computeAndPersistScoring(
  playerId: string,
): Promise<ScoringResult> {
  const id = playerId as PlayerId;

  const player = await playerRepository.findById(id);
  if (!player) {
    throw new Error("player_not_found");
  }

  const medias = await mediaRepository.listByPlayer(id);
  const result = computeScoring(player, medias);

  const scoring: Scoring = {
    id: randomUUID() as ScoringId,
    playerId: player.id,
    value: result.value,
    level: levelForScore(result.value).key,
    generatedAt: result.generatedAt,
    generatedBy: result.generatedBy,
    evaluation: result.evaluation,
    createdAt: result.generatedAt,
    updatedAt: result.generatedAt,
  };

  await scoringRepository.upsert(scoring);

  return result;
}
