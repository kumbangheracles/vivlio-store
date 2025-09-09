import HomePage from "@/components/Home";
import AppLayout from "@/components/Layout";
import myAxios from "@/libs/myAxios";
import { BookProps } from "@/types/books.type";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import Image from "next/image";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { CategoryProps } from "@/types/category.types";
import fetchBooksHome from "./actions/fetchBooksHome";

async function fetchCategory(): Promise<CategoryProps[]> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      window.location.href = "/unoutherized";
    }

    const url = "/book-category/public";
    const response = await myAxios.get(url);

    return response.data.results;
  } catch (err: any) {
    console.log("fetchBooks error:", err.message || err);
    return [];
  }
}

// export const metadata = {
//   title: "Vivlio - Home",
//   description: "Home page",
// };

export const revalidate = 60;
export default async function Home() {
  const books = await fetchBooksHome();
  const categories = await fetchCategory();
  console.log("Data books: ", books);
  console.log("Data categories: ", categories);
  return (
    <AppLayout>
      <HomePage dataBooks={books} dataCategories={categories} />
    </AppLayout>
  );
}
