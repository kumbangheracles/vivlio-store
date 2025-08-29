"use client";
import myAxios from "@/libs/myAxios";
import { BookWithWishlist, WishlistProps } from "@/types/wishlist.type";
import { Card, Typography } from "antd";
import { Suspense, useEffect, useState } from "react";
import GlobalLoading from "../GlobalLoading";
import React from "react";

const { Title, Text } = Typography;

type PropTypes = {
  dataWish?: BookWithWishlist[];
  fetchWishlist: () => void;
};

type KeyProps =
  | "newest_saved"
  | "oldest_saved"
  | "lowest_price"
  | "highest_price";

const Wishlist = ({ dataWish, fetchWishlist }: PropTypes) => {
  const [dataWishlist, setDataWishlist] = useState<BookWithWishlist[]>(
    dataWish!
  );
  console.log("Data wish: ", dataWish);
  const [keyFilter, setKeyFilter] = useState<KeyProps>("newest_saved");
  // const getAllWishlist = async () => {
  //   try {
  //     const res = await myAxios.get("/userWishlist");

  //     const data = res.data.results;
  //     console.log("Data wishlist: ", data);
  //     setDataWishlist(data);
  //   } catch (error) {
  //     console.log("Error fetch data wishlist: ", error);
  //   }
  // };

  // useEffect(() => {
  //   getAllWishlist();
  // }, [keyFilter]);
  const refreshWishlist = async () => {
    await fetchWishlist();
    setDataWishlist(dataWish as BookWithWishlist[]);
  };

  useEffect(() => {
    refreshWishlist();
  }, [dataWish]);
  let filteredData: BookWithWishlist[] = [];

  if (keyFilter && dataWishlist.length > 0) {
    filteredData = [...dataWishlist].sort((a, b) => {
      switch (keyFilter) {
        case "newest_saved":
          return (
            new Date(b.book?.createdAt ?? 0).getTime() -
            new Date(a.book?.createdAt ?? 0).getTime()
          );

        case "oldest_saved":
          return (
            new Date(a.book?.createdAt ?? 0).getTime() -
            new Date(b.book?.createdAt ?? 0).getTime()
          );

        case "lowest_price":
          return (a.book?.price ?? 0) - (b.book?.price ?? 0);
        case "highest_price":
          return (b.book?.price ?? 0) - (a.book?.price ?? 0);
        default:
          return 0;
      }
    });
  } else {
    filteredData = dataWishlist;
  }

  const CardBook = React.lazy(() => import("../Home/components/CardBook"));
  return (
    <>
      <Card>
        <Suspense fallback={<GlobalLoading />}>
          <Title>Wishlist Page</Title>

          <div className="flex gap-2.5 flex-wrap">
            {filteredData.map((item) => (
              <CardBook
                fetchWishlist={refreshWishlist}
                key={item?.id}
                title={item?.book?.title as string}
                author={item?.book?.author as string}
                price={item?.book?.price as number}
                status={item?.book?.status as string}
                book_type={item?.book?.book_type!}
                images={item?.book?.images}
                showIcon={"trash"}
                id={item?.bookId}
              />
            ))}
          </div>
        </Suspense>
      </Card>
    </>
  );
};

export default Wishlist;
