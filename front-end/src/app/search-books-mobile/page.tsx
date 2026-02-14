import SearchBookMobileIndex from "@/components/SearchBooks/Mobile";
import fetchBooksHome from "../actions/fetchBooksHome";

const SearchBookMobilePage = async () => {
  const dataBooks = await fetchBooksHome({
    isRecomend: true,
  });
  return <SearchBookMobileIndex dataBooks={dataBooks?.results} />;
};

export default SearchBookMobilePage;
