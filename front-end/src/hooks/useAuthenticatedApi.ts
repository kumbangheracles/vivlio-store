"use client";
import myAxios from "@/libs/myAxios";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export function useAuthenticatedApi() {
  const { data: session, status } = useSession();

  const api = useMemo(() => {
    const authenticatedAxios = myAxios.create();

    authenticatedAxios.interceptors.request.use(async (config) => {
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    });

    return authenticatedAxios;
  }, [session?.accessToken]);

  return {
    api,
    isAuthenticated: status === "authenticated",
    token: session?.accessToken,
    session,
  };
}
