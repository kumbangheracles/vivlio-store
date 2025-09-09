"use client";
import { BookImage, BookProps } from "@/types/books.type";
import { Button, Card, Carousel, Flex, message, Modal, Spin } from "antd";
import { CarouselRef } from "antd/es/carousel";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { styled } from "styled-components";
import DefaultImage from "../../assets/images/bookDefault.png";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import tw from "tailwind-styled-components";
// import tw from "twin.macro";
import AppButton from "../AppButton";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
import { useIsWishlistStore } from "@/zustand/isWishlist.store";
type PropTypes = BookProps & {};

const CardBookWishlist: React.FC<PropTypes> = ({
  title,
  price,
  book_cover,
  images,
  author,
  genres,
  id,
  fetchBooks,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsWishlist, isWishlist } = useIsWishlistStore();
  const handleRemoveWishlist = async (bookId: string) => {
    if (!bookId) {
      message.error("Book not found");
      return;
    }
    try {
      setLoading(true);

      await myAxios.delete(`/userWishlist/${bookId}`);
      message.success("Success delete from wishlist");
      setIsWishlist(bookId, false);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      await fetchBooks();
      setLoading(false);
      setModalOpen(false);
    }
  };

  return (
    <StyledCard>
      <div
        className="rounded-[50%] bg-white cursor-pointer absolute right-3 top-3 z-50 w-[25px] h-[25px] flex justify-center items-center border-black border-1"
        onClick={() => setModalOpen(true)}
      >
        {loading ? (
          <Spin size="small" />
        ) : (
          <FaRegTrashAlt className="text-sm text-red-400 " />
        )}
      </div>
      <div className="top-card w-full">
        {/* <div className="top-content relative">
       
        </div> */}

        <div className="relative w-full">
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
        Rp
        {price.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })}
      </span>

      <Modal
        open={modalOpen}
        confirmLoading={loading}
        onCancel={() => setModalOpen(false)}
        closable={false}
        footer={
          <div className="flex gap-3.5 items-center justify-end w-full">
            <AppButton
              label="Cancel"
              onClick={() => setModalOpen(false)}
              loading={loading}
            />
            <AppButton
              label="Delete"
              customColor="danger"
              loading={loading}
              onClick={() => handleRemoveWishlist(id as string)}
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
    </StyledCard>
  );
};

export default CardBookWishlist;

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
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
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
