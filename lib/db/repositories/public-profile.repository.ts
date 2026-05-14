import { eq } from "drizzle-orm";
import type {
  PublicProfileRepository,
} from "@/domain/public-profile/repository";
import type { PublicProfile } from "@/domain/public-profile/types";
import type { PlayerId, PublicProfileId } from "@/domain/shared/id";
import { getDb } from "../client";
import { publicProfiles } from "../schema/public-profiles";

type PublicProfileRow = typeof publicProfiles.$inferSelect;

function toPublicProfile(row: PublicProfileRow): PublicProfile {
  return {
    id: row.id as PublicProfileId,
    playerId: row.playerId as PlayerId,
    slug: row.slug,
    displayName: row.displayName,
    status: row.status,
    publishedAt: row.publishedAt ?? undefined,
    summary: row.summary,
    avatar: row.avatar,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const publicProfileRepository: PublicProfileRepository = {
  async findBySlug(slug) {
    const rows = await getDb()
      .select()
      .from(publicProfiles)
      .where(eq(publicProfiles.slug, slug))
      .limit(1);
    return rows[0] ? toPublicProfile(rows[0]) : null;
  },
  async list() {
    const rows = await getDb().select().from(publicProfiles).limit(50);
    return rows.map(toPublicProfile);
  },
};
