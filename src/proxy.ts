import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/admin/session";

/**
 * Optimistic gate for /admin: bounces signed-out visitors to the login page.
 * Pages and server actions still verify the session themselves.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedIn = isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const onLogin = pathname === "/admin/login";

  if (!signedIn && !onLogin) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (signedIn && onLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
