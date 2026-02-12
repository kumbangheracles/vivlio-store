import { API_URL } from "@/libs/myAxios";
import { BookParams, BookProps, BookStatusType } from "@/types/books.type";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { BaseResponBook } from "@/types/base.type";

async function fetchBooksHome({
  status = BookStatusType.PUBLISH,
  isRecomend = false,
  title = "",
  limit = 0,
  sortDate = "",
  sortPrice = -1,
  categoryId = "",
  onlyAvailble = false,
}: BookParams = {}): Promise<BaseResponBook<BookProps>> {
  const session = await getServerSession(authOptions);

  try {
    const accessToken = session?.accessToken;
    const url = accessToken ? "/books" : "/books/common-all";
    const params = new URLSearchParams({
      status: status,
      onlyAvailble: onlyAvailble.toString(),
    });

    if (isRecomend) {
      params.append("isRecomend", isRecomend.toString());
    }

    if (title) {
      params.append("title", title);
    }

    if (limit) {
      params.append("limit", limit.toString());
    }

    if (sortDate) {
      params.append("sortDate", sortDate);
    }
    if (sortPrice) {
      params.append("sortPrice", sortPrice.toString());
    }
    if (categoryId) {
      params.append("categoryId", categoryId.toString());
    }

    const res = await fetch(`${API_URL}${url}?${params}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      cache: "no-store",
    });

    const data = res.json();

    console.log("Res: ", res);

    return data;
  } catch (err) {
    console.log("fetchBooks error:", err);
    throw err;
  }
}

export default fetchBooksHome;
