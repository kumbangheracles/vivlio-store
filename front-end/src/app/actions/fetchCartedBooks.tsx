import myAxios from "@/libs/myAxios";
import { BookProps } from "@/types/books.type";
import { getServerSession } from "next-auth";
import { message } from "antd";
import { authOptions } from "@/libs/authOptions";

async function fetchCartedBooks(): Promise<BookProps[]> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      message.info("You must login first");
      return [];
    }
    const accessToken = session?.accessToken;

    const response = await myAxios.get("/cart", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    return response.data.results;
  } catch (err) {
    console.log("fetchCartedBooks error:", err || err);
    return [];
  }
}

export default fetchCartedBooks;
