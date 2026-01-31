import { API_URL } from "@/libs/myAxios";
import { BookParams, BookProps, BookStatusType } from "@/types/books.type";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { BaseResponBook } from "@/types/base.type";

async function fetchBooksHome({
  status = BookStatusType.PUBLISH,
}: BookParams = {}): Promise<BaseResponBook<BookProps>> {
  const session = await getServerSession(authOptions);

  try {
    const accessToken = session?.accessToken;
    const url = accessToken ? "/books" : "/books/common-all";
    const params = new URLSearchParams({
      status,
    }).toString();
    const res = await fetch(`${API_URL}${url}?${params}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      cache: "no-store",
    });

    return res.json();
  } catch (err) {
    console.log("fetchBooks error:", err);
    throw err;
  }
}

export default fetchBooksHome;
