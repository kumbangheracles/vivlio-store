import BookDetailPage from "@/components/BookDetail";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import myAxios from "@/libs/myAxios";
import { BookProps } from "@/types/books.type";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { Empty, message } from "antd";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";
interface BookDetailPageProps {
  params: { id: string };
}
export async function generateStaticParams() {
  // const session = getServerSession(authOptions);
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
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  try {
    const res = await myAxios.get<{ result: BookProps }>(`/books/${id}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    const book = res.data.result;

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
          }}
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
