CREATE TYPE "public"."club_situation" AS ENUM('amateur_club', 'academy', 'no_club', 'training_centre');--> statement-breakpoint
CREATE TYPE "public"."dominant_foot" AS ENUM('left', 'right', 'both');--> statement-breakpoint
CREATE TYPE "public"."level" AS ENUM('bronze', 'silver', 'gold', 'platinum');--> statement-breakpoint
CREATE TYPE "public"."media_format" AS ENUM('vertical', 'horizontal');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('match_video', 'tech_video', 'presentation_video', 'highlight', 'avatar_photo', 'poster');--> statement-breakpoint
CREATE TYPE "public"."player_status" AS ENUM('draft', 'videos_in_progress', 'in_review', 'published');--> statement-breakpoint
CREATE TYPE "public"."position" AS ENUM('goalkeeper', 'centre_back', 'full_back', 'defensive_midfielder', 'central_midfielder', 'attacking_midfielder', 'winger', 'striker');--> statement-breakpoint
CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"stage_name" text,
	"date_of_birth" timestamp with time zone NOT NULL,
	"nationality" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"club_situation" "club_situation" NOT NULL,
	"current_club" text,
	"primary_position" "position" NOT NULL,
	"secondary_position" "position",
	"dominant_foot" "dominant_foot" NOT NULL,
	"height_cm" integer NOT NULL,
	"weight_kg" integer NOT NULL,
	"parental_consent" boolean NOT NULL,
	"emergency_contact" jsonb,
	"account_holder" jsonb,
	"avatar_initials" text NOT NULL,
	"avatar_color" text NOT NULL,
	"status" "player_status" NOT NULL,
	"registered_at" timestamp with time zone NOT NULL,
	"published_at" timestamp with time zone,
	"motivation" text NOT NULL,
	"open_to_outreach" boolean,
	"representation" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"slug" text NOT NULL,
	"display_name" text NOT NULL,
	"status" "player_status" NOT NULL,
	"published_at" timestamp with time zone,
	"summary" jsonb NOT NULL,
	"avatar" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "public_profiles_player_id_unique" UNIQUE("player_id"),
	CONSTRAINT "public_profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "scorings" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"value" integer NOT NULL,
	"level" "level" NOT NULL,
	"generated_at" timestamp with time zone NOT NULL,
	"generated_by" text NOT NULL,
	"evaluation" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scorings_player_id_unique" UNIQUE("player_id")
);
--> statement-breakpoint
CREATE TABLE "visibilities" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"interest_count" integer DEFAULT 0 NOT NULL,
	"last_viewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "visibilities_player_id_unique" UNIQUE("player_id")
);
--> statement-breakpoint
CREATE TABLE "interests" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"scout_id" text NOT NULL,
	"scout_name" text NOT NULL,
	"scout_organization" text NOT NULL,
	"marked_at" timestamp with time zone NOT NULL,
	"private_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medias" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"kind" "media_kind" NOT NULL,
	"title" text,
	"duration_sec" integer,
	"format" "media_format",
	"segments" integer,
	"blob_ref" text NOT NULL,
	"poster_media_id" text,
	"mime_type" text,
	"size_bytes" integer,
	"uploaded_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "public_profiles" ADD CONSTRAINT "public_profiles_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scorings" ADD CONSTRAINT "scorings_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visibilities" ADD CONSTRAINT "visibilities_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interests" ADD CONSTRAINT "interests_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_poster_media_id_medias_id_fk" FOREIGN KEY ("poster_media_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "interests_player_id_idx" ON "interests" USING btree ("player_id");