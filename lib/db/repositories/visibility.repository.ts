import { eq } from "drizzle-orm";
import type {
  InterestId,
  PlayerId,
  VisibilityId,
} from "@/domain/shared/id";
import type { VisibilityRepository } from "@/domain/visibility/repository";
import type { Interest, Visibility } from "@/domain/visibility/types";
import { getDb } from "../client";
import { interests } from "../schema/interests";
import { visibilities } from "../schema/visibilities";

type VisibilityRow = typeof visibilities.$inferSelect;
type InterestRow = typeof interests.$inferSelect;

function toVisibility(row: VisibilityRow): Visibility {
  return {
    id: row.id as VisibilityId,
    playerId: row.playerId as PlayerId,
    viewCount: row.viewCount,
    interestCount: row.interestCount,
    lastViewedAt: row.lastViewedAt ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toInterest(row: InterestRow): Interest {
  return {
    id: row.id as InterestId,
    playerId: row.playerId as PlayerId,
    scout: {
      id: row.scoutId,
      name: row.scoutName,
      organization: row.scoutOrganization,
    },
    markedAt: row.markedAt,
    privateNote: row.privateNote ?? undefined,
  };
}

export const visibilityRepository: VisibilityRepository = {
  async findByPlayer(playerId) {
    const rows = await getDb()
      .select()
      .from(visibilities)
      .where(eq(visibilities.playerId, playerId))
      .limit(1);
    return rows[0] ? toVisibility(rows[0]) : null;
  },
  async listInterestsByPlayer(playerId) {
    const rows = await getDb()
      .select()
      .from(interests)
      .where(eq(interests.playerId, playerId));
    return rows.map(toInterest);
  },
};
