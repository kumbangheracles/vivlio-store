"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import type { BookProps } from "../../../types/books.type";
import { Result, Select } from "antd";
import { cn } from "@/libs/cn";
import GlobalLoading from "@/components/GlobalLoading";
import { BookWithWishlist } from "@/types/wishlist.type";
import CardBook from "./CardBook";
import useDeviceType from "@/hooks/useDeviceType";
import FadeUpWrapper from "../FadeUpWrapper";
interface BookTypes {
  titleSection?: string;
  dataBooks?: BookProps[];
  dataWishlist?: BookWithWishlist[];
  fetchBooks?: any;
  isSpace?: boolean;
  isSeeAll?: boolean;
  isCategory?: boolean;
  isGenre?: boolean;
  isDisplayFilter?: boolean;
  isDisplayOnlyAvailbleStock?: boolean;
  isDisplayStockable?: boolean;
}
type OptionType = "newest" | "oldest" | "highest_price" | "lowest_price";
type StockOption = "all" | "available";

const ListBook: React.FC<BookTypes> = ({
  titleSection,
  dataBooks,
  fetchBooks,
  isSpace = false,
  isSeeAll = true,
  isCategory = false,
  isGenre = false,
  isDisplayFilter = false,
  isDisplayOnlyAvailbleStock = false,
}) => {
  const isMobile = useDeviceType();
  const [isDisplayStock, setDisplayStock] = useState<boolean>(
    isDisplayOnlyAvailbleStock,
  );

  const [selectOption, setSelectedOption] = useState<OptionType>("newest");
  const toTime = (date?: Date | string) => {
    if (!date) return 0;
    return date instanceof Date ? date.getTime() : new Date(date).getTime();
  };

  const stockSelectValue: StockOption = isDisplayStock ? "available" : "all";

  const handleStockChange = (value: StockOption) => {
    if (value === "available") {
      setDisplayStock(true);
    } else {
      setDisplayStock(false);
    }
  };

  const filteredDataBooks = useMemo(() => {
    if (!dataBooks) return [];

    const stockedBooks = isDisplayStock
      ? (dataBooks?.filter((item) => item.quantity !== 0) ?? [])
      : (dataBooks ?? []);

    const sorted = [...stockedBooks];

    switch (selectOption) {
      case "newest":
        return sorted.sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt));

      case "oldest":
        return sorted.sort((a, b) => toTime(a.createdAt) - toTime(b.createdAt));

      case "highest_price":
        return sorted.sort((a, b) => b.price - a.price);

      case "lowest_price":
        return sorted.sort((a, b) => a.price - b.price);

      default:
        return sorted;
    }
  }, [dataBooks, selectOption, isDisplayStock]);
  useEffect(() => {
    setDisplayStock(isDisplayOnlyAvailbleStock);
  }, [isDisplayOnlyAvailbleStock]);

  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();

  // const [filters, setFilters] = useState({
  //   search: searchParams.get("search") || "",
  //   sortBy: searchParams.get("sortBy") || "newest",
  //   minPrice: searchParams.get("minPrice") || "",
  //   maxPrice: searchParams.get("maxPrice") || "",
  // });

  // const [showAdvanced, setShowAdvanced] = useState(false);

  // // Apply filters to URL
  // const applyFilters = () => {
  //   const params = new URLSearchParams();

  //   Object.entries(filters).forEach(([key, value]) => {
  //     if (value) params.set(key, value);
  //   });

  //   router.push(`${pathname}?${params.toString()}`);
  // };

  // // Clear all filters
  // const clearFilters = () => {
  //   setFilters({
  //     search: "",
  //     sortBy: "newest",
  //     minPrice: "",
  //     maxPrice: "",
  //   });
  //   router.push(pathname);
  // };

  // // Auto-apply on search change (debounced)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     applyFilters();
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [filters.search]);

  return (
    <>
      {isMobile ? (
        <>
          {/* Mobile */}
          <div className="mt-3 pt-2 bg-gray-100 rounded-md">
            <div className="flex justify-between pl-3 pt-2">
              <h4 className="font-semibold tracking-wider text-[11px] px-2">
                {titleSection}
              </h4>

              {isSeeAll && (
                <h4 className="text-gray-500 font-normal mr-2 tracking-normal text-[11px] ">
                  See All
                </h4>
              )}

              {isDisplayFilter && (
                <div className="flex flex-wrap gap-2 px-2 text-[11px] tracking-wider w-[150px]">
                  <Select
                    size="small"
                    className="w-full sm:w-auto"
                    value={stockSelectValue}
                    options={[
                      { value: "all", label: "All Stock" },
                      { value: "available", label: "Available Only" },
                    ]}
                    onChange={handleStockChange}
                  />

                  <Select
                    size="small"
                    className="w-full sm:w-auto"
                    value={selectOption}
                    options={[
                      { value: "newest", label: "Newest" },
                      { value: "oldest", label: "Oldest" },
                      { value: "highest_price", label: "Highest Price" },
                      { value: "lowest_price", label: "Lowest Price" },
                    ]}
                    onChange={(value: OptionType) => setSelectedOption(value)}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-wrap justify-center rounded-md p-4">
              {dataBooks && dataBooks.length !== 0 ? (
                <>
                  {isCategory || isGenre ? (
                    <>
                      {filteredDataBooks && filteredDataBooks.length > 0 ? (
                        filteredDataBooks.map((item, index) => (
                          <FadeUpWrapper delay={index * 100} key={item.id}>
                            <CardBook
                              title={item?.title}
                              id={item.id}
                              price={item?.price}
                              author={item?.author}
                              categoryId={item?.categoryId}
                              book_type={item?.book_type}
                              book_cover={
                                item?.book_cover || "/images/no-image.png"
                              }
                              description={item?.description}
                              status={item?.status}
                              genres={item?.genres}
                              images={item?.images}
                              stats={item.stats}
                              wishlistUsers={item.wishlistUsers}
                              fetchBooks={fetchBooks}
                              quantity={item?.quantity}
                            />
                          </FadeUpWrapper>
                        ))
                      ) : (
                        <Result
                          status="404"
                          title="Book not found"
                          subTitle={
                            isCategory
                              ? "There are no books available in this category."
                              : isGenre
                                ? "There are no books available in this genre."
                                : "There are no books related"
                          }
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {dataBooks?.slice(0, 8).map((item, index) => (
                        <FadeUpWrapper delay={index * 100} key={item.id}>
                          <CardBook
                            key={item?.id}
                            title={item?.title}
                            id={item.id}
                            price={item?.price}
                            author={item?.author}
                            categoryId={item?.categoryId}
                            book_type={item?.book_type}
                            book_cover={
                              item?.book_cover || "/images/no-image.png"
                            }
                            description={item?.description}
                            status={item?.status}
                            genres={item?.genres}
                            images={item?.images}
                            stats={item.stats}
                            wishlistUsers={item.wishlistUsers}
                            fetchBooks={fetchBooks}
                            quantity={item?.quantity}
                          />
                        </FadeUpWrapper>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <Result
                  status="404"
                  title="Book not found"
                  subTitle={
                    isCategory
                      ? "There are no books available in this category."
                      : isGenre
                        ? "There are no books available in this genre."
                        : "There are no books related"
                  }
                />
              )}
            </div>
          </div>

          {isSpace && <div className="p-10"></div>}
        </>
      ) : (
        <>
          {/* Desktop */}
          <div
            className={`mt-10 pt-4 rounded-md ${cn(
              isCategory || isGenre ? "bg-gray-200" : "bg-white",
            )}`}
          >
            {dataBooks!?.length > 0 ? (
              <>
                <div className="flex justify-between">
                  <div>
                    <TitleList>{titleSection}</TitleList>
                  </div>

                  {isDisplayFilter && (
                    <div className=" flex gap-2.5 mr-[50px]">
                      <Select
                        className="ml-[50px]"
                        style={{ minWidth: 150 }}
                        value={stockSelectValue}
                        options={[
                          { value: "all", label: "All Stock" },
                          { value: "available", label: "Stock Available Only" },
                        ]}
                        onChange={handleStockChange}
                      />
                      <Select
                        style={{ minWidth: 140 }}
                        value={selectOption}
                        options={[
                          {
                            value: "newest",
                            label: "Newest",
                          },
                          {
                            value: "oldest",
                            label: "Oldest",
                          },
                          {
                            value: "highest_price",
                            label: "Highest Price",
                          },
                          {
                            value: "lowest_price",
                            label: "Lowest Price",
                          },
                        ]}
                        onChange={(value: OptionType) =>
                          setSelectedOption(value)
                        }
                      />
                    </div>
                  )}
                </div>
                <Suspense fallback={<GlobalLoading />}>
                  <ListBookWrapper
                    className={`flex flex-wrap gap-5 justify-center ${cn(
                      isCategory || isGenre ? "!pt-5 !pb-10" : "",
                    )}`}
                  >
                    <>
                      {isCategory || isGenre ? (
                        <>
                          {filteredDataBooks && filteredDataBooks.length > 0 ? (
                            filteredDataBooks.map((item, index) => (
                              <FadeUpWrapper delay={index * 100} key={item.id}>
                                <CardBook
                                  title={item?.title}
                                  id={item.id}
                                  price={item?.price}
                                  author={item?.author}
                                  categoryId={item?.categoryId}
                                  book_type={item?.book_type}
                                  book_cover={
                                    item?.book_cover || "/images/no-image.png"
                                  }
                                  description={item?.description}
                                  status={item?.status}
                                  genres={item?.genres}
                                  images={item?.images}
                                  stats={item.stats}
                                  wishlistUsers={item.wishlistUsers}
                                  fetchBooks={fetchBooks}
                                  quantity={item?.quantity}
                                />
                              </FadeUpWrapper>
                            ))
                          ) : (
                            <Result
                              status="404"
                              title="Book not found"
                              subTitle={
                                isCategory
                                  ? "There are no books available in this category."
                                  : isGenre
                                    ? "There are no books available in this genre."
                                    : "There are no books related"
                              }
                            />
                          )}
                        </>
                      ) : (
                        <>
                          {dataBooks?.slice(0, 8).map((item, index) => (
                            <FadeUpWrapper delay={index * 100} key={item.id}>
                              <CardBook
                                key={item?.id}
                                title={item?.title}
                                id={item.id}
                                price={item?.price}
                                author={item?.author}
                                categoryId={item?.categoryId}
                                book_type={item?.book_type}
                                book_cover={
                                  item?.book_cover || "/images/no-image.png"
                                }
                                description={item?.description}
                                status={item?.status}
                                genres={item?.genres}
                                images={item?.images}
                                stats={item.stats}
                                wishlistUsers={item.wishlistUsers}
                                fetchBooks={fetchBooks}
                                quantity={item?.quantity}
                              />
                            </FadeUpWrapper>
                          ))}
                        </>
                      )}
                    </>
                  </ListBookWrapper>
                </Suspense>
              </>
            ) : (
              <>
                <TitleList>{titleSection}</TitleList>
                <Result
                  status="404"
                  title="Book not found"
                  subTitle={
                    isCategory
                      ? "There are no books available in this category."
                      : isGenre
                        ? "There are no books available in this genre."
                        : "There are no books related"
                  }
                />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ListBook;

export const TitleList = styled.h4`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: start;
  margin-bottom: 10px;
  margin-left: 50px;
`;

const ListBookWrapper = styled.div`
  padding: 5px;
  margin: 0rem 2rem;
`;
