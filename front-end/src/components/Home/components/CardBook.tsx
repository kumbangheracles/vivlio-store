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
import { truncateText } from "@/helpers/truncateText";
import { useWishlistStore } from "@/zustand/wishlist.store";
import { useIsWishlistStore } from "@/zustand/isWishlist.store";
import useDeviceType from "@/hooks/useDeviceType";
// import { fetchBooks } from "@/app/page";
type CardBookProps = BookProps & {
  showIcon?: "trash" | "wish";
  showStats?: boolean;
  fetchWishlist?: () => void;
  fetchBooks?: () => void;
};

interface StyledCardProps {
  quantity: BookProps["quantity"];
}

const CardBook: React.FC<CardBookProps> = React.memo(
  ({
    author,

    price,
    title,

    id,
    images,
    quantity,
    wishlistUsers,
  }) => {
    const isMobile = useDeviceType();
    const [isInWishlist, setIsInWishlist] = useState(
      wishlistUsers?.length! > 0,
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
      <>
        {isMobile ? (
          <>
            <MobileBookCard
              quantity={quantity}
              onClick={() => goToDetail(bookId as string)}
            >
              {quantity === 0 && (
                <h4 className="absolute p-2 rounded-2xl text-[10px] top-15 left-6 z-[20] opacity-[1] text-red-700 bg-red-200">
                  Out of Stock
                </h4>
              )}
              <div
                className="rounded-[50%] bg-white cursor-pointer absolute right-3 top-3 z-50 w-[18px] h-[18px] flex justify-center items-center border-black border-1 p-[2px]"
                onClick={(e) => {
                  (e.stopPropagation(), handleWishlist());
                }}
              >
                {loading ? (
                  <Spin size="small" />
                ) : (
                  <>
                    {isWishlist(bookId as string) ? (
                      <IoMdHeart className=" text-red-400 " />
                    ) : (
                      <IoMdHeartEmpty className=" text-red-400 " />
                    )}
                  </>
                )}
              </div>
              {images?.[0] && (
                <div
                  key={images[0].bookId || images[0].public_id}
                  className="flex items-center justify-center w-[100px] h-full overflow-hidden p-2 "
                >
                  <Image
                    src={images[0].imageUrl || DefaultImage}
                    width={100}
                    height={100}
                    alt="img-mobile"
                    className="object-cover block object-center w-full h-full "
                  />
                </div>
              )}
              <div className="flex flex-col w-full !px-4 tracking-wide">
                <span className="text-[10px] text-gray-400 font-semibold">
                  {author}
                </span>
                <span className="text-[8px] ">{truncateText(title, 17)}</span>
              </div>
              <div className="flex flex-col text-start !px-4 pb-3 w-full">
                <span className="text-[10px] font-bold tracking-wide">
                  {" "}
                  {Number(price).toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </MobileBookCard>
          </>
        ) : (
          <>
            <StyledCard
              quantity={quantity}
              onClick={() => goToDetail(bookId as string)}
            >
              {quantity === 0 && (
                <h4 className="absolute p-3 rounded-2xl top-20 left-8 z-[20] opacity-[1] text-red-700 bg-red-200">
                  Out of Stock
                </h4>
              )}

              <div
                className="rounded-[50%] bg-white cursor-pointer absolute right-3 top-3 z-50 w-[25px] h-[25px] flex justify-center items-center border-black border-1"
                onClick={(e) => {
                  (e.stopPropagation(), handleWishlist());
                }}
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
                      <WrapperImage
                        key={images[0].bookId || images[0].public_id}
                      >
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
          </>
        )}
      </>
    );
  },
);
const MobileBookCard = styled.div<StyledCardProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  width: 120px;
  height: 200px;

  overflow: hidden;
  cursor: pointer;
  border-radius: 6px;

  background-color: ${({ quantity }) => (quantity === 0 ? "#a8a8a8" : "white")};

  /* jangan pakai opacity langsung */
  ${({ quantity }) =>
    quantity === 0 &&
    `
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background-color: rgba(255, 255, 255, 0.6);
      z-index: 5;
    }
  `}
`;
const StyledCard = styled(Card)<StyledCardProps>`
  position: relative;
  cursor: pointer;
  border: 1px solid #cacaca;
  height: 300px;
  width: 170px;
  overflow: hidden;

  .ant-card-body {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: ${({ quantity }) =>
      quantity === 0 ? "#e1e1e1" : "white"};
  }

  ${({ quantity }) =>
    quantity === 0 &&
    `
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background-color: rgba(255, 255, 255, 0.6);
      z-index: 5;
    }
  `}

  &:hover {
    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
  }

  transition: all ease 0.3s;
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
