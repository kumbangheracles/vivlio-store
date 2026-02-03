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
import { ArticleProperties } from "@/types/article.type";
import { useRouter } from "next/navigation";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
interface PropTypes {
  titleSection?: string;
  dataBooks?: BookProps[];
  dataCategories?: CategoryProps[];
  fetchBooks?: any;
  dataArticles?: ArticleProperties[];
}

export default function HomePage(prop: PropTypes) {
  const router = useRouter();
  const { handlePushRoute } = useGlobalLoadingBar();
  const isMobile = useDeviceType();
  const recentPopularBook = prop.dataBooks
    ?.filter((item) => item.isPopular)
    .sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
    )
    .slice(0, 6);

  const bestSellerBook = prop.dataBooks?.slice(0, 6);
  const newestBooks = prop.dataBooks
    ?.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // terbaru dulu
    })
    .slice(0, 6); // ambil 6 teratas

  // const { titleSection } = prop;

  const newestArticles = prop.dataArticles
    ?.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6);

  const slugify = (text: string) => {
    return text
      .toLowerCase() // huruf kecil
      .trim() // hapus spasi depan/belakang
      .replace(/[^a-z0-9\s-]/g, "") // hapus karakter aneh
      .replace(/\s+/g, "-") // spasi → -
      .replace(/-+/g, "-"); // -- → -
  };

  const goToCategory = (categoryName: string, categoryId: string) => {
    const slug = slugify(categoryName);
    handlePushRoute(`/category/${slug}/${categoryId}`);
  };
  return (
    <>
      {isMobile ? (
        <>
          <div>
            <div className="flex items-center justify-between mx-3">
              <span className="font-semibold tracking-wider text-sm">
                Categories
              </span>
              <span
                className=" tracking-wider text-[10px] text-gray-400"
                onClick={() => handlePushRoute("/category")}
              >
                See All
              </span>
            </div>
            <div className="flex  overflow-x-scroll">
              <div className="w-[1000px] py-2 scrollbar-hide px-1">
                <div className="flex items-center gap-3 py-2 px-1 justify-center">
                  {prop.dataCategories?.slice(0, 5).map((item) => (
                    <span
                      onClick={() => goToCategory(item?.name, item?.categoryId)}
                      key={item.categoryId}
                      className="p-3 tracking-wider bg-gray-100 text-sm flex justify-center items-center !min-w-[90px] rounded-2xl text-[11px] sm:text-sm active:bg-sky-100"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <MobileBanner />
          <div>
            <div className="px-3">
              <ListBook
                isDisplayOnlyAvailbleStock={true}
                dataBooks={recentPopularBook}
                titleSection={"Recently Popular"}
                fetchBooks={prop.fetchBooks}
                isSeeAll={false}
              />
            </div>
            <div className="px-3">
              <ListBook
                isDisplayOnlyAvailbleStock={true}
                isSeeAll={false}
                titleSection={"Best Seller"}
                dataBooks={bestSellerBook}
              />
            </div>
            <div className="px-3">
              <ListBook
                isDisplayOnlyAvailbleStock={true}
                titleSection={"Newest Book"}
                isSeeAll={false}
                dataBooks={newestBooks}
              />
            </div>
            <div className="px-3">
              <ListBlog dataArticles={newestArticles as ArticleProperties[]} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full !flex !justify-center">
            <Banner />
          </div>
          <div className="mt-7">
            <TitleList>Popular Category</TitleList>
            <ListCategory dataCategories={prop.dataCategories} />
          </div>
          <div>
            <ListBook
              isDisplayOnlyAvailbleStock={true}
              dataBooks={recentPopularBook}
              titleSection={"Recently Popular"}
              fetchBooks={prop.fetchBooks}
            />
          </div>
          <div>
            <ListBook
              isDisplayOnlyAvailbleStock={true}
              titleSection={"Best Seller"}
              dataBooks={bestSellerBook}
            />
          </div>
          <div>
            <ListBook
              isDisplayOnlyAvailbleStock={true}
              titleSection={"Newest Book"}
              dataBooks={newestBooks}
            />
          </div>

          <ListBlog dataArticles={prop.dataArticles as ArticleProperties[]} />
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
  flex-direction: column;

  gap: 10px;
  @media (min-width: 720px) {
    padding: 1rem;
    display: flex;
    width: 100%;
    flex-direction: row;
    margin: auto;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;

    gap: 20px;
  }
`;

export const TitleList = styled.h4`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: start;
  margin-bottom: 10px;
  margin-left: 50px;
`;
