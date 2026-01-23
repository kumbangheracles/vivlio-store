import { Metadata } from "next";
import fetchBooksHome from "@/app/actions/fetchBooksHome";
import ListBook from "@/components/Home/components/ListBook";
import deslugify from "@/libs/deslugyfy";
interface PageProps {
  params: { id: string; slug: string };
}
export const metadata: Metadata = {
  title: `ViviBook - Category`,
  description: "Category",
};

const CategoryPage = async ({ params }: PageProps) => {
  const dataBooks = await fetchBooksHome();
  const filteredBooksByCategoryId = dataBooks.filter(
    (item) => item.categoryId === params.id,
  );

  const titleList = deslugify(params.slug);

  console.log("Filtered Books by categoryID: ", filteredBooksByCategoryId);
  return (
    <div className="w-full p-4 mt-[-20px]">
      <ListBook
        isCategory={true}
        dataBooks={filteredBooksByCategoryId}
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
