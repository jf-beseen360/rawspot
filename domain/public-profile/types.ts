import type { PlayerId, PublicProfileId } from "@/domain/shared/id";
import type { Timestamps } from "@/domain/shared/timestamps";

export interface PublicProfile extends Timestamps {
  id: PublicProfileId;
  playerId: PlayerId;
}
