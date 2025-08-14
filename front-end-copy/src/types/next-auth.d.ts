import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isVerified: boolean;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User {
    id: string;
    role: string;
    token: string;
    isVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    accessToken: string;
    isVerified: boolean;
  }
}
