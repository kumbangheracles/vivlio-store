import { getServerSession } from "next-auth";

import myAxios from "@/libs/myAxios";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function fetchUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return null;

  const res = await myAxios.get(`/users/${session.user.id}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  return res.data.result;
}
