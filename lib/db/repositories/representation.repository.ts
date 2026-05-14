import { and, eq } from "drizzle-orm";
import type { Representation } from "@/domain/player/types";
import type { RepresentationRepository } from "@/domain/representation/repository";
import type {
  AgentId,
  RepresentationRequest,
  RepresentationRequestId,
} from "@/domain/representation/types";
import type { PlayerId } from "@/domain/shared/id";
import { getDb } from "../client";
import { players } from "../schema/players";
import { representationRequests } from "../schema/representation-requests";

type RepresentationRequestRow = typeof representationRequests.$inferSelect;

function toRequest(row: RepresentationRequestRow): RepresentationRequest {
  return {
    id: row.id as RepresentationRequestId,
    agentId: row.agentId as AgentId,
    agentName: row.agentName,
    agentFifaLicense: row.agentFifaLicense,
    playerId: row.playerId as PlayerId,
    message: row.message,
    sentAt: row.sentAt,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toRow(request: RepresentationRequest) {
  return {
    id: request.id,
    agentId: request.agentId,
    agentName: request.agentName,
    agentFifaLicense: request.agentFifaLicense,
    playerId: request.playerId,
    message: request.message,
    sentAt: request.sentAt,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
}

export const representationRepository: RepresentationRepository = {
  async save(request) {
    const row = toRow(request);
    await getDb()
      .insert(representationRequests)
      .values(row)
      .onConflictDoUpdate({ target: representationRequests.id, set: row });
  },

  async findById(id) {
    const rows = await getDb()
      .select()
      .from(representationRequests)
      .where(eq(representationRequests.id, id))
      .limit(1);
    return rows[0] ? toRequest(rows[0]) : null;
  },

  async listByAgentAndPlayer(agentId, playerId) {
    const rows = await getDb()
      .select()
      .from(representationRequests)
      .where(
        and(
          eq(representationRequests.agentId, agentId),
          eq(representationRequests.playerId, playerId),
        ),
      );
    return rows.map(toRequest);
  },

  // Atomic : update request status + optionally apply Representation to player,
  // in a single Drizzle transaction.
  async applyResponse(
    updatedRequest: RepresentationRequest,
    newRepresentation: Representation | null,
  ) {
    await getDb().transaction(async (tx) => {
      await tx
        .update(representationRequests)
        .set({
          status: updatedRequest.status,
          updatedAt: updatedRequest.updatedAt,
        })
        .where(eq(representationRequests.id, updatedRequest.id));

      if (newRepresentation) {
        await tx
          .update(players)
          .set({
            representation: newRepresentation,
            updatedAt: updatedRequest.updatedAt,
          })
          .where(eq(players.id, updatedRequest.playerId));
      }
    });
  },
};
