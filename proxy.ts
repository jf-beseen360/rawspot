import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isRole, type Role } from "@/lib/auth/types";

// Route protection matrix.
// Admins peuvent accéder à tout (override de la règle de rôle).
const PROTECTED: ReadonlyArray<{ prefix: string; role: Role }> = [
  { prefix: "/moi", role: "player" },
  { prefix: "/scout", role: "recruiter" },
  { prefix: "/agents", role: "agent" },
  { prefix: "/spotter", role: "spotter" },
  { prefix: "/admin", role: "admin" },
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Important : auth.getUser() refresh les tokens si besoin et écrit les
  // nouveaux cookies via le setAll ci-dessus.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const rule = PROTECTED.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`),
  );

  if (!rule) return response;

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/connexion";
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const rawRole = (user.app_metadata as Record<string, unknown> | undefined)
    ?.role;
  const userRole = isRole(rawRole) ? rawRole : null;
  if (userRole !== rule.role && userRole !== "admin") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/non-autorise";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Le matcher applique le proxy uniquement aux préfixes protégés.
// `:path*` couvre /moi, /moi/x, /moi/x/y, etc.
export const config = {
  matcher: [
    "/moi/:path*",
    "/scout/:path*",
    "/agents/:path*",
    "/spotter/:path*",
    "/admin/:path*",
  ],
};
