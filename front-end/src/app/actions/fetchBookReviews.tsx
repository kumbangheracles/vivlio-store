"use server";
import { createServerAxios } from "@/libs/serverAxios";
import { BookReviewsProps, BookReviewStatus } from "@/types/bookreview.type";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface PropTypesFetch {
  page: number;
  status: string;
}

async function fetchBookReviews(
  { page = 1, status = "" }: PropTypesFetch = { page: 1, status: "" },
): Promise<BookReviewsProps[]> {
  try {
    const session = await getServerSession(authOptions);
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   window.location.href = "/unoutherized";
    // }

    const serverAxios = createServerAxios(session?.accessToken);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "6",
    });

    console.log("Status yang diterima:", status);

    if (status && status.trim() !== "") {
      params.append("status", status);
    }
    const url = `/book-reviews?${params.toString()}`;
    const response = await serverAxios.get(url);

    const filteredReviews = response.data.results;
    return filteredReviews;
  } catch (err: any) {
    console.log("fetch book reviews error:", err || err);
    return [];
  }
}

export default fetchBookReviews;
