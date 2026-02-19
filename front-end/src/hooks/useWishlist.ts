"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import useDeviceType from "./useDeviceType";
import useGlobalLoadingBar from "./useGlobalLoadingBar";
import { BookWithWishlist } from "@/types/wishlist.type";

type WishlistSort =
  | "price_asc"
  | "price_desc"
  | "date_newest"
  | "date_oldest"
  | null;

interface PropTypes {
  dataWish?: BookWithWishlist[];
}
const useWishlist = ({ dataWish }: PropTypes) => {
  const [sort, setSort] = useState<WishlistSort>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { handlePushRoute, handleReplaceRoute } = useGlobalLoadingBar();
  const isMobile = useDeviceType();

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
      router.replace(url, { scroll: false });
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

    let url: string = "";
    if (isMobile) {
      url = `?${params.toString()}`;
    } else {
      url = `?key=wishlist?${params.toString()}`;
    }

    startTransition(() => {
      handleReplaceRoute(url);
      router.refresh();
    });
  };

  return {
    updateFilters,
    handleLoadMore,
    loadingMore,
    isPending,
    hasMore,
    sort,
  };
};

export default useWishlist;
