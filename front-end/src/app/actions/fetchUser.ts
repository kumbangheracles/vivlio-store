import { getServerSession } from "next-auth";
import myAxios from "@/libs/myAxios";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function fetchUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session?.accessToken) {
    return null;
  }
  try {
    const res = await myAxios.get(`/users/${session.user.id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    // console.log("Data user: ", res.data.result);
    return res.data.result;
  } catch (error) {
    console.log("Error fetch user: ", error);
    return null;
  }
}

export default fetchUser;
