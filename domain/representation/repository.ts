import type { Representation } from "@/domain/player/types";
import type { PlayerId } from "@/domain/shared/id";
import type {
  AgentId,
  RepresentationRequest,
  RepresentationRequestId,
} from "./types";

export interface RepresentationRepository {
  // Persist a freshly created RepresentationRequest. Idempotent by primary
  // key (id).
  save(request: RepresentationRequest): Promise<void>;

  findById(id: RepresentationRequestId): Promise<RepresentationRequest | null>;

  // Used by sendRepresentationRequest to enforce the "1 active request per
  // (agent, player)" invariant on the domain side.
  listByAgentAndPlayer(
    agentId: AgentId,
    playerId: PlayerId,
  ): Promise<RepresentationRequest[]>;

  // Atomic write : updates the request status (and updatedAt), and — if
  // newRepresentation is provided — applies it to the player's representation
  // field. Both writes happen in a single Drizzle transaction.
  applyResponse(
    updatedRequest: RepresentationRequest,
    newRepresentation: Representation | null,
  ): Promise<void>;
}
