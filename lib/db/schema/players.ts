import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type {
  AccountHolder,
  EmergencyContact,
  Representation,
} from "@/domain/player/types";
import {
  clubSituationEnum,
  dominantFootEnum,
  playerStatusEnum,
  positionEnum,
} from "./enums";

export const players = pgTable("players", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  stageName: text("stage_name"),
  dateOfBirth: timestamp("date_of_birth", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  nationality: text("nationality").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  clubSituation: clubSituationEnum("club_situation").notNull(),
  currentClub: text("current_club"),
  primaryPosition: positionEnum("primary_position").notNull(),
  secondaryPosition: positionEnum("secondary_position"),
  dominantFoot: dominantFootEnum("dominant_foot").notNull(),
  heightCm: integer("height_cm").notNull(),
  weightKg: integer("weight_kg").notNull(),
  parentalConsent: boolean("parental_consent").notNull(),
  emergencyContact: jsonb("emergency_contact").$type<EmergencyContact>(),
  accountHolder: jsonb("account_holder").$type<AccountHolder>(),
  avatarInitials: text("avatar_initials").notNull(),
  avatarColor: text("avatar_color").notNull(),
  status: playerStatusEnum("status").notNull(),
  registeredAt: timestamp("registered_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
  motivation: text("motivation").notNull(),
  openToOutreach: boolean("open_to_outreach"),
  representation: jsonb("representation").$type<Representation>(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});
