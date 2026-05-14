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

function toRow(scoring: Scoring) {
  return {
    id: scoring.id,
    playerId: scoring.playerId,
    value: scoring.value,
    level: scoring.level,
    generatedAt: scoring.generatedAt,
    generatedBy: scoring.generatedBy,
    evaluation: scoring.evaluation,
    createdAt: scoring.createdAt,
    updatedAt: scoring.updatedAt,
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
  async save(scoring) {
    const row = toRow(scoring);
    await getDb()
      .insert(scorings)
      .values(row)
      .onConflictDoUpdate({ target: scorings.id, set: row });
  },
  async upsert(scoring) {
    const row = toRow(scoring);
    await getDb()
      .insert(scorings)
      .values(row)
      .onConflictDoUpdate({
        target: scorings.playerId,
        set: {
          value: row.value,
          level: row.level,
          generatedAt: row.generatedAt,
          generatedBy: row.generatedBy,
          evaluation: row.evaluation,
          updatedAt: row.updatedAt,
        },
      });
  },
};
