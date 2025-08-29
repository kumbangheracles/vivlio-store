"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import type { BookImage, BookProps } from "../../../types/books.type";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { FaRegTrashAlt, FaTrash } from "react-icons/fa";
import { Carousel, Flex, message, Modal, Spin } from "antd";
import type { BaseMultipleResponse } from "../../../types/base.type";
import DefaultImage from "../../../assets/images/bookDefault.png";
import Image from "next/image";
import { CarouselRef } from "antd/es/carousel";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useRouter } from "next/navigation";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
import AppModal from "@/components/AppModal";
import AppButton from "@/components/AppButton";
type CardBookProps = BookProps & {
  showIcon?: "trash" | "wish";
  showStats?: boolean;
  fetchWishlist: () => void;
};

const CardBook: React.FC<CardBookProps> = React.memo(
  ({
    author,
    book_type,
    price,
    title,
    book_cover,
    categoryId,
    id,
    images,
    description,
    stats,
    wishlistUsers,
    fetchBooks,
    showIcon = "wish",
    fetchWishlist,
  }) => {
    const carouselRef = useRef<CarouselRef>(null);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [isInWishlist, setIsInWishlist] = useState(
      wishlistUsers?.length! > 0
    );
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const auth = useAuth();
    const router = useRouter();
    const slides: string[] = ["Slide 1", "Slide 2", "Slide 3"];
    const bookId = id;
    const nextSlide = () => {
      if (currentSlide < slides.length - 1) {
        carouselRef.current?.next();
        setCurrentSlide((prev) => prev + 1);
      }
    };

    const prevSlide = () => {
      if (currentSlide > 0) {
        carouselRef.current?.prev();
        setCurrentSlide((prev) => prev - 1);
      }
    };

    const handleWishlist = async () => {
      if (!auth.accessToken) {
        message.info("You must login first.");
        router.push("/auth/login");

        return;
      }

      try {
        setLoading(true);

        if (showIcon === "trash") {
          await myAxios.delete(`/userWishlist/${bookId}`);
          message.success("Success remove from wishlist");
          await fetchWishlist();
          // router.refresh();
          window.location.reload();
          setIsInWishlist(false);
        } else {
          if (isInWishlist === false) {
            await myAxios.post(`/userWishlist`, { bookId: id });
            message.success("Success add to wishlist");
            setIsInWishlist(true);
          } else {
            await myAxios.delete(`/userWishlist/${bookId}`);
            message.success("Success remove from wishlist");

            setIsInWishlist(false);
          }
        }
      } catch (error) {
        ErrorHandler(error);
      } finally {
        setLoading(false);
        setModalOpen(false);
        fetchWishlist();
      }
    };
    useEffect(() => {
      setIsInWishlist(wishlistUsers?.length! > 0);
    }, [wishlistUsers]);

    // useEffect(() => {
    //   setBookId(id as string);
    // }, [id]);

    // const handleWishlistToggle = () => {
    //   toggleWishlist();
    // };

    // const handlePurchase = () => {
    //   addPurchase();
    // };

    return (
      <Card key={id}>
        {showIcon === "wish" ? (
          <>
            {loading ? (
              <Spin />
            ) : (
              <>
                <div
                  style={{
                    position: "absolute",
                    zIndex: "50",
                    right: "10px",
                    top: "10px",
                    cursor: "pointer",
                  }}
                  onClick={handleWishlist}
                >
                  {isInWishlist ? (
                    <IoMdHeart style={{ fontSize: "20px" }} />
                  ) : (
                    <IoMdHeartEmpty style={{ fontSize: "20px" }} />
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <Spin />
            ) : (
              <>
                <div
                  style={{
                    position: "absolute",
                    zIndex: "50",
                    right: "10px",
                    top: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setModalOpen(true)}
                >
                  <FaRegTrashAlt style={{ fontSize: "20px" }} />
                </div>
              </>
            )}
          </>
        )}

        <div className="absolute top-0 h-full w-full">
          <div className="relative w-full">
            {(images?.length as number) > 1 && (
              <Flex
                justify="space-between"
                style={{
                  position: "absolute",
                  zIndex: 10,
                  top: "50%",
                  width: "100%",
                  padding: "0 20px",
                }}
              >
                <div
                  className="rounded-full w-[30px] h-[30px] flex items-center justify-center  bg-white shadow-2xl border-1 cursor-pointer border-black hover:bg-gray-100"
                  onClick={prevSlide}
                >
                  <ArrowLeftOutlined />
                </div>
                <div
                  className="rounded-full w-[30px] h-[30px] flex items-center justify-center  bg-white shadow-2xl border-1 cursor-pointer border-black hover:bg-gray-100"
                  onClick={nextSlide}
                >
                  <ArrowRightOutlined />
                </div>
              </Flex>
            )}

            <Carousel style={{ backgroundColor: "white" }} ref={carouselRef}>
              {images && images.length > 0 ? (
                images.map((img, index) => (
                  <WrapperImage key={img?.public_id || index}>
                    <StyledImage
                      src={img?.imageUrl || DefaultImage}
                      alt={`book-${index}`}
                      width={100}
                      height={100}
                    />
                  </WrapperImage>
                ))
              ) : (
                <WrapperImage>
                  <StyledImage
                    width={100}
                    height={100}
                    src={DefaultImage}
                    alt="default-book"
                  />
                </WrapperImage>
              )}
            </Carousel>
          </div>
        </div>
        <BottomContainer>
          <AuthorText>{author || "No Content"}</AuthorText>
          <h2 style={{ fontWeight: "500", textAlign: "center" }}>
            {title || "No Content"}
          </h2>
          <PriceText>
            Rp {Number(price).toLocaleString("id-ID") || "No Content"}
          </PriceText>
          {/* <BaseDescription
          dangerouslySetInnerHTML={{
            __html:
              description!?.length > 50
                ? description!.slice(0, 50) + " . . . . ."
                : description || "No Content",
          }}
        /> */}

          <ButtonReadMore>{loading ? <Spin /> : "More"}</ButtonReadMore>
        </BottomContainer>

        <Modal
          open={modalOpen}
          confirmLoading={loading}
          // okText="Delete"
          // cancelText="Cancel"
          // onCancel={() => setModalOpen(false)}
          // onOk={handleWishlist}
          closable={false}
          // title={"Are you sure want to remove this book from wishlist?"}
          footer={
            <div className="flex gap-3.5 items-center justify-end w-full">
              <AppButton label="Cancel" onClick={() => setModalOpen(false)} />
              <AppButton
                label="Delete"
                customColor="danger"
                onClick={handleWishlist}
                icon={<DeleteOutlined />}
              />
            </div>
          }
        >
          <div
            style={{
              padding: "1rem",
              textAlign: "center",
              fontSize: "17px",
              fontWeight: 500,
            }}
          >
            Are you sure want to remove this book from wishlist?
          </div>
        </Modal>
      </Card>
    );
  }
);

const Card = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  /* box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.5); */
  border: 1px solid #63666b;
  border-radius: 12px;
  overflow: hidden;
  width: 250px;
  height: 320px;
  position: relative;
  cursor: pointer;
  transition: 0.5s all ease;
  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(155, 152, 152, 0.5);
  }
`;

const BottomContainer = styled.div`
  position: absolute;
  bottom: 0;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  padding-block: 10px;
  width: 100%;
  padding-inline: 10px;
  text-align: center;
`;

const BookWrapper = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`;

const AuthorText = styled.p`
  font-size: 13px;
  color: gray;
  font-weight: 500;
`;

const BookImages = styled(Image)`
  width: 100%;
  height: 100%;
`;

const BaseDescription = styled.div`
  padding: 10px;
  max-height: 90px;
  overflow-y: hidden;
  font-size: 15px;
`;

const ImageContainer = styled.div`
  overflow: hidden;
`;

const ButtonReadMore = styled.button`
  border-radius: 8px;
  width: 100%;
  padding: 5px;
  background-color: #7badff;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.5s ease;
  &:hover {
    opacity: 0.5;
  }

  margin-top: 10px;
`;

const PriceText = styled.p`
  font-size: 14px;
  color: black;
  font-weight: 700;
`;

const StyledImage = styled(Image)`
  transition: transform 0.3s ease-in-out;
  width: 150px;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  margin: auto;
  padding: 1em;
  /* border: 1px solid gray; */
`;
const WrapperImage = styled.div`
  background-color: white;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  max-width: 328px;
  height: 200px;
  overflow: hidden;
`;

export default CardBook;
