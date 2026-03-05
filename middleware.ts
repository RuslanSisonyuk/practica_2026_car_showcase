import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isAuthenticated = !!session;
  const isAdmin = session?.user?.role === "ADMIN";

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    (pathname.startsWith("/profile") || pathname.startsWith("/bookmarks")) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
});

export const config = {
  matcher: ["/profile/:path*", "/bookmarks/:path*", "/admin/:path*"],
};
