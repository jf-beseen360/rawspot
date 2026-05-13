import { and, eq } from "drizzle-orm";
import type { MediaRepository } from "@/domain/media/repository";
import type { Media } from "@/domain/media/types";
import type { MediaId, PlayerId } from "@/domain/shared/id";
import { getDb } from "../client";
import { medias } from "../schema/medias";

type MediaRow = typeof medias.$inferSelect;

function toMedia(row: MediaRow): Media {
  return {
    id: row.id as MediaId,
    playerId: row.playerId as PlayerId,
    kind: row.kind,
    title: row.title ?? undefined,
    durationSec: row.durationSec ?? undefined,
    format: row.format ?? undefined,
    segments: row.segments ?? undefined,
    blobRef: row.blobRef,
    posterMediaId: (row.posterMediaId ?? undefined) as MediaId | undefined,
    mimeType: row.mimeType ?? undefined,
    sizeBytes: row.sizeBytes ?? undefined,
    uploadedAt: row.uploadedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const mediaRepository: MediaRepository = {
  async findById(id) {
    const rows = await getDb()
      .select()
      .from(medias)
      .where(eq(medias.id, id))
      .limit(1);
    return rows[0] ? toMedia(rows[0]) : null;
  },
  async listByPlayer(playerId) {
    const rows = await getDb()
      .select()
      .from(medias)
      .where(eq(medias.playerId, playerId));
    return rows.map(toMedia);
  },
  async listByPlayerAndKind(playerId, kind) {
    const rows = await getDb()
      .select()
      .from(medias)
      .where(and(eq(medias.playerId, playerId), eq(medias.kind, kind)));
    return rows.map(toMedia);
  },
  async save(media) {
    const row = {
      id: media.id,
      playerId: media.playerId,
      kind: media.kind,
      title: media.title ?? null,
      durationSec: media.durationSec ?? null,
      format: media.format ?? null,
      segments: media.segments ?? null,
      blobRef: media.blobRef,
      posterMediaId: media.posterMediaId ?? null,
      mimeType: media.mimeType ?? null,
      sizeBytes: media.sizeBytes ?? null,
      uploadedAt: media.uploadedAt,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    };
    await getDb()
      .insert(medias)
      .values(row)
      .onConflictDoUpdate({ target: medias.id, set: row });
  },
  async delete(id) {
    await getDb().delete(medias).where(eq(medias.id, id));
  },
};
