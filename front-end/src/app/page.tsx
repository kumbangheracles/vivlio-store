import HomePage from "@/components/Home";
import { ArticleStatusType } from "@/types/article.type";
import fetchArticles from "./actions/fetchArticles";
import fetchBooksHome from "./actions/fetchBooksHome";
import fetchCategory from "./actions/fetchCategory";
import fetchUser from "./actions/fetchUser";

export default async function Home() {
  const [books, dataUser, popularBooks, newestBooks, categories, articles] =
    await Promise.all([
      fetchBooksHome(),
      fetchUser(),
      fetchBooksHome({ isPopular: true, limit: 6, sortDate: "newest_saved" }),
      fetchBooksHome({ sortDate: "newest_saved", limit: 12 }),
      fetchCategory({ isSuggested: true, limit: 6, sortDate: "newest_saved" }),
      fetchArticles({ limit: 6, status: ArticleStatusType.PUBLISH }),
    ]);

  // basedOnPreferenceBooks bergantung pada dataUser, jadi tetap setelahnya
  const categoryIds = dataUser?.category_preference?.length
    ? dataUser.category_preference
        .map((item: any) => item.categoryId)
        .filter(Boolean)
        .join(",")
    : "";

  const basedOnPreferenceBooks = categoryIds
    ? await fetchBooksHome({ limit: 6, categoryIds })
    : null;

  return (
    <HomePage
      dataBooks={books?.results}
      dataCategories={categories}
      popularBooks={popularBooks?.results}
      newestBooks={newestBooks?.results}
      dataArticles={articles}
      preferenceBooks={basedOnPreferenceBooks?.results}
      dataUser={dataUser}
    />
  );
}
