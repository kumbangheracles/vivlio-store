"use client";

import React, { Suspense, useEffect, useState } from "react";

import styled from "styled-components";
import axios from "axios";
import type { BaseMultipleResponse } from "../../../types/base.type";
import type { BookProps } from "../../../types/books.type";
import { Empty } from "antd";
import GlobalLoading from "@/components/GlobalLoading";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { BookWithWishlist, WishlistProps } from "@/types/wishlist.type";

interface BookTypes {
  titleSection?: string;
  dataBooks?: BookProps[];
  dataWishlist?: BookWithWishlist[];
  fetchBooks?: any;
}

const ListBook: React.FC<BookTypes> = ({
  titleSection,
  dataBooks,
  fetchBooks,
  dataWishlist,
}) => {
  const CardBook = React.lazy(() => import("./CardBook"));
  return (
    <>
      <div style={{ marginTop: "50px" }}>
        {dataBooks!?.length > 0 ? (
          <>
            <TitleList>{titleSection}</TitleList>
            <ListBookWrapper className="grid gap-[10px] p-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-3">
              <Suspense fallback={<GlobalLoading />}>
                {dataBooks?.map((item) => (
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
                ))}
              </Suspense>
            </ListBookWrapper>
          </>
        ) : (
          <>
            <TitleList>{titleSection}</TitleList>
            <Empty />
          </>
        )}
      </div>
    </>
  );
};

export default ListBook;

const TitleList = styled.h4`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 10px;
`;

const ListBookWrapper = styled.div`
  padding: 1rem;
`;
