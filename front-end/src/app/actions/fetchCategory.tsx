import myAxios from "@/libs/myAxios";
import { CategoryParams, CategoryProps } from "@/types/category.types";

async function fetchCategory({
  status = true,
  isSuggested = false,
  limit = 10,
  sortDate = "newest_saved",
}: CategoryParams = {}): Promise<CategoryProps[]> {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   window.location.href = "/unoutherized";
    // }

    const params = new URLSearchParams({
      status: status.toString(),
      limit: limit.toString(),
    });

    if (isSuggested) {
      params.append("isSuggested", isSuggested.toString());
    }
    if (sortDate) {
      params.append("sortDate", sortDate);
    }

    const url = "/book-category/public";
    const response = await myAxios.get(`${url}?${params}`);

    console.log("response cat: ", response);
    return response?.data?.results;
  } catch (err) {
    console.log("fetchBooks error:", err);
    return [];
  }
}

export default fetchCategory;
