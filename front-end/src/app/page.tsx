import HomePage from "@/components/Home";
import fetchBooksHome from "./actions/fetchBooksHome";
import fetchArticles from "./actions/fetchArticles";
import fetchCategory from "./actions/fetchCategory";
import { ArticleStatusType } from "@/types/article.type";
import fetchUser from "./actions/fetchUser";
import { UserProperties } from "@/types/user.type";

export const metadata = {
  title: "ViviBook - Home",
  description: "Home page",
};

interface PageProps {
  searchParams?: {
    key?: string;
    sortDate?: string;
    sortPrice?: number;
    onlyAvailable?: boolean;
    limit?: number;
  };
}

export const revalidate = 60;
export default async function Home({ searchParams }: PageProps) {
  // const params = await searchParams;
  const books = await fetchBooksHome();
  const dataUser: UserProperties = await fetchUser();
  const categoryIds = dataUser?.category_preference?.length
    ? dataUser.category_preference
        .map((item) => item.categoryId)
        .filter(Boolean)
        .join(",")
    : "";

  const basedOnPreferenceBooks = categoryIds
    ? await fetchBooksHome({
        limit: 6,
        categoryIds,
      })
    : null;
  const popularBooks = await fetchBooksHome({
    isPopular: true,
    limit: 6,
    sortDate: "newest_saved",
  });

  const newestBooks = await fetchBooksHome({
    sortDate: "newest_saved",
    limit: 12,
  });

  const categories = await fetchCategory({
    isSuggested: true,
    limit: 6,
    sortDate: "newest_saved",
  });

  console.log("Categories: ", categories);
  const articles = await fetchArticles({
    limit: 6,
    status: ArticleStatusType.PUBLISH,
  });

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("intentional delay");
    }, 2000);
  });
  return (
    <>
      <HomePage
        dataBooks={books?.results}
        dataCategories={categories}
        popularBooks={popularBooks?.results}
        newestBooks={newestBooks?.results}
        dataArticles={articles}
        preferenceBooks={basedOnPreferenceBooks?.results}
        dataUser={dataUser}
      />
    </>
  );
}
