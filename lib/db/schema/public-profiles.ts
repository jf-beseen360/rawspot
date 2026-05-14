import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type {
  PublicProfileAvatar,
  PublicProfileSummary,
} from "@/domain/public-profile/types";
import { playerStatusEnum } from "./enums";
import { players } from "./players";

export const publicProfiles = pgTable("public_profiles", {
  id: text("id").primaryKey(),
  playerId: text("player_id")
    .notNull()
    .unique()
    .references(() => players.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  displayName: text("display_name").notNull(),
  status: playerStatusEnum("status").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
  summary: jsonb("summary").$type<PublicProfileSummary>().notNull(),
  avatar: jsonb("avatar").$type<PublicProfileAvatar>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});
