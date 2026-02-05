"use client";
import { BookWithWishlist } from "@/types/wishlist.type";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, message, Result, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import CardBookWishlist from "../CardBookWishlist";
import { useWishlistStore } from "@/zustand/wishlist.store";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import useDeviceType from "@/hooks/useDeviceType";
import NotFoundPage from "@/components/NotFoundPage";
import useWishlist from "@/hooks/useWishlist";
import { useMounted } from "@/hooks/useMounted";
interface PropTypes {
  dataWishlists?: BookWithWishlist[];
}

type OptionType =
  | "newest_saved"
  | "oldest_saved"
  | "highest_price"
  | "lowest_price";

const WishlistMobile = ({ dataWishlists }: PropTypes) => {
  const auth = useAuth();
  const isMobile = useDeviceType();
  const { handlePushRoute } = useGlobalLoadingBar();
  const router = useRouter();
  useEffect(() => {
    if (!auth) {
      message.info("You must login first");
      handlePushRoute("/login");
    }
  }, [auth, handlePushRoute]);
  const { fetchBooks } = useWishlistStore();

  const {
    handleLoadMore,
    hasMore,
    isPending,
    loadingMore,
    sort,
    updateFilters,
  } = useWishlist({ dataWish: dataWishlists });

  const mounted = useMounted();

  if (!mounted) return null;
  if (!isMobile) {
    return <NotFoundPage />;
  }

  return (
    <div>
      <div className="fixed top-0 bg-white shadow-sm justify-between flex w-full px-3 py-3 z-[999]">
        <div className="flex items-center gap-2">
          <ArrowLeftOutlined onClick={() => router.back()} />
          <h4 className="text-sm font-bold tracking-wide">Wishlist</h4>
        </div>

        <div>
          <Select
            loading={loadingMore || isPending}
            style={{ minWidth: 155 }}
            value={sort}
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

      <div>
        <>
          <div className="flex items-center justify-center bg-gray-100 py-3 mx-2 rounded-md gap-2.5 flex-wrap">
            {dataWishlists!.length > 0 ? (
              dataWishlists!.map((item) => (
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
                <Result
                  status="404"
                  title="Book not found"
                  subTitle={"Looks like you haven't wish any book yet"}
                  extra={
                    <Button type="primary" onClick={() => handlePushRoute("/")}>
                      Let's find it
                    </Button>
                  }
                />
              </div>
            )}
          </div>
          {hasMore && (
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore || isPending}
              loading={loadingMore || isPending}
              type="primary"
              className="mt-4 ml-3 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Load More
            </Button>
          )}
        </>
      </div>
    </div>
  );
};
export default WishlistMobile;
