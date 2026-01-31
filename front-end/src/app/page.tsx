import HomePage from "@/components/Home";
import fetchBooksHome from "./actions/fetchBooksHome";
import fetchArticles from "./actions/fetchArticles";
import fetchCategory from "./actions/fetchCategory";

export const metadata = {
  title: "ViviBook - Home",
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
        dataBooks={books?.results}
        dataCategories={categories}
        dataArticles={articles}
      />

      {/* </AppLayout> */}
    </>
  );
}
