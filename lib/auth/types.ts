// Role enum partagé entre code client et serveur.
// Stocké dans Supabase user.app_metadata.role (raw_app_meta_data).

export const ROLES = [
  "player",
  "recruiter",
  "agent",
  "spotter",
  "admin",
] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && (ROLES as readonly string[]).includes(value)
  );
}

// Chemin de redirection par défaut après login, en fonction du rôle.
export function defaultPathForRole(role: Role | null | undefined): string {
  switch (role) {
    case "player":
      return "/moi";
    case "recruiter":
      return "/scout";
    case "agent":
      return "/agents";
    case "spotter":
      return "/spotter";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
}
