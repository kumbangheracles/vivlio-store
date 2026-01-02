import myAxios from "@/libs/myAxios";
import { BookProps } from "@/types/books.type";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function fetchBooksHome(): Promise<BookProps[]> {
  const session = await getServerSession(authOptions);

  try {
    const accessToken = session?.accessToken;

    const url = accessToken ? "/books" : "/books/common-all";
    const response = await myAxios.get(url, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    return response.data.results;
  } catch (err: any) {
    console.log("fetchBooks error:", err || err);
    return [];
  }
}

export default fetchBooksHome;
