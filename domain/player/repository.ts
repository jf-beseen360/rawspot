import type { PlayerId } from "@/domain/shared/id";
import type { Player } from "./types";

export interface PlayerRepository {
  findById(id: PlayerId): Promise<Player | null>;
  list(): Promise<Player[]>;
}
