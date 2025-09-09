import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const isProtectedRoute =
      pathname === "/account" ||
      pathname === "/blog" ||
      pathname === "/shop" ||
      pathname === "/about-us" ||
      pathname === "/contact-us";

    if (!token && isProtectedRoute) {
      return NextResponse.redirect(new URL("/unoutherized", req.url));
    }

    const isAuthPage =
      pathname === "/auth/login" || pathname === "/auth/register";

    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/blog/:path*",
    "/shop/:path*",
    "/about-us/:path*",
    "/contact-us/:path*",
    "/account",
    "/auth/login",
    "/auth/register",
    "/unoutherized",
  ],
};
