import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { players } from "./players";

export const interests = pgTable(
  "interests",
  {
    id: text("id").primaryKey(),
    playerId: text("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    scoutId: text("scout_id").notNull(),
    scoutName: text("scout_name").notNull(),
    scoutOrganization: text("scout_organization").notNull(),
    markedAt: timestamp("marked_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    privateNote: text("private_note"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("interests_player_id_idx").on(table.playerId)],
);
