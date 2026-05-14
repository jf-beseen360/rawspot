import type { PlayerId } from "@/domain/shared/id";
import type { Player, Representation } from "./types";

export interface PlayerRepository {
  findById(id: PlayerId): Promise<Player | null>;
  list(): Promise<Player[]>;
  // Updates only the representation field. Atomic single-row UPDATE.
  // Used by callers that apply a Representation to an existing Player
  // outside the representation respondResponse transaction.
  updateRepresentation(
    playerId: PlayerId,
    representation: Representation,
  ): Promise<void>;
}
