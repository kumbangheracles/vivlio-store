"use server";
import myAxios from "@/libs/myAxios";
import { BookWithWishlist } from "@/types/wishlist.type";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";
import { createServerAxios } from "@/libs/serverAxios";
interface PropTypesFetch {
  pageWish: number;
  limitWish?: string;
  sortPrice?: "1" | "-1";
  sortDate?: string;
}
async function fetchWishlist({
  pageWish = 1,
  limitWish = "5",
  sortPrice = "1",
  sortDate = "newest_saved",
}: PropTypesFetch): Promise<BookWithWishlist[]> {
  try {
    const session = await getServerSession(authOptions);
    const serverAxios = createServerAxios({
      token: session?.accessToken,
      isConsole: true,
    });
    const params = new URLSearchParams({
      pageWish: pageWish.toString(),
      limitWish: limitWish,
    });

    if (sortPrice) {
      params.set("sortPrice", String(sortPrice));
    }
    if (sortDate) {
      params.set("sortDate", String(sortDate));
    }
    const res = await serverAxios.get(`/userWishlist?${params.toString()}`);

    const data = res.data.results;
    return data;
  } catch (error) {
    console.log("Error fetch data wishlist: ", error);
    return [];
  }
}
// export const revalidate = 60;

export default fetchWishlist;
