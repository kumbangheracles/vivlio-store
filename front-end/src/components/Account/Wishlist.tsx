"use client";
import { BookWithWishlist } from "@/types/wishlist.type";
import { Button, Card, Empty, Select } from "antd";
import { Suspense, useEffect, useMemo, useState, useTransition } from "react";
import GlobalLoading from "../GlobalLoading";
import React from "react";
import CardBookWishlist from "./CardBookWishlist";
import { useWishlistStore } from "@/zustand/wishlist.store";
import { useRouter, useSearchParams } from "next/navigation";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import useDeviceType from "@/hooks/useDeviceType";

type PropTypes = {
  dataWish?: BookWithWishlist[];
  fetchWishlist?: () => void;
};

type KeyPropsTime = "newest_saved" | "oldest_saved";

type KeyPropsPrice = "-1" | "1";
type WishlistSort =
  | "price_asc"
  | "price_desc"
  | "date_newest"
  | "date_oldest"
  | null;

const Wishlist = ({ dataWish }: PropTypes) => {
  const { fetchBooks } = useWishlistStore();
  const [sort, setSort] = useState<WishlistSort>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { handlePushRoute } = useGlobalLoadingBar();
  const isMobile = useDeviceType();
  const [selectedOptionPrice, setSelectedOptionPrice] =
    useState<KeyPropsPrice | null>("-1");

  const [selectedOption, setSelectedOption] = useState<KeyPropsTime | null>(
    "newest_saved",
  );
  const [isPending, startTransition] = useTransition();
  const limitParams = Number(searchParams.get("limitWish") || 5);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [limit, setLimit] = useState<number | null>(limitParams || 5);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    setLoadingMore(false);
    const currentLimit = Number(searchParams.get("limitWish") || 5);
    setHasMore((dataWish?.length as number) >= currentLimit);
  }, [dataWish, searchParams, loadingMore]);
  const handleLoadMore = () => {
    const newLimit = (limit as number) + 5;

    setLoadingMore(true);
    setLimit(newLimit);

    const params = new URLSearchParams();
    params.set("pageWish", "1");
    params.set("limitWish", newLimit.toString());

    const currentSortPrice = searchParams.get("sortPrice");
    if (currentSortPrice && currentSortPrice.trim() !== "") {
      params.set("sortPrice", currentSortPrice);
    }

    let url = "";
    if (isMobile) {
      url = `?${params.toString()}`;
    } else {
      url = `?key=wishlist?${params.toString()}`;
    }

    startTransition(() => {
      router.push(url, { scroll: false });
      router.refresh();
    });
  };

  const updateFilters = (value: WishlistSort) => {
    setLoadingMore(false);
    setSort(value);

    const params = new URLSearchParams();
    params.set("pageWish", "1");
    params.set("limitWish", limit?.toString() as string);

    switch (value) {
      case "price_asc":
        params.set("sortPrice", "1");
        break;

      case "price_desc":
        params.set("sortPrice", "-1");
        break;

      case "date_newest":
        params.set("sortDate", "newest_saved");
        break;

      case "date_oldest":
        params.set("sortDate", "oldest_saved");
        break;
    }

    const url = `?key=wishlist?${params.toString()}`;

    startTransition(() => {
      handlePushRoute(url);
      router.refresh();
    });
  };

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
