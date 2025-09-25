"use client";

import myAxios from "@/libs/myAxios";
import { getSession } from "next-auth/react";

export async function clientApi() {
  const session = await getSession();

  if (session?.accessToken) {
    myAxios.defaults.headers.common.Authorization = `Bearer ${session.accessToken}`;
  }

  return myAxios;
}
