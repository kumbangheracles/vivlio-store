import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { LoginResponse, LoginCredentials, ApiError } from "@/types/api";
import { AxiosError } from "axios";
import myAxios from "@/libs/myAxios";

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
          return null;
        }

        try {
          const loginData: LoginCredentials = {
            identifier: credentials.identifier,
            password: credentials.password,
          };

          // Kirim request ke backend API login endpoint menggunakan axios
          const response = await myAxios.post<LoginResponse>(
            "/auth/login",
            loginData
          );

          const data = response.data;

          // Jika login berhasil
          if (response.status === 200 && data.results) {
            return {
              id: data.results.username,
              name: data.results.username,
              email: credentials.identifier.includes("@")
                ? credentials.identifier
                : null,
              role: data.results.role,
              token: data.results.token,
              isVerified: data.results.isVerified,
            };
          }

          return null;
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorData = error.response?.data as ApiError;
            console.error("Login failed:", errorData?.message || error.message);
          } else {
            console.error("Login error:", error);
          }
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // JWT callback - dipanggil saat token dibuat atau diupdate
    async jwt({ token, user }) {
      // Saat pertama login, user object tersedia
      if (user) {
        token.role = user.role;
        token.accessToken = user.token;
        token.isVerified = user.isVerified;
      }
      return token;
    },

    // Session callback - menentukan data apa yang akan dikirim ke client
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },

  // Custom pages (optional)
  pages: {
    signIn: "/auth/login", // Custom login page
    // signUp: '/auth/register', // Custom register page
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
