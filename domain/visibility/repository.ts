import type { PlayerId } from "@/domain/shared/id";
import type { Interest, Visibility } from "./types";

export interface VisibilityRepository {
  findByPlayer(playerId: PlayerId): Promise<Visibility | null>;
  listInterestsByPlayer(playerId: PlayerId): Promise<Interest[]>;
}
