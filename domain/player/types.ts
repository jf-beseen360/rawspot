import type { PlayerId } from "@/domain/shared/id";
import type { Timestamps } from "@/domain/shared/timestamps";

export interface Player extends Timestamps {
  id: PlayerId;
}
