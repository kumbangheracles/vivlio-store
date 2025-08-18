import HomePage from "@/components/Home";
import AppLayout from "@/components/Layout";
import myAxios from "@/libs/myAxios";
import { BookProps } from "@/types/books.type";
import Image from "next/image";

async function fetchBooks(): Promise<BookProps[]> {
  const response = await myAxios.get("/books");
  const dataBooks = response.data.results;
  return dataBooks;
}

export default async function Home() {
  const books = await fetchBooks();
  console.log("Data books: ", books);
  return (
    <AppLayout>
      <HomePage dataBooks={books} />
    </AppLayout>
  );
}
