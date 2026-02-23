import ArticleIndex from "@/components/Articles/ArticleIndex";
import fetchArticles from "../actions/fetchArticles";
import { ArticleStatusType } from "@/types/article.type";

export const metadata = {
  title: "ViviBook - Blog",
  description: "Blog Page",
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

const ArticlePage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const dataArticle = await fetchArticles({
    status: ArticleStatusType.PUBLISH,
    limit: params?.limit ?? 9,
    sortDate: params?.sortDate,
  });

  return <ArticleIndex dataArticles={dataArticle} />;
};

export default ArticlePage;
