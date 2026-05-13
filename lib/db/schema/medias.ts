import {
  type AnyPgColumn,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { mediaFormatEnum, mediaKindEnum } from "./enums";
import { players } from "./players";

export const medias = pgTable("medias", {
  id: text("id").primaryKey(),
  playerId: text("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  kind: mediaKindEnum("kind").notNull(),
  title: text("title"),
  durationSec: integer("duration_sec"),
  format: mediaFormatEnum("format"),
  segments: integer("segments"),
  blobRef: text("blob_ref").notNull(),
  posterMediaId: text("poster_media_id").references(
    (): AnyPgColumn => medias.id,
    { onDelete: "set null" },
  ),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes"),
  uploadedAt: timestamp("uploaded_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});
