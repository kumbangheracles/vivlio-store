import { Metadata } from "next";
import fetchBooksHome from "@/app/actions/fetchBooksHome";
import ListBook from "@/components/Home/components/ListBook";
interface PageProps {
  params: { id: string; slug: string };
}
export const metadata: Metadata = {
  title: "Vivlio - Category",
  description: "Category",
};

const CategoryPage = async ({ params }: PageProps) => {
  const dataBooks = await fetchBooksHome();
  const filteredBooksByCategoryId = dataBooks.filter(
    (item) => item.categoryId === params.id
  );

  const deslugify = (slug: string) => {
    return slug
      .replace(/-/g, " ") // ganti - jadi spasi
      .replace(/\b\w/g, (char) => char.toUpperCase()); // kapital tiap kata
  };

  const titleList = deslugify(params.slug);

  console.log("Filtered Books by categoryID: ", filteredBooksByCategoryId);
  return (
    <div className="w-full p-4 mt-[-20px]">
      <ListBook
        dataBooks={filteredBooksByCategoryId}
        titleSection={titleList}
        isSeeAll={false}
      />
    </div>
  );
};

export default CategoryPage;
