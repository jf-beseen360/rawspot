import { eq } from "drizzle-orm";
import type { Player } from "@/domain/player/types";
import type { PlayerRepository } from "@/domain/player/repository";
import type { PlayerId } from "@/domain/shared/id";
import { getDb } from "../client";
import { players } from "../schema/players";

type PlayerRow = typeof players.$inferSelect;

function toPlayer(row: PlayerRow): Player {
  return {
    id: row.id as PlayerId,
    phone: row.phone,
    firstName: row.firstName,
    lastName: row.lastName,
    stageName: row.stageName ?? undefined,
    dateOfBirth: row.dateOfBirth,
    nationality: row.nationality,
    city: row.city,
    country: row.country,
    clubSituation: row.clubSituation,
    currentClub: row.currentClub ?? undefined,
    primaryPosition: row.primaryPosition,
    secondaryPosition: row.secondaryPosition ?? undefined,
    dominantFoot: row.dominantFoot,
    heightCm: row.heightCm,
    weightKg: row.weightKg,
    parentalConsent: row.parentalConsent,
    emergencyContact: row.emergencyContact ?? undefined,
    accountHolder: row.accountHolder ?? undefined,
    avatarInitials: row.avatarInitials,
    avatarColor: row.avatarColor,
    status: row.status,
    registeredAt: row.registeredAt,
    publishedAt: row.publishedAt ?? undefined,
    motivation: row.motivation,
    openToOutreach: row.openToOutreach ?? undefined,
    representation: row.representation ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const playerRepository: PlayerRepository = {
  async findById(id) {
    const rows = await getDb()
      .select()
      .from(players)
      .where(eq(players.id, id))
      .limit(1);
    return rows[0] ? toPlayer(rows[0]) : null;
  },
  async list() {
    const rows = await getDb().select().from(players).limit(100);
    return rows.map(toPlayer);
  },
};
