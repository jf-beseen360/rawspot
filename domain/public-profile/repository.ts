import type { PublicProfileId } from "@/domain/shared/id";
import type { PublicProfile } from "./types";

export interface PublicProfileRepository {
  findById(id: PublicProfileId): Promise<PublicProfile | null>;
  list(): Promise<PublicProfile[]>;
}
