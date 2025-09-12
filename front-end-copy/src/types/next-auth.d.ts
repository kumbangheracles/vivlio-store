import NextAuth, { DefaultSession } from "next-auth";
import { UserImage } from "./user.type";

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
    profileImage?: UserImage;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    accessToken: string;
    isVerified: boolean;
  }
}
