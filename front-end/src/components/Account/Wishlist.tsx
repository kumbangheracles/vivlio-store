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

const Wishlist = ({ dataWish }: PropTypes) => {
  const { fetchBooks } = useWishlistStore();

  return (
    <>
      <div className="p-4">
        <Suspense fallback={<GlobalLoading />}>
          <h4 className="tracking-wide font-semibold text-2xl mb-5">
            Wishlist Page
          </h4>

          <div className="flex gap-2.5 flex-wrap">
            {dataWish?.length! > 0 ? (
              dataWish?.map((item) => (
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
