import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    if (!token) {
      return NextResponse.redirect(new URL("/unoutherized", req.url));
    }
    if (pathname === "/auth/login" || pathname === "/auth/register") {
      if (token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
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
    "/dashboard/:path*",
    "/profile/:path*",
    "/account",
    "/auth/login",
    "/auth/register",
  ],
};
