import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { Evaluation } from "@/domain/scoring/types";
import { levelEnum } from "./enums";
import { players } from "./players";

export const scorings = pgTable("scorings", {
  id: text("id").primaryKey(),
  playerId: text("player_id")
    .notNull()
    .unique()
    .references(() => players.id, { onDelete: "cascade" }),
  value: integer("value").notNull(),
  level: levelEnum("level").notNull(),
  generatedAt: timestamp("generated_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  generatedBy: text("generated_by").notNull(),
  evaluation: jsonb("evaluation").$type<Evaluation>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});
