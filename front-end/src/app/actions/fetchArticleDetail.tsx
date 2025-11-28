import myAxios from "@/libs/myAxios";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import { ArticleProperties } from "@/types/article.type";

async function fetchArticleDetail(id: string): Promise<ArticleProperties> {
  try {
    // const session = await getServerSession(authOptions);

    // const accessToken = session?.accessToken;

    const url = `/articles/${id}`;
    const response = await myAxios.get(url);

    return response.data.result;
  } catch (err: any) {
    console.log("Error fetch article detail:", err || err);
    return {};
  }
}

export default fetchArticleDetail;
