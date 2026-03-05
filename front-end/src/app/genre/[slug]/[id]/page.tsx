import fetchBooksHome from "@/app/actions/fetchBooksHome";
import ListBook from "@/components/Home/components/ListBook";
import deslugify from "@/libs/deslugyfy";
import { Metadata } from "next";
interface PageProps {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<{
    search?: string;
    sortBy?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    key?: string;
    sortDate?: string;
    sortPrice?: number;
    onlyAvailable?: boolean;
    limit?: number;
  }>;
}
export const metadata: Metadata = {
  title: `ViviBook - Genre`,
  description: "Genre",
};
const GenrePage = async ({ params, searchParams }: PageProps) => {
  const sortDate = (await searchParams)?.sortDate;
  const sortPrice = (await searchParams)?.sortPrice;

  const dataBooks = await fetchBooksHome({
    limit: (await searchParams)?.limit ?? 12,
    sortPrice: sortPrice,
    sortDate: sortDate,
    genreId: (await params).id,
    onlyAvailable: (await searchParams).onlyAvailable,
  });

  const total = dataBooks.total;
  const shown = dataBooks.results?.length;

  const titleList = deslugify((await params).slug);
  return (
    <div className="w-full p-4 mt-[-20px]">
      <ListBook
        isCategory={false}
        isGenre={true}
        dataBooks={dataBooks?.results}
        titleSection={`Showing ${shown} of ${total} search results for "${titleList}"`}
        isSeeAll={false}
        isShowLoadMore={true}
        isDisplayFilter={true}
        isDisplayStockable={true}
        isDisplayOnlyAvailbleStock={true}
      />
    </div>
  );
};

export default GenrePage;
