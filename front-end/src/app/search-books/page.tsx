import SearchBookIndex from "@/components/SearchBooks";
import fetchBooksHome from "../actions/fetchBooksHome";
interface PageProps {
  searchParams?: {
    key?: string;
    sortDate?: string;
    sortPrice?: number;
    onlyAvailable?: boolean;
  };
}
const SearchBookPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const key = params?.key;
  const sortDate = params?.sortDate;
  const sortPrice = params?.sortPrice;

  console.log("Params: ", params);
  const dataBooks = await fetchBooksHome({
    title: key,
    limit: 20,
    sortPrice: sortPrice,
    sortDate: sortDate,
    onlyAvailable: params?.onlyAvailable,
  });

  // console.log("Data books: ", dataBooks);

  const total = dataBooks.total;
  const shown = dataBooks.results?.length;

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
