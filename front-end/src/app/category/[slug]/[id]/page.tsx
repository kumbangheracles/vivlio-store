// app/category/[id]/[slug]/page.tsx
import { Metadata } from "next";
import ListBook from "@/components/Home/components/ListBook";
import deslugify from "@/libs/deslugyfy";
import fetchBookClient from "@/app/actions/fetchBookClient";
import { BookFilters } from "@/types/books.type";
interface PageProps {
  params: { id: string; slug: string };
  searchParams: {
    search?: string;
    sortBy?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const titleList = deslugify(params.slug);
  return {
    title: `ViviBook - ${titleList}`,
    description: `Browse ${titleList} books`,
  };
}

const CategoryPage = async ({ params, searchParams }: PageProps) => {
  const filterOptions: BookFilters = {
    categoryId: params.id,
    search: searchParams.search,
    sortBy: searchParams.sortBy as any,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
    limit: 20,
  };

  const dataBooks = await fetchBookClient(filterOptions);

  const titleList = deslugify(params.slug);

  return (
    <div className="w-full p-4 mt-[-20px]">
      <ListBook
        isCategory={true}
        dataBooks={dataBooks}
        titleSection={titleList}
        isSeeAll={false}
        isDisplayFilter={true}
        isDisplayStockable={true}
        isDisplayOnlyAvailbleStock={true}
      />
    </div>
  );
};

export default CategoryPage;
