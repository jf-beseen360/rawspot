import type { InterestId, PlayerId } from "@/domain/shared/id";
import type { Interest, Visibility } from "./types";

export interface VisibilityRepository {
  findByPlayer(playerId: PlayerId): Promise<Visibility | null>;
  recordView(playerId: PlayerId): Promise<void>;
}

export interface InterestRepository {
  findById(id: InterestId): Promise<Interest | null>;
  listByPlayer(playerId: PlayerId): Promise<Interest[]>;
  save(interest: Interest): Promise<void>;
}
