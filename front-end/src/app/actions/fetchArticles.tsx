import myAxios from "@/libs/myAxios";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import {
  ArticleParams,
  ArticleProperties,
  ArticleStatusType,
} from "@/types/article.type";

async function fetchArticles({
  limit = 0,
  status = ArticleStatusType.PUBLISH,
  sortDate = "",
}: ArticleParams = {}): Promise<ArticleProperties[]> {
  try {
    const session = await getServerSession(authOptions);

    const accessToken = session?.accessToken;

    const url = "/articles";

    const params = new URLSearchParams({
      status: status,
    });

    if (sortDate) {
      params.append("sortDate", sortDate.toString());
    }
    if (limit) {
      params.append("limit", limit.toString());
    }

    const response = await myAxios.get(`${url}?${params}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    const filteredArticles = response.data?.results?.filter(
      (item: ArticleProperties) => item.status === "PUBLISHED",
    );

    return filteredArticles;
  } catch (err: any) {
    // console.log("Error fetch articles:", err || err);
    return [];
  }
}

export default fetchArticles;
