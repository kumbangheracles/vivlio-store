import myAxios from "@/libs/myAxios";
import { GenreProperties } from "@/types/genre.type";
async function fetchGenres(): Promise<GenreProperties[]> {
  try {
    const url = "/genres/public";
    const response = await myAxios.get(url);

    const filteredGenres = response.data.results.filter(
      (item: GenreProperties) => item.status === "PUBLISHED",
    );
    return filteredGenres;
  } catch (err) {
    console.log("fetchBooks error:", err);
    return [];
  }
}

export default fetchGenres;
