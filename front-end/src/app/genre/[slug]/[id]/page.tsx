import fetchBooksHome from "@/app/actions/fetchBooksHome";
import ListBook from "@/components/Home/components/ListBook";
import deslugify from "@/libs/deslugyfy";
import { Metadata } from "next";
interface PageProps {
  params: { id: string; slug: string };
}
export const metadata: Metadata = {
  title: `ViviBook - Genre`,
  description: "Genre",
};
const GenrePage = async ({ params }: PageProps) => {
  const dataBooks = await fetchBooksHome();
  const filteredBooksByGenre = dataBooks?.results?.filter((item) =>
    item.genres?.some((genre) => genre.genreid === params.id),
  );

  const titleList = deslugify(params.slug);
  return (
    <div className="w-full p-4 mt-[-20px]">
      <ListBook
        isCategory={false}
        isGenre={true}
        dataBooks={filteredBooksByGenre}
        titleSection={titleList}
        isSeeAll={false}
        isDisplayFilter={true}
        isDisplayStockable={true}
        isDisplayOnlyAvailbleStock={true}
      />
    </div>
  );
};

export default GenrePage;
