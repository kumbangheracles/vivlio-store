import { createServerAxios } from "@/libs/serverAxios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BookProps, BookFilters } from "@/types/books.type";

async function fetchBookClient(
  options: BookFilters = {},
): Promise<BookProps[]> {
  try {
    const session = await getServerSession(authOptions);

    // if (!session?.accessToken) {
    //   console.warn("No session found - fetching public books");
    // }

    const serverAxios = createServerAxios(session?.accessToken);

    // Build query params
    const params = new URLSearchParams();
    if (options.search) params.append("search", options.search);
    if (options.sortBy) params.append("sortBy", options.sortBy);
    if (options.minPrice)
      params.append("minPrice", options.minPrice.toString());
    if (options.maxPrice)
      params.append("maxPrice", options.maxPrice.toString());
    if (options.id) params.append("id", options.id);
    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());

    const queryString = params.toString();
    const url = `/books/client${queryString ? `?${queryString}` : ""}`;

    const response = await serverAxios.get(url);

    return response.data.results || [];
  } catch (err: any) {
    console.error(" Fetch book client error:", {
      status: err?.response?.status,
      message: err?.response?.data || err.message,
      url: err?.config?.url,
    });
    return [];
  }
}

export default fetchBookClient;
