"use server";
import myAxios from "@/libs/myAxios";
import { BookWithWishlist } from "@/types/wishlist.type";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";

async function fetchWishlist(): Promise<BookWithWishlist[]> {
  try {
    const session = await getServerSession(authOptions);

    const accessToken = session?.accessToken;
    const res = await myAxios.get("/userWishlist", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    const data = res.data.results;

    return data;
  } catch (error) {
    console.log("Error fetch data wishlist: ", error);
    return [];
  }
}
// export const revalidate = 60;

export default fetchWishlist;
