"use client";
import { BookWithWishlist } from "@/types/wishlist.type";
import { Card, Empty } from "antd";
import { Suspense, useEffect, useState } from "react";
import GlobalLoading from "../GlobalLoading";
import React from "react";
import CardBookWishlist from "./CardBookWishlist";
import { useWishlistStore } from "@/zustand/wishlist.store";

type PropTypes = {
  dataWish?: BookWithWishlist[];
  fetchWishlist: () => void;
};

type KeyProps =
  | "newest_saved"
  | "oldest_saved"
  | "lowest_price"
  | "highest_price";

const Wishlist = ({ dataWish, fetchWishlist }: PropTypes) => {
  const { books, loading, fetchBooks } = useWishlistStore();

  const [keyFilter, setKeyFilter] = useState<KeyProps>("newest_saved");
  useEffect(() => {
    if (books.length === 0) {
      fetchBooks();
    }
  }, [books, fetchBooks]);

  let filteredData: BookWithWishlist[] = [];

  if (keyFilter && books.length > 0) {
    filteredData = [...books].sort((a, b) => {
      switch (keyFilter) {
        case "newest_saved":
          return (
            new Date(b.book?.createdAt ?? 0).getTime() -
            new Date(a.book?.createdAt ?? 0).getTime()
          );

        case "oldest_saved":
          return (
            new Date(a.book?.createdAt ?? 0).getTime() -
            new Date(b.book?.createdAt ?? 0).getTime()
          );

        case "lowest_price":
          return (a.book?.price ?? 0) - (b.book?.price ?? 0);
        case "highest_price":
          return (b.book?.price ?? 0) - (a.book?.price ?? 0);
        default:
          return 0;
      }
    });
  } else {
    filteredData = books;
  }

  return (
    <>
      <div className="p-4">
        <Suspense fallback={<GlobalLoading />}>
          <h4 className="tracking-wide font-semibold text-2xl mb-5">
            Wishlist Page
          </h4>

          <div className="flex gap-2.5 flex-wrap">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <CardBookWishlist
                  key={item?.id}
                  id={item?.bookId}
                  title={String(item?.book?.title)}
                  author={item?.book?.author as string}
                  price={Number(item?.book?.price)}
                  images={item?.book?.images}
                  categories={item?.book?.categories}
                  status={""}
                  book_type={item?.book?.book_type!}
                  fetchBooks={fetchBooks}
                />
              ))
            ) : (
              <div className="flex justify-center items-center w-full">
                <Empty />
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default Wishlist;
