import HomePage from "@/components/Home";
import myAxios from "@/libs/myAxios";
// import { BookProps } from "@/types/books.type";
// import { getServerSession } from "next-auth";
// import { cookies } from "next/headers";
// import Image from "next/image";
// import { authOptions } from "./api/auth/[...nextauth]/route";
import { CategoryProps } from "@/types/category.types";
import fetchBooksHome from "./actions/fetchBooksHome";
import fetchArticles from "./actions/fetchArticles";
import fetchCategory from "./actions/fetchCategory";
// import { resolve } from "path";
// import GlobalLoading from "@/components/GlobalLoading";
// import { FaSpinner } from "react-icons/fa";
// import { Spin } from "antd";

export const metadata = {
  title: "Vivlio - Home",
  description: "Home page",
};

export const revalidate = 60;
export default async function Home() {
  const books = await fetchBooksHome();
  const categories = await fetchCategory();
  const articles = await fetchArticles();

  console.log("Books: ", books);

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("intentional delay");
    }, 2000);
  });
  return (
    <>
      {/* <AppLayout isAuthPageTampil={false}> */}
      <HomePage
        dataBooks={books}
        dataCategories={categories}
        dataArticles={articles}
      />

      {/* </AppLayout> */}
    </>
  );
}
