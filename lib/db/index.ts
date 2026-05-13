export function getDb(): never {
  throw new Error("lib/db: data layer not configured (PR #3).");
}
