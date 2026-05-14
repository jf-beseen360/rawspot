CREATE TYPE "public"."representation_request_status" AS ENUM('sent', 'accepted', 'rejected', 'expired');--> statement-breakpoint
CREATE TABLE "representation_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"agent_id" text NOT NULL,
	"agent_name" text NOT NULL,
	"agent_fifa_license" text NOT NULL,
	"player_id" text NOT NULL,
	"message" text NOT NULL,
	"sent_at" timestamp with time zone NOT NULL,
	"status" "representation_request_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "representation_requests" ADD CONSTRAINT "representation_requests_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "representation_requests_player_id_idx" ON "representation_requests" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "representation_requests_agent_player_status_idx" ON "representation_requests" USING btree ("agent_id","player_id","status");