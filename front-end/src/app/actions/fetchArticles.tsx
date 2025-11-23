import myAxios from "@/libs/myAxios";
import { BookProps } from "@/types/books.type";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function fetchArticles(): Promise<BookProps[]> {
  try {
    const session = await getServerSession(authOptions);

    const accessToken = session?.accessToken;

    const url = "/articles";
    const response = await myAxios.get(url, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    return response.data.results;
  } catch (err: any) {
    console.log("Error fetch articles:", err || err);
    return [];
  }
}

export default fetchArticles;
