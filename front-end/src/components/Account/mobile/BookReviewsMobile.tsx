"use client";

import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Modal, Result, Select, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import BookDefaultImg from "../../../assets/images/default-img.png";
import StarLabel from "@/components/BookDetail/StarLabel";
import { truncateText } from "@/helpers/truncateText";
import useBookReviews from "@/hooks/useBookReviews";
import {
  BookReviewsProps,
  BookReviewStatus,
  initialBookReview,
} from "@/types/bookreview.type";
import dayjs from "dayjs";
import ModalReview from "@/components/ModalReview";
interface PropTypes {
  bookReviews: BookReviewsProps[];
}
const BookReviewsMobile = ({ bookReviews }: PropTypes) => {
  const router = useRouter();
  const [dataReview, setDataReview] =
    useState<BookReviewsProps>(initialBookReview);

  const [reviews, setReviews] = useState<BookReviewsProps[]>(bookReviews);
  const [page, setPage] = useState<number>(1);

  const {
    handleLoadMore,
    handleSubmitReview,
    hasMore,
    isModalReview,
    loading,
    loadingLoad,
    selectedId,
    deleteModal,
    setSelectedId,
    setIsModalReview,
    handleDelete,
    setDeleteModal,
  } = useBookReviews({ reviews, setReviews, setPage, page });

  const handleOpenModalRev = (id: string) => {
    const review = reviews?.find((item) => item.id === id);
    if (review) {
      setSelectedId(id);
      setDataReview(review);
      setIsModalReview(true);
    }
  };

  const handleCloseModalRev = () => {
    setIsModalReview(false);
    setSelectedId("");
  };
  return (
    <div>
      <div className="fixed top-0 bg-white shadow-sm justify-between flex w-full px-3 py-3 z-[999]">
        <div className="flex items-center gap-2">
          <ArrowLeftOutlined onClick={() => router.back()} />
          <h4 className="text-sm font-bold tracking-wide">Book Reviews</h4>
        </div>

        <div>
          <Select
            loading={loading}
            style={{ minWidth: 155 }}
            // value={selectOption}
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
            // onChange={(value: OptionType) => setSelectedOption(value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 justify-center items-center">
        {reviews?.length === 0 ? (
          <>
            <Result
              status="404"
              title="Review not found"
              subTitle={"Looks like you haven't reviewed som book yet"}
            />
          </>
        ) : (
          <>
            {reviews?.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border w-[90%] min-h-[200px] border-gray-300 hover:shadow-xl cursor-pointer relative transition-all`}
              >
                <>
                  {item?.status === BookReviewStatus.REJECTED && (
                    <button
                      className="absolute text-sm rounded-md  active:!bg-red-100 transition-all bg-white text-red-500 border-red-500 border px-3 py-1 bottom-4 left-2 z-20 cursor-pointer"
                      onClick={() => {
                        (setDeleteModal(true),
                          setSelectedId(item?.id as string));
                      }}
                    >
                      Delete
                    </button>
                  )}

                  <Tag
                    className="!absolute right-0 bottom-5"
                    color={
                      item?.status === BookReviewStatus.APPROVED
                        ? "green"
                        : item?.status === BookReviewStatus.IS_UNDER_APPROVAL
                          ? "orange"
                          : "red"
                    }
                  >
                    {item?.status === BookReviewStatus.APPROVED
                      ? "Approved"
                      : item?.status === BookReviewStatus.IS_UNDER_APPROVAL
                        ? "Under Approval"
                        : "Rejected"}
                  </Tag>

                  <div
                    className="flex text-[15px] items-center absolute top-2 transition-all right-2 active:bg-gray-200 rounded-full p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModalRev(item?.id as string);
                    }}
                  >
                    <EditOutlined />
                  </div>
                  <div className="flex items-center gap-3 justify-start">
                    <div className="w-[70px] h-[100px] rounded-md overflow-hidden">
                      <Image
                        className="w-full h-full object-cover"
                        src={item?.book?.images![0]?.imageUrl || BookDefaultImg}
                        width={100}
                        height={100}
                        alt="book-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] text-gray-600">
                        {dayjs(new Date(item?.createdAt!)).format(
                          "DD - MMM - YYYY",
                        )}
                      </p>
                      <h4 className="font-semibold text-sm tracking-wide">
                        {item?.book?.title}
                      </h4>
                      <StarLabel total_star={5} />
                    </div>
                  </div>

                  <div className="p-2">
                    <p className="text-[12px] text-gray-600">
                      {truncateText(item?.comment as string, 30)}
                    </p>
                  </div>
                </>
              </div>
            ))}
          </>
        )}
        <>
          {reviews?.length > 6 && (
            <>
              {hasMore && (
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingLoad}
                  loading={loadingLoad}
                  type="primary"
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                >
                  Load More
                </Button>
              )}
            </>
          )}
        </>
      </div>

      <ModalReview
        handleSubmitReview={() => handleSubmitReview(dataReview)}
        isModalReview={isModalReview}
        dataReview={dataReview}
        handleCloseModalRev={() => handleCloseModalRev()}
        setDataReview={setDataReview}
        loading={loading}
      />

      <Modal
        open={deleteModal}
        closable={true}
        cancelText={"Cancel"}
        onCancel={() => {
          (setDeleteModal(false), setSelectedId(""));
        }}
        confirmLoading={loading}
        onOk={() => handleDelete(selectedId)}
      >
        Are you sure want to delete this review?
      </Modal>
    </div>
  );
};

export default BookReviewsMobile;
