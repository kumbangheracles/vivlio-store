"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import type { BookProps } from "../../../types/books.type";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Card, message, Spin } from "antd";
import DefaultImage from "../../../assets/images/bookDefault.png";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";

import { useWishlistStore } from "@/zustand/wishlist.store";
import { useIsWishlistStore } from "@/zustand/isWishlist.store";
// import { fetchBooks } from "@/app/page";
type CardBookProps = BookProps & {
  showIcon?: "trash" | "wish";
  showStats?: boolean;
  fetchWishlist?: () => void;
  fetchBooks?: () => void;
};

const CardBook: React.FC<CardBookProps> = React.memo(
  ({
    author,

    price,
    title,

    id,
    images,

    wishlistUsers,
  }) => {
    const [isInWishlist, setIsInWishlist] = useState(
      wishlistUsers?.length! > 0
    );
    const { setIsWishlist, wishlist, isWishlist } = useIsWishlistStore();
    const { fetchBooksHome } = useWishlistStore();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const auth = useAuth();
    const router = useRouter();

    const bookId = id;

    const handleWishlist = async () => {
      if (!auth.accessToken) {
        message.info("You must login first.");
        router.push("/auth/login");

        return;
      }

      try {
        setLoading(true);

        if (isInWishlist === false) {
          await myAxios.post(`/userWishlist`, { bookId: id });
          message.success("Success add to wishlist");
          setIsInWishlist(true);
          setIsWishlist(bookId as string, true);
          isWishlist(bookId as string);
        } else {
          await myAxios.delete(`/userWishlist/${bookId}`);
          message.success("Success remove from wishlist");
          isWishlist(bookId as string);
          setIsInWishlist(false);
          setIsWishlist(bookId as string, false);
        }
      } catch (error) {
        ErrorHandler(error);
      } finally {
        setLoading(false);
        setModalOpen(false);

        await fetchBooksHome();
        router.refresh();
      }
    };
    useEffect(() => {
      setIsInWishlist(wishlistUsers?.length! > 0);
      setIsWishlist?.(bookId as string, isInWishlist);
    }, [wishlistUsers]);

    const goToDetail = (id: string) => {
      if (!auth.accessToken) {
        message.info("You must login first!!!");
        router.push("/auth/login");
        return;
      }

      router.push(`/book/${id}`);
    };

    return (
      <StyledCard>
        <div
          className="rounded-[50%] bg-white cursor-pointer absolute right-3 top-3 z-50 w-[25px] h-[25px] flex justify-center items-center border-black border-1"
          onClick={() => handleWishlist()}
        >
          {loading ? (
            <Spin size="small" />
          ) : (
            <>
              {isWishlist(bookId as string) ? (
                <IoMdHeart className="text-sm text-red-400 " />
              ) : (
                <IoMdHeartEmpty className="text-sm text-red-400 " />
              )}
            </>
          )}
        </div>
        <div className="top-card w-full">
          <div
            className="relative w-full"
            onClick={() => goToDetail(bookId as string)}
          >
            <div className="mid-content flex items-center justify-center w-[120px] h-full overflow-hidden z-50">
              {images?.[0] && (
                <WrapperImage key={images[0].bookId || images[0].public_id}>
                  <StyledImage
                    src={images[0].imageUrl || DefaultImage}
                    alt={`book-${title}`}
                    width={100}
                    height={100}
                  />
                </WrapperImage>
              )}
            </div>
          </div>
        </div>
        <div
          className="bottom-content flex flex-col items-center justify-center "
          style={{ marginTop: 8 }}
        >
          <div className="flex flex-col leading-[17px] w-full">
            <p className="text-gray-500 text-center">{author}</p>
            <p className="font-medium text-start text-xs">
              {title.length > 50
                ? title.slice(0, 50) + " . . . . ."
                : title || "No Content"}
            </p>
          </div>
        </div>
        <span className="font-bold tracking-wide absolute bottom-5">
          {Number(price).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          })}
        </span>
      </StyledCard>
    );
  }
);

const StyledCard = styled(Card)`
  .ant-card-body {
    position: relative;
    height: 100%;
    width: 100%;
  }
  cursor: pointer;

  border: 1px solid #cacaca;

  transition: all ease 0.3s;

  &:hover {
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
  height: 300px;
  width: 170px;
  overflow: hidden;
`;

const WrapperImage = styled.div`
  background-color: white;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  max-width: 328px;
  height: 170px;
  overflow: hidden;
  border-radius: 4px;
`;

const StyledImage = styled(Image)`
  transition: transform 0.3s ease-in-out;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;

  /* border: 1px solid gray; */
`;

export default CardBook;
