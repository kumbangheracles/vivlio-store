"use client";

import React, { Suspense } from "react";
import styled from "styled-components";
import type { BookProps } from "../../../types/books.type";
import { Empty } from "antd";
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
}

const ListBook: React.FC<BookTypes> = ({
  titleSection,
  dataBooks,
  fetchBooks,
  isSpace = false,
}) => {
  const isMobile = useDeviceType();
  return (
    <>
      {isMobile ? (
        <>
          <div className="mt-3 pt-2 bg-gray-100">
            <div className="flex justify-between">
              <h4 className="font-semibold tracking-wider text-[11px] px-2">
                {titleSection}
              </h4>
              <h4 className="text-gray-500 font-normal tracking-normal text-[11px] ">
                See All
              </h4>
            </div>

            <div className="flex gap-3 overflow-x-scroll scrollbar-hide p-4">
              {dataBooks?.slice(0, 8).map((item, index) => (
                <div
                  key={item?.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardBook
                    key={item?.id}
                    title={item?.title}
                    id={item.id}
                    price={item?.price}
                    author={item?.author}
                    categoryId={item?.categoryId}
                    book_type={item?.book_type}
                    book_cover={item?.book_cover || "/images/no-image.png"}
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
            </div>
          </div>

          {isSpace && <div className="p-10"></div>}
        </>
      ) : (
        <>
          {" "}
          <div style={{ marginTop: "50px" }}>
            {dataBooks!?.length > 0 ? (
              <>
                <TitleList>{titleSection}</TitleList>
                <Suspense fallback={<GlobalLoading />}>
                  <ListBookWrapper className="flex flex-wrap gap-5 justify-center">
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
                <Empty />
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
