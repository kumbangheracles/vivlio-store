import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Bisa tambahkan logic tambahan di sini
    // Misalnya redirect berdasarkan role
    // const token = req.nextauth.token;
    // const isAdmin = token?.role === "admin";

    // // Proteksi admin routes
    // if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
    //   return NextResponse.redirect(new URL("/dashboard", req.url));
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/"],
};
