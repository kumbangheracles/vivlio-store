import ArticleIndex from "@/components/Articles/ArticleIndex";
import fetchArticles from "../actions/fetchArticles";
const ArticlePage = async () => {
  const dataArticle = await fetchArticles();
  const filteredData = dataArticle.filter(
    (item) => item.status === "PUBLISHED"
  );
  return <ArticleIndex dataArticles={filteredData} />;
};

export default ArticlePage;
