import HomePage from "@/components/Home";
import AppLayout from "@/components/Layout";
import myAxios from "@/libs/myAxios";
import { BookProps } from "@/types/books.type";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import Image from "next/image";
import { authOptions } from "./api/auth/[...nextauth]/route";

async function fetchBooks(): Promise<BookProps[]> {
  try {
    const session = await getServerSession(authOptions);

    const accessToken = session?.accessToken;

    const url = accessToken ? "/books" : "/books/common-all";
    const response = await myAxios.get(url, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    return response.data.results;
  } catch (err: any) {
    console.log("❌ fetchBooks error:", err.message || err);
    return [];
  }
}
export const revalidate = 60;
export default async function Home() {
  const books = await fetchBooks();
  console.log("Data books: ", books);
  return (
    <AppLayout>
      <HomePage dataBooks={books} />
    </AppLayout>
  );
}
