"use client";
import React from "react";
import Banner from "./components/Banner";
import ListBook from "./components/ListBook";
import { styled } from "styled-components";
import ListCategory from "./components/ListCategory";
import { BookProps } from "@/types/books.type";
import { CategoryProps } from "@/types/category.types";
import useDeviceType from "@/hooks/useDeviceType";
import MobileBanner from "./components/MobileBanner";
import ListBlog from "../ListBlog";
interface PropTypes {
  titleSection?: string;
  dataBooks?: BookProps[];
  dataCategories?: CategoryProps[];
  fetchBooks?: any;
}

export default function HomePage(prop: PropTypes) {
  const isMobile = useDeviceType();
  const recentPopularBook = prop.dataBooks
    ?.filter((item) => item.isPopular)
    .sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    )
    .slice(0, 5);

  const bestSellerBook = prop.dataBooks?.slice(0, 5);
  const newestBooks = prop.dataBooks
    ?.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // terbaru dulu
    })
    .slice(0, 5); // ambil 5 teratas

  // const { titleSection } = prop;
  return (
    <>
      {isMobile ? (
        <>
          <div>
            <div className="flex items-center justify-between mx-3">
              <span className="font-semibold tracking-wider text-sm">
                Categories
              </span>
              <span className=" tracking-wider text-[10px] text-gray-400">
                See All
              </span>
            </div>
            <div className="w-full overflow-x-scroll py-2 scrollbar-hide px-1">
              <div className="flex items-center gap-3 py-2 px-1 justify-center w-[450px]">
                <span className="p-3 tracking-wider base-blue text-sm flex justify-center items-center !min-w-[80px] rounded-2xl text-[11px] sm:text-sm">
                  All
                </span>
                <span className="p-3 tracking-wider bg-gray-100 text-sm flex justify-center items-center !min-w-[80px] rounded-2xl text-[11px] sm:text-sm">
                  Fantasy
                </span>
                <span className="p-3 tracking-wider bg-gray-100 text-sm flex justify-center items-center !min-w-[80px] rounded-2xl text-[11px] sm:text-sm">
                  Sci-fi
                </span>
                <span className="p-3 tracking-wider bg-gray-100 text-sm flex justify-center items-center !min-w-[80px] rounded-2xl text-[11px] sm:text-sm">
                  Art
                </span>
                <span className="p-3 tracking-wider bg-gray-100 text-sm flex justify-center items-center !min-w-[80px] rounded-2xl text-[11px] sm:text-sm">
                  Philosopy
                </span>
              </div>
            </div>
          </div>

          <MobileBanner />
          <div>
            <ListBook
              dataBooks={recentPopularBook}
              titleSection={"Recently Popular"}
              fetchBooks={prop.fetchBooks}
            />

            <ListBook titleSection={"Best Seller"} dataBooks={bestSellerBook} />

            <ListBook titleSection={"Newest Book"} dataBooks={newestBooks} />

            <ListBlog />
          </div>
        </>
      ) : (
        <>
          <div>
            <Banner />

            <div className="mt-7">
              <TitleList>Popular Category</TitleList>
              <ListCategory dataCategories={prop.dataCategories} />
            </div>
          </div>
          <div>
            <ListBook
              dataBooks={recentPopularBook}
              titleSection={"Recently Popular"}
              fetchBooks={prop.fetchBooks}
            />
          </div>
          <div>
            <ListBook titleSection={"Best Seller"} dataBooks={bestSellerBook} />
          </div>
          <div>
            <ListBook titleSection={"Newest Book"} dataBooks={newestBooks} />
          </div>

          <ListBlog />
        </>
      )}
    </>
  );
}

export const ListCardWrapper = styled.div`
  padding: 1rem;
  display: flex;
  width: 100%;
  margin: auto;
  justify-content: center;

  gap: 20px;
`;

export const TitleList = styled.h4`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: start;
  margin-bottom: 10px;
  margin-left: 50px;
`;
