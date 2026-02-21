import myAxios from "@/libs/myAxios";
import { CategoryParams, CategoryProps } from "@/types/category.types";

async function fetchCategory({ status = true }: CategoryParams = {}): Promise<
  CategoryProps[]
> {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   window.location.href = "/unoutherized";
    // }

    const params = new URLSearchParams({
      status: status.toString(),
    });
    const url = "/book-category/public";
    const response = await myAxios.get(`${url}?${params}`);

    return response?.data?.results;
  } catch (err: any) {
    console.log("fetchBooks error:", err.message || err);
    return [];
  }
}

export default fetchCategory;
