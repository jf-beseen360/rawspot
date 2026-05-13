import { eq } from "drizzle-orm";
import type { ScoringRepository } from "@/domain/scoring/repository";
import type { Scoring } from "@/domain/scoring/types";
import type { PlayerId, ScoringId } from "@/domain/shared/id";
import { getDb } from "../client";
import { scorings } from "../schema/scorings";

type ScoringRow = typeof scorings.$inferSelect;

function toScoring(row: ScoringRow): Scoring {
  return {
    id: row.id as ScoringId,
    playerId: row.playerId as PlayerId,
    value: row.value,
    level: row.level,
    generatedAt: row.generatedAt,
    generatedBy: row.generatedBy,
    evaluation: row.evaluation,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const scoringRepository: ScoringRepository = {
  async findByPlayer(playerId) {
    const rows = await getDb()
      .select()
      .from(scorings)
      .where(eq(scorings.playerId, playerId))
      .limit(1);
    return rows[0] ? toScoring(rows[0]) : null;
  },
};
