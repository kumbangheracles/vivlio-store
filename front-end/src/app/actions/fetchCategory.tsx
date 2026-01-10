import myAxios from "@/libs/myAxios";
import { CategoryProps } from "@/types/category.types";

async function fetchCategory(): Promise<CategoryProps[]> {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   window.location.href = "/unoutherized";
    // }

    const url = "/book-category/public";
    const response = await myAxios.get(url);

    return response.data.results;
  } catch (err: any) {
    console.log("fetchBooks error:", err.message || err);
    return [];
  }
}

export default fetchCategory;
