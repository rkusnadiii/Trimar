import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    // Allow login & register to be accessed publicly
    if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/register")) {
      return NextResponse.next();
    }

    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Simple token existence check for edge runtime compatibility
    // More detailed JWT validation will be done in the server components/API routes
    if (token && token.split('.').length === 3) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
