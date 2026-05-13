import { pgEnum } from "drizzle-orm/pg-core";

export const playerStatusEnum = pgEnum("player_status", [
  "draft",
  "videos_in_progress",
  "in_review",
  "published",
]);

export const positionEnum = pgEnum("position", [
  "goalkeeper",
  "centre_back",
  "full_back",
  "defensive_midfielder",
  "central_midfielder",
  "attacking_midfielder",
  "winger",
  "striker",
]);

export const dominantFootEnum = pgEnum("dominant_foot", [
  "left",
  "right",
  "both",
]);

export const clubSituationEnum = pgEnum("club_situation", [
  "amateur_club",
  "academy",
  "no_club",
  "training_centre",
]);

export const levelEnum = pgEnum("level", [
  "bronze",
  "silver",
  "gold",
  "platinum",
]);

export const mediaKindEnum = pgEnum("media_kind", [
  "match_video",
  "tech_video",
  "presentation_video",
  "highlight",
  "avatar_photo",
  "poster",
]);

export const mediaFormatEnum = pgEnum("media_format", [
  "vertical",
  "horizontal",
]);
