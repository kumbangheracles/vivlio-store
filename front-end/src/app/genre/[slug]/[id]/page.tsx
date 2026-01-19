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
  console.log("Data books in genre: ", dataBooks);
  const filteredBooksByGenre = dataBooks?.filter((item) =>
    item.genres?.some((genre) => genre.genreid === params.id),
  );

  console.log("Filtered books by genre: ", filteredBooksByGenre);

  const titleList = deslugify(params.slug);
  return (
    <div className="w-full p-4 mt-[-20px]">
      <ListBook
        isCategory={false}
        isGenre={true}
        dataBooks={filteredBooksByGenre}
        titleSection={titleList}
        isSeeAll={false}
      />
    </div>
  );
};

export default GenrePage;
