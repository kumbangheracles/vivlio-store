"use client";

import { ArticleProperties } from "@/types/article.type";
import BlogCard from "../BlogCard";
import { Button, Result, Select } from "antd";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
interface PropTypes {
  dataArticles?: ArticleProperties[];
}

export type FilterBooksSort = "newest_saved" | "oldest_saved" | null;
const ArticleIndex = ({ dataArticles }: PropTypes) => {
  const [sort, setSort] = useState<FilterBooksSort>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleReplaceRoute } = useGlobalLoadingBar();

  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [limit, setLimit] = useState<number | null>(9);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    setLoadingMore(false);
    const currentLimit = Number(searchParams.get("limit") || 9);
    setHasMore((dataArticles?.length as number) >= currentLimit);
  }, [dataArticles, searchParams, loadingMore]);
  const handleLoadMore = () => {
    const newLimit = (limit as number) + 6;

    setLoadingMore(true);
    setLimit(newLimit);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("limit", newLimit.toString());

    const currentSortDate = searchParams.get("sortDate");
    if (currentSortDate && currentSortDate.trim() !== "") {
      params.set("sortDate", currentSortDate);
    }
    let url = `?${params.toString()}`;

    startTransition(() => {
      router.replace(url, { scroll: false });
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
    params.delete("sortDate");
    switch (value) {
      case "newest_saved":
        params.set("sortDate", "newest_saved");
        break;

      case "oldest_saved":
        params.set("sortDate", "oldest_saved");
        break;
    }

    let url = `?${params.toString()}`;

    startTransition(() => {
      handleReplaceRoute(url);
      router.refresh();
    });
  };

  return (
    <div className="w-full">
      <div className="mt-[40px] sm:mt-[100px] w-full">
        {!dataArticles ? (
          <div className="p-4 w-full h-full">
            <div className="flex items-center justify-center h-screen w-full flex-col gap-3">
              <Result
                status={404}
                className="cart-result"
                title={
                  "No articles are available at the moment. Please check back later."
                }
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex p-4 items-center justify-between">
              <h4 className="text-center font-semibold sm:text-3xl text-sm">
                BLOG PAGE
              </h4>
              <div>
                <Select
                  loading={loadingMore || isPending}
                  placeholder={"Filter By"}
                  defaultValue={sort}
                  style={{ minWidth: 150 }}
                  onChange={(value) => updateFilters(value)}
                  options={[
                    { label: "Newest Saved", value: "newest_saved" },
                    { label: "Oldest Saved", value: "oldest_saved" },
                  ]}
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2  py-5 mx-3 bg-gray-100 rounded-md">
              {dataArticles?.map((item) => (
                <BlogCard dataAricle={item} key={item?.id} />
              ))}
            </div>

            {hasMore && (
              <div className="p-4 flex items-center justify-center">
                <Button
                  onClick={handleLoadMore}
                  type="primary"
                  loading={loadingMore || isPending}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleIndex;
