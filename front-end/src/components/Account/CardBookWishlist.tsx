"use client";
import { BookProps } from "@/types/books.type";
import { Card, message, Modal, Spin } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { styled } from "styled-components";
import DefaultImage from "../../assets/images/bookDefault.png";
import { DeleteOutlined } from "@ant-design/icons";
import AppButton from "../AppButton";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
import { useIsWishlistStore } from "@/zustand/isWishlist.store";
import useDeviceType from "@/hooks/useDeviceType";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { truncateText } from "@/helpers/truncateText";
import { useRouter } from "next/navigation";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
type PropTypes = BookProps & {};

const CardBookWishlist: React.FC<PropTypes> = ({
  title,
  price,
  images,
  author,
  id,

  fetchBooks,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsWishlist, wishlist, isWishlist } = useIsWishlistStore();
  const router = useRouter();
  const isMobile = useDeviceType();
  const { handlePushRoute } = useGlobalLoadingBar();
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
      await fetchBooks?.();
      setLoading(false);
      setModalOpen(false);
      router.refresh();
    }
  };
  const goToDetail = (id: string) => {
    handlePushRoute(`/book/${id}`);
  };
  return (
    <>
      {isMobile ? (
        <>
          <div
            className="flex items-center z-10 flex-col overflow-hidden cursor-pointer relative bg-white rounded-md gap-1 w-[120px] h-[200px]"
            onClick={() => goToDetail(id as string)}
          >
            <div
              className="rounded-[50%] bg-white cursor-pointer absolute right-1 top-1 z-50 w-[25px] h-[25px] flex justify-center items-center border-black border-1"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
            >
              {loading ? (
                <Spin size="small" />
              ) : (
                <FaRegTrashAlt className="text-sm text-red-400 " />
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
          </div>

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
        </>
      ) : (
        <>
          <StyledCard onClick={() => goToDetail(id as string)}>
            <div
              className="rounded-[50%] bg-white cursor-pointer absolute right-3 top-3 z-50 w-[25px] h-[25px] flex justify-center items-center border-black border-1"
              onClick={(e) => {
                (e.stopPropagation(), setModalOpen(true));
              }}
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
        </>
      )}
    </>
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
    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 0.1),
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
