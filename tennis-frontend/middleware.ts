import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that don't require authentication
const publicPaths = ["/login", "/register", "/"];

// Define paths accessible only to specific roles
const roleRestrictedPaths = {
  ADMIN: [
    "/admin",
    "/admin/tournaments",
    "/admin/matches",
    "/admin/notification",
  ],
  PLAYER: ["/player"],
  REFEREE: ["/referee"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    publicPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    return NextResponse.next();
  }

  const role = request.cookies.get("role")?.value;

  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const hasAccess = Object.entries(roleRestrictedPaths).some(
    ([userRole, paths]) => {
      return (
        role === userRole &&
        paths.some(
          (path) => pathname === path || pathname.startsWith(path + "/")
        )
      );
    }
  );

  if (!hasAccess) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (role === "PLAYER") {
      return NextResponse.redirect(new URL("/player", request.url));
    } else if (role === "REFEREE") {
      return NextResponse.redirect(new URL("/referee", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
