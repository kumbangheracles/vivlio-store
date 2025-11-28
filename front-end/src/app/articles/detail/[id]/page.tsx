import fetchArticleDetail from "@/app/actions/fetchArticleDetail";
import ArticleDetail from "@/components/BlogDetail";
import myAxios from "@/libs/myAxios";
import { ArticleProperties } from "@/types/article.type";
import { Metadata } from "next";
interface PageProps {
  params: { id: string };
}
export const metadata: Metadata = {
  title: "Vivlio - Article Detail",
  description: "Article Detail",
};

export async function generateStaticParams() {
  try {
    const res = await myAxios.get<{ result: ArticleProperties[] }>("/books");
    const articles = res.data.result;

    return articles.map((book: ArticleProperties) => ({
      id: book?.id,
    }));
  } catch (error) {
    console.log("Error fetching articles:", error);
    return [];
  }
}
export const revalidate = 60;
const ArticleDetailPage = async ({ params }: PageProps) => {
  const dataArticle = await fetchArticleDetail(params.id);
  console.log("Data Article: ", dataArticle);
  return (
    <div className="w-full min-h-screen">
      <ArticleDetail dataArticle={dataArticle} />
    </div>
  );
};

export default ArticleDetailPage;
