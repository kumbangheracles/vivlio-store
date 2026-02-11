import SearchBookIndex from "@/components/SearchBooks";
import fetchBooksHome from "../actions/fetchBooksHome";
interface PageProps {
  searchParams?: {
    key?: string;
  };
}
const SearchBookPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const key = params?.key;

  console.log("Params: ", params);
  const dataBooks = await fetchBooksHome({
    title: key,
    limit: 60,
  });

  const total = dataBooks.total;
  const shown = dataBooks.results.length;

  return (
    <SearchBookIndex
      key={params?.key as string}
      total={total}
      shown={shown}
      dataBooks={dataBooks?.results}
    />
  );
};

export default SearchBookPage;
