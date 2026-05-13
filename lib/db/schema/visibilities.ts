import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { players } from "./players";

export const visibilities = pgTable("visibilities", {
  id: text("id").primaryKey(),
  playerId: text("player_id")
    .notNull()
    .unique()
    .references(() => players.id, { onDelete: "cascade" }),
  viewCount: integer("view_count").notNull().default(0),
  interestCount: integer("interest_count").notNull().default(0),
  lastViewedAt: timestamp("last_viewed_at", {
    withTimezone: true,
    mode: "date",
  }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});
