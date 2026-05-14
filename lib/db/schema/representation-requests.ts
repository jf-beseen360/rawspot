import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { players } from "./players";

export const representationRequestStatusEnum = pgEnum(
  "representation_request_status",
  ["sent", "accepted", "rejected", "expired"],
);

// Snapshot des champs agent (agentName, agentFifaLicense) intentionnel : pas
// de FK vers fifa_agents tant que la table n'existe pas. Permet de tracer la
// demande même si l'agent est désinscrit ultérieurement.
export const representationRequests = pgTable(
  "representation_requests",
  {
    id: text("id").primaryKey(),
    agentId: text("agent_id").notNull(),
    agentName: text("agent_name").notNull(),
    agentFifaLicense: text("agent_fifa_license").notNull(),
    playerId: text("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    sentAt: timestamp("sent_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    status: representationRequestStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("representation_requests_player_id_idx").on(table.playerId),
    index("representation_requests_agent_player_status_idx").on(
      table.agentId,
      table.playerId,
      table.status,
    ),
  ],
);
