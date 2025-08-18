import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { LoginResponse, LoginCredentials, ApiError } from "@/types/api";
import axios, { AxiosError } from "axios";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
const authAxios = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: {
          label: "Username or Email",
          type: "text",
          placeholder: "username or email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.identifier || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          const loginData: LoginCredentials = {
            identifier: credentials.identifier,
            password: credentials.password,
          };

          const response = await authAxios.post<LoginResponse>(
            "/auth/login",
            loginData
          );

          console.log("Backend response data:", response.data);

          const data = response.data;

          if (response.status === 200 && data.results) {
            const userObj = {
              id: data.results.id,
              name: data.results.username,
              email: credentials.identifier.includes("@")
                ? credentials.identifier
                : null,
              role: data.results.role,
              token: data.results.token,
              isVerified: data.results.isVerified,
            };

            console.log("Login successful, returning user:", userObj);
            return userObj;
          }

          console.error("Login failed: Invalid response structure");
          console.log("Response data:", data);
          return null;
        } catch (error) {
          console.error("🚨 Login error occurred:");

          if (error instanceof AxiosError) {
            const errorData = error.response?.data as ApiError;
            console.error("Status:", error.response?.status);
            console.error("Response data:", errorData);
            console.error(
              "Error message:",
              errorData?.message || error.message
            );

            // Log full error untuk debugging
            if (error.response?.status === 403) {
              console.error("403 Error - Possible causes:");
              console.error("1. Wrong credentials");
              console.error("2. User not verified");
              console.error("3. User not found");
            } else if (error.response?.status === 500) {
              console.error("500 Error - Server side issue");
            }
          } else {
            console.error("Non-Axios error:", error);
          }
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // JWT callback - dipanggil saat token dibuat atau diupdate
    async jwt({ token, user, trigger }) {
      console.log("🔑 JWT callback called:");
      console.log("🔑 JWT callback triggered:", trigger);
      console.log("User:", user);
      console.log("Token before:", token);

      // Saat pertama login, user object tersedia
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
        token.isVerified = user.isVerified;
        token.tokenExpiry = Date.now() + 60 * 60 * 1000;
      }

      console.log("Token after:", token);

      if (token.tokenExpiry && Date.now() > Number(token.tokenExpiry)) {
        console.log("Token expired, need to refresh");

        try {
          const res = await authAxios.get("/auth/refresh");
          token.accessToken = res.data.token;
          console.log("Success refresh token!!");
        } catch (error) {
          // ErrorHandler(error);
          console.log("Failed refresh token: ", error);
        }
      }
      return token;
    },

    // Session callback - menentukan data apa yang akan dikirim ke client
    async session({ session, token }) {
      console.log("📱 Session callback called:");
      console.log("Session before:", session);
      console.log("Token:", token);

      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
        session.accessToken = token.accessToken;
      }

      console.log("Session after:", session);
      return session;
    },
  },

  // Custom pages (optional)
  pages: {
    signIn: "/auth/login", // Custom login page
  },

  // Session strategy
  session: {
    strategy: "jwt",
  },

  // Debug (hapus di production)
  debug: process.env.NODE_ENV === "development",
};

// Export untuk App Router
export { authOptions };
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
