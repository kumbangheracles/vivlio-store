import BookDetailPage from "@/components/BookDetail";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import myAxios from "@/libs/myAxios";
import { BookProps } from "@/types/books.type";
import { getServerSession } from "next-auth";
import { Empty } from "antd";

import fetchBooksHome from "@/app/actions/fetchBooksHome";
import { Metadata } from "next";
import fetchCategory from "@/app/actions/fetchCategory";
interface BookDetailPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "ViviBook - Book Detail",
  description: "Book Detail",
};

export async function generateStaticParams() {
  try {
    const res = await myAxios.get<{ result: BookProps[] }>("/books");
    const books = res.data.result;

    return books.map((book: BookProps) => ({
      id: book?.id,
    }));
  } catch (error) {
    console.log("Error fetching books:", error);
    return [];
  }
}

export const revalidate = 60;
export default async function BookDetail({ params }: BookDetailPageProps) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  const dataCategory = await fetchCategory();
  const accessToken = session?.accessToken;
  const allBooks = await fetchBooksHome();
  try {
    const res = await myAxios.get<{ result: BookProps }>(`/books/${id}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    const book = res.data.result;

    const similiarBooks = allBooks?.results?.filter(
      (item) =>
        item.id !== book.id &&
        item.genres?.some((genre) =>
          book.genres?.some(
            (bookGenre) => bookGenre.genre_title === genre.genre_title,
          ),
        ),
    );

    if (!book) {
      return (
        <div className="w-screen h-screen flex items-center justify-center">
          <h1>Book Not Found</h1>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center">
        <BookDetailPage
          key={book?.id}
          book={{
            id: book?.id,
            title: book?.title,
            author: book?.author,
            price: book?.price,
            status: book?.status,
            book_type: book?.book_type,
            categoryId: book?.categoryId,
            genres: book?.genres,
            isPopular: book?.isPopular,
            images: book?.images,
            description: book?.description,
            wishlistUsers: book?.wishlistUsers,
            createdAt: book?.createdAt,
            updateAt: book?.updateAt,
            isInCart: book?.isInCart,
            reviews: book?.reviews,
            quantity: book?.quantity,
          }}
          dataCategory={dataCategory}
          similiarBooks={similiarBooks}
        />
      </div>
    );
  } catch (error) {
    console.log("Error fetching book detail:", error);
    return (
      <>
        <div className="w-screen h-screen flex items-center justify-center">
          <Empty description={"Failed fetch book detail"} />
        </div>
      </>
    );
  }
}
