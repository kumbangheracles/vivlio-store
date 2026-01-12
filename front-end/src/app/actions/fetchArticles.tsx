import myAxios from "@/libs/myAxios";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ArticleProperties } from "@/types/article.type";

async function fetchArticles(): Promise<ArticleProperties[]> {
  try {
    const session = await getServerSession(authOptions);

    const accessToken = session?.accessToken;

    const url = "/articles";
    const response = await myAxios.get(url, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    const filteredArticles = response.data?.results?.filter(
      (item: ArticleProperties) => item.status === "PUBLISHED"
    );

    return filteredArticles;
  } catch (err: any) {
    console.log("Error fetch articles:", err || err);
    return [];
  }
}

export default fetchArticles;
