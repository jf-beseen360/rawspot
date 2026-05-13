import type { Position } from "@/domain/shared/position";
import type { PublicProfile } from "./types";

export interface PublicProfileListFilters {
  position?: Position;
  country?: string;
  minScore?: number;
}

export interface PublicProfileRepository {
  findBySlug(slug: string): Promise<PublicProfile | null>;
  list(filters?: PublicProfileListFilters): Promise<PublicProfile[]>;
}
