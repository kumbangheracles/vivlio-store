import { createServerAxios } from "@/libs/serverAxios";
import { BookReviewsProps } from "@/types/bookreview.type";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function fetchBookReviews(): Promise<BookReviewsProps[]> {
  try {
    const session = await getServerSession(authOptions);
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   window.location.href = "/unoutherized";
    // }

    const serverAxios = createServerAxios(session?.accessToken);

    const url = "/book-reviews";
    const response = await serverAxios.get(url);
    console.log("Response book reviews: ", response);

    const filteredReviews = response.data.results;
    return filteredReviews;
  } catch (err: any) {
    console.log("fetch book reviews error:", err || err);
    return [];
  }
}

export default fetchBookReviews;
