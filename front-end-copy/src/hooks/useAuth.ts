"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseAuthOptions {
  required?: boolean;
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { required = false, redirectTo = "/auth/login" } = options;

  useEffect(() => {
    if (required && status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [required, status, router, redirectTo]);

  return {
    session,
    loading: status === "loading",
    authenticated: status === "authenticated",
    user: session?.user,
    accessToken: session?.accessToken,
  };
}

// Hook khusus untuk role-based access
export function useRequireAuth(allowedRoles?: string[]) {
  const { session, loading, authenticated } = useAuth({ required: true });
  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated && allowedRoles) {
      const userRole = session?.user.role;
      if (userRole && !allowedRoles.includes(userRole)) {
        router.push("/unauthorized");
      }
    }
  }, [loading, authenticated, session, allowedRoles, router]);

  return { session, loading, authenticated };
}
