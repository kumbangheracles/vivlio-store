import { Metadata } from "next";
import ListBook from "@/components/Home/components/ListBook";
import deslugify from "@/libs/deslugyfy";
import fetchBooksHome from "@/app/actions/fetchBooksHome";
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const titleList = deslugify((await params).slug);
  return {
    title: `ViviBook - ${titleList}`,
    description: `Browse ${titleList} books`,
  };
}

const CategoryPage = async (props: PageProps) => {
  const { params, searchParams } = await props;
  const sortDate = (await searchParams)?.sortDate;
  const sortPrice = (await searchParams)?.sortPrice;

  const dataBooks = await fetchBooksHome({
    limit: (await searchParams)?.limit ?? 12,
    sortPrice: sortPrice,
    sortDate: sortDate,
    categoryId: (await params).id,
    onlyAvailable: (await searchParams).onlyAvailable,
  });

  const total = dataBooks.total;
  const shown = dataBooks.results?.length;

  const titleList = deslugify((await params).slug);

  return (
    <div className="w-full p-4 mt-[-20px]">
      <ListBook
        isCategory={true}
        dataBooks={dataBooks?.results}
        isShowLoadMore={true}
        titleSection={`Showing ${shown} of ${total} search results for "${titleList}"`}
        isSeeAll={false}
        isDisplayFilter={true}
        isDisplayStockable={true}
        isDisplayOnlyAvailbleStock={true}
      />
    </div>
  );
};

export default CategoryPage;
