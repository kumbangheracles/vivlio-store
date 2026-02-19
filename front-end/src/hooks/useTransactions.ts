"use client";
import { useSearchParams, useRouter } from "next/navigation";

import { useState, useTransition, useEffect } from "react";
import useGlobalLoadingBar from "./useGlobalLoadingBar";
import { BookProps } from "@/types/books.type";
import { TransactionStatus } from "@/types/order.type";
import { TransactionProps } from "@/types/transaction.type";
import { Dayjs } from "dayjs";

interface PropTypes {
  dataTransactions?: TransactionProps[];
}
const useTransaction = ({ dataTransactions }: PropTypes) => {
  const [sort, setSort] = useState<TransactionStatus | null>(null);
  const [sortDate, setSortDate] = useState<Dayjs | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleReplaceRoute, handlePushRoute } = useGlobalLoadingBar();

  const [isPending, startTransition] = useTransition();
  // const limitParams = Number(searchParams.get("limit") || 12);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [limit, setLimit] = useState<number | null>(12);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    setLoadingMore(false);
    const currentLimit = Number(searchParams.get("limitOrders") || 6);
    setHasMore((dataTransactions?.length as number) >= currentLimit);
  }, [dataTransactions, searchParams, loadingMore]);
  const handleLoadMore = () => {
    const newLimit = (limit as number) + 6;

    setLoadingMore(true);
    setLimit(newLimit);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("limitOrders", newLimit.toString());

    const currentSortPrice = searchParams.get("sortPriceOrders");
    if (currentSortPrice && currentSortPrice.trim() !== "") {
      params.set("sortPriceOrders", currentSortPrice);
    }

    const currentSortDate = searchParams.get("sortDateOrders");
    if (currentSortDate && currentSortDate.trim() !== "") {
      params.set("sortDateOrders", currentSortDate);
    }
    let url = `?${params.toString()}`;

    startTransition(() => {
      router.replace(url, { scroll: false });
      router.refresh();
    });
  };

  const updateFiltersStatus = (value: TransactionStatus) => {
    setLoadingMore(false);
    setSort(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (limit) {
      params.set("limitOrders", limit.toString());
    }
    // params.delete("sortPriceOrders");
    // params.delete("sortDateOrders");
    // params.delete("onlyAvailable");
    switch (value) {
      case "canceled":
        params.set("orderStatus", "CANCELLED");
        break;

      case "pending":
        params.set("orderStatus", "PENDING");
        break;
      case "paid":
        params.set("orderStatus", "PAID");
        break;
      case "":
        params.delete("orderStatus");
        break;
    }

    let url = `?${params.toString()}`;

    startTransition(() => {
      handleReplaceRoute(url);
      router.refresh();
    });
  };
  const updateFilterDate = (value: string) => {
    setLoadingMore(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (limit) {
      params.set("limitOrders", limit.toString());
    }

    if (value) {
      params.set("sortDateOrders", value);
    } else {
      params.delete("sortDateOrders");
    }

    const url = `?${params.toString()}`;

    startTransition(() => {
      handleReplaceRoute(url);
      router.refresh();
    });
  };

  const handleSearch = () => {
    if (key === null) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.delete("titleOrders");
    if (limit) {
      params.set("limitOrders", limit.toString());
    }

    if (key) {
      params.append("titleOrders", key);
    }

    let url = `?${params.toString()}`;
    startTransition(() => {
      handleReplaceRoute(url);
      router.refresh();
    });
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.delete("titleOrders");
    if (limit) {
      params.set("limitOrders", limit.toString());
    }

    if (key) {
      params.delete("titleOrders");
    }

    let url = `?${params.toString()}`;
    startTransition(() => {
      handleReplaceRoute(url);
      router.refresh();
    });
  };

  const handleClearDate = () => {
    const params = new URLSearchParams(searchParams.toString());
    setSortDate(null);

    if (!params.has("sortDateOrders")) {
      return;
    }

    params.set("page", "1");
    params.delete("sortDateOrders");
    if (limit) {
      params.set("limitOrders", limit.toString());
    }
    let url = `?${params.toString()}`;
    startTransition(() => {
      handleReplaceRoute(url);
      router.refresh();
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.has("limitOrders")) {
      params.set("limitOrders", "6");

      router.replace(`?${params.toString()}`, { scroll: false });
    }

    setLimit(6);
  }, []);

  return {
    updateFiltersStatus,
    updateFilterDate,
    handleLoadMore,
    setSortDate,
    loadingMore,
    isPending,
    hasMore,
    sort,
    sortDate,
    handleSearch,
    key,
    setKey,
    handleClear,
    handleClearDate,
  };
};

export default useTransaction;
