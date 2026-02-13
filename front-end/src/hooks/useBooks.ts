"use client";
import { useSearchParams, useRouter } from "next/navigation";

import { useState, useTransition, useEffect } from "react";
import useDeviceType from "./useDeviceType";
import useGlobalLoadingBar from "./useGlobalLoadingBar";
import { BookProps } from "@/types/books.type";

export type FilterBooksSort =
  | "price_asc"
  | "price_desc"
  | "newest_saved"
  | "oldest_saved"
  | "all_stock"
  | "only_available"
  | null;

interface PropTypes {
  dataBooks?: BookProps[];
}
const useBooks = ({ dataBooks }: PropTypes) => {
  const [sort, setSort] = useState<FilterBooksSort>(null);
  const [sortStock, setSortStock] = useState<FilterBooksSort>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleReplaceRoute } = useGlobalLoadingBar();
  const isMobile = useDeviceType();

  const [isPending, startTransition] = useTransition();
  const limitParams = Number(searchParams.get("limit") || 10);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [limit, setLimit] = useState<number | null>(limitParams || 10);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    setLoadingMore(false);
    const currentLimit = Number(searchParams.get("limit") || 10);
    setHasMore((dataBooks?.length as number) >= currentLimit);
  }, [dataBooks, searchParams, loadingMore]);
  const handleLoadMore = () => {
    const newLimit = (limit as number) + 10;

    setLoadingMore(true);
    setLimit(newLimit);

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", newLimit.toString());

    const currentSortPrice = searchParams.get("sortPrice");
    if (currentSortPrice && currentSortPrice.trim() !== "") {
      params.set("sortPrice", currentSortPrice);
    }

    let url = "";
    if (isMobile) {
      url = `?${params.toString()}`;
    } else {
      url = `?key=books?${params.toString()}`;
    }

    startTransition(() => {
      router.push(url, { scroll: false });
      router.refresh();
    });
  };

  const updateFilters = (value: FilterBooksSort) => {
    setLoadingMore(false);
    setSort(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (limit) {
      params.set("limit", limit.toString());
    }
    params.delete("sortPrice");
    params.delete("sortDate");
    // params.delete("onlyAvailable");
    switch (value) {
      case "price_asc":
        params.set("sortPrice", "1");
        break;

      case "price_desc":
        params.set("sortPrice", "-1");
        break;

      case "newest_saved":
        params.set("sortDate", "newest_saved");
        break;

      case "oldest_saved":
        params.set("sortDate", "oldest_saved");
        break;
      // case "all_stock":
      //   params.set("onlyAvailable", "false");
      //   break;
      // case "only_available":
      //   params.set("onlyAvailable", "true");
      //   break;
    }

    let url = `?${params.toString()}`;

    startTransition(() => {
      handleReplaceRoute(url);
      router.refresh();
    });
  };
  const updateFilterStock = (value: FilterBooksSort) => {
    setLoadingMore(false);
    setSortStock(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (limit) {
      params.set("limit", limit.toString());
    }

    // params.delete("onlyAvailable");
    switch (value) {
      case "all_stock":
        params.set("onlyAvailable", "false");
        break;
      case "only_available":
        params.set("onlyAvailable", "true");
        break;
    }

    let url = `?${params.toString()}`;

    console.log("final params: ", params.toString());

    startTransition(() => {
      handleReplaceRoute(url);
      router.refresh();
    });
  };

  return {
    updateFilters,
    updateFilterStock,
    handleLoadMore,
    loadingMore,
    isPending,
    hasMore,
    sort,
    sortStock,
  };
};

export default useBooks;
