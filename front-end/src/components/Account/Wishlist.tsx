"use client";
import { BookWithWishlist } from "@/types/wishlist.type";
import { Button, Empty, Select } from "antd";
import { Suspense } from "react";
import GlobalLoading from "../GlobalLoading";
import React from "react";
import CardBookWishlist from "./CardBookWishlist";
import { useWishlistStore } from "@/zustand/wishlist.store";
import useWishlist from "@/hooks/useWishlist";

type PropTypes = {
  dataWish?: BookWithWishlist[];
  fetchWishlist?: () => void;
};

const Wishlist = ({ dataWish }: PropTypes) => {
  const { fetchBooks } = useWishlistStore();

  const {
    handleLoadMore,
    hasMore,
    isPending,
    loadingMore,
    sort,
    updateFilters,
  } = useWishlist({ dataWish });

  return (
    <>
      <div className="p-4">
        <Suspense fallback={<GlobalLoading />}>
          <div className="flex items-center justify-between">
            <h4 className="tracking-wide font-semibold text-2xl mb-5">
              Wishlist Page
            </h4>

            <div className="flex items-center gap-2">
              <Select
                loading={loadingMore || isPending}
                style={{ minWidth: 150 }}
                value={sort}
                disabled={loadingMore || isPending}
                placeholder="Sort wishlist"
                options={[
                  { value: "price_asc", label: "Lowest Price" },
                  { value: "price_desc", label: "Highest Price" },
                  // { value: "date_newest", label: "Newest Saved" },
                  // { value: "date_oldest", label: "Oldest Saved" },
                ]}
                onChange={updateFilters}
              />
            </div>
          </div>
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

          {hasMore && (
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore || isPending}
              loading={loadingMore || isPending}
              type="primary"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Load More
            </Button>
          )}
        </Suspense>
      </div>
    </>
  );
};

export default Wishlist;
