"use client";

import React, { Suspense } from "react";
import styled from "styled-components";
import type { BookProps } from "../../../types/books.type";
import { Result } from "antd";
import { cn } from "@/libs/cn";
import GlobalLoading from "@/components/GlobalLoading";
import { BookWithWishlist } from "@/types/wishlist.type";
import CardBook from "./CardBook";
import useDeviceType from "@/hooks/useDeviceType";
interface BookTypes {
  titleSection?: string;
  dataBooks?: BookProps[];
  dataWishlist?: BookWithWishlist[];
  fetchBooks?: any;
  isSpace?: boolean;
  isSeeAll?: boolean;
  isCategory?: boolean;
}

const ListBook: React.FC<BookTypes> = ({
  titleSection,
  dataBooks,
  fetchBooks,
  isSpace = false,
  isSeeAll = true,
  isCategory = false,
}) => {
  const isMobile = useDeviceType();
  return (
    <>
      {isMobile ? (
        <>
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
            </div>

            <div className="flex gap-3 flex-wrap justify-center rounded-md p-4">
              {dataBooks && dataBooks.length !== 0 ? (
                dataBooks.slice(0, 8).map((item, index) => (
                  <div
                    key={item.id}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    data-aos-offset="0"
                    data-aos-anchor-placement="top-center"
                  >
                    <CardBook
                      title={item.title}
                      id={item.id}
                      price={item.price}
                      author={item.author}
                      categoryId={item.categoryId}
                      book_type={item.book_type}
                      book_cover={item.book_cover || "/images/no-image.png"}
                      description={item.description}
                      status={item.status}
                      genres={item.genres}
                      images={item.images}
                      stats={item.stats}
                      wishlistUsers={item.wishlistUsers}
                      fetchBooks={fetchBooks}
                    />
                  </div>
                ))
              ) : (
                <Result
                  status="404"
                  title="Book not found"
                  subTitle={
                    isCategory
                      ? "There are no books available in this category."
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
          {" "}
          <div
            className={`mt-10 pt-2 rounded-md ${cn(
              isCategory ? "bg-gray-100" : "bg-white",
            )}`}
          >
            {dataBooks!?.length > 0 ? (
              <>
                <TitleList>{titleSection}</TitleList>
                <Suspense fallback={<GlobalLoading />}>
                  <ListBookWrapper
                    className={`flex flex-wrap gap-5 justify-center ${cn(
                      isCategory ? "!pt-5 !pb-10" : "",
                    )}`}
                  >
                    {dataBooks?.slice(0, 8).map((item, index) => (
                      <div
                        key={item?.id}
                        data-aos="fade-up"
                        data-aos-delay={index * 100} // delay 100ms bertahap tiap card
                      >
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
                        />
                      </div>
                    ))}
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
