export type Brand<T, B extends string> = T & { readonly __brand: B };

export type PlayerId = Brand<string, "PlayerId">;
export type PublicProfileId = Brand<string, "PublicProfileId">;
export type ScoringId = Brand<string, "ScoringId">;
export type VisibilityId = Brand<string, "VisibilityId">;
export type MediaId = Brand<string, "MediaId">;
