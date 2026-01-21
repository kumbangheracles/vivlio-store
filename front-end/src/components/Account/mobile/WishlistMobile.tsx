"use client";
import { BookWithWishlist } from "@/types/wishlist.type";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, message, Modal, Result, Select } from "antd";
import { useMemo, useState } from "react";
import CardBookWishlist from "../CardBookWishlist";
import { useWishlistStore } from "@/zustand/wishlist.store";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
interface PropTypes {
  dataWishlists?: BookWithWishlist[];
}

type OptionType =
  | "newest_saved"
  | "oldest_saved"
  | "highest_price"
  | "lowest_price";

const WishlistMobile = ({ dataWishlists }: PropTypes) => {
  const auth = useAuth();
  const router = useRouter();
  if (!auth) {
    message.info("You must login first");
    router.push("/login");
  }
  const { loading, fetchBooks } = useWishlistStore();
  const [selectOption, setSelectedOption] =
    useState<OptionType>("newest_saved");
  const toTime = (date?: Date | string) => {
    if (!date) return 0;
    return date instanceof Date ? date.getTime() : new Date(date).getTime();
  };

  const filteredWishlists = useMemo(() => {
    if (!dataWishlists) return [];

    const sorted = [...dataWishlists];

    switch (selectOption) {
      case "newest_saved":
        return sorted.sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt));

      case "oldest_saved":
        return sorted.sort((a, b) => toTime(a.createdAt) - toTime(b.createdAt));

      case "highest_price":
        return sorted.sort((a, b) => b.book!.price - a.book!.price);

      case "lowest_price":
        return sorted.sort((a, b) => a.book!.price - b.book!.price);

      default:
        return sorted;
    }
  }, [dataWishlists, selectOption]);

  return (
    <div>
      <div className="fixed top-0 bg-white shadow-sm justify-between flex w-full px-3 py-3 z-[999]">
        <div className="flex items-center gap-2">
          <ArrowLeftOutlined onClick={() => router.back()} />
          <h4 className="text-sm font-bold tracking-wide">Wishlist</h4>
        </div>

        <div>
          <Select
            loading={loading}
            style={{ minWidth: 155 }}
            value={selectOption}
            options={[
              {
                value: "newest_saved",
                label: "Newest Saved",
              },
              {
                value: "oldest_saved",
                label: "Oldest Saved",
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
            onChange={(value: OptionType) => setSelectedOption(value)}
          />
        </div>
      </div>

      <div>
        <>
          <div className="flex items-center justify-center bg-gray-100 py-3 mx-2 rounded-md gap-2.5 flex-wrap">
            {filteredWishlists.length > 0 ? (
              filteredWishlists.map((item) => (
                <CardBookWishlist
                  key={item?.id}
                  id={item?.bookId}
                  title={String(item?.book?.title)}
                  author={item?.book?.author as string}
                  price={Number(item?.book?.price)}
                  images={item?.book?.images}
                  categories={item?.book?.categories}
                  status={""}
                  book_type={item?.book?.book_type!}
                  fetchBooks={fetchBooks}
                />
              ))
            ) : (
              <div className="flex justify-center items-center w-full">
                <Result
                  status="404"
                  title="Book not found"
                  subTitle={"Looks like you haven't wish any book yet"}
                  extra={
                    <Button type="primary" onClick={() => router.push("/")}>
                      Let's find it
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
};
export default WishlistMobile;
