"use client";
import {
  BookReviewsProps,
  BookReviewStatus,
  initialBookReview,
} from "@/types/bookreview.type";
import Image from "next/image";
import BookDefaultImg from "../../assets/images/bookDefault.png";
import StarLabel from "../BookDetail/StarLabel";
import { EditOutlined } from "@ant-design/icons";
import { truncateText } from "@/helpers/truncateText";

import dayjs from "dayjs";
import { Button, Modal, Result, Select, Spin, Tag } from "antd";
import { startTransition, useEffect, useState } from "react";
import { cn } from "@/libs/cn";
import ModalReview from "../ModalReview";
import useBookReviews from "@/hooks/useBookReviews";
import { useRouter, useSearchParams } from "next/navigation";
import FadeUpWrapper from "../Home/FadeUpWrapper";
interface PropTypes {
  bookReviews: BookReviewsProps[];
  fetchReviews?: () => void;
}

const BookReviews = ({ bookReviews }: PropTypes) => {
  const [dataReview, setDataReview] =
    useState<BookReviewsProps>(initialBookReview);
  const router = useRouter();
  const searchParams = useSearchParams();
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
    selectedOption,
    setSelectedOption,
    isPending,
    handleChange,
    setLimit,
    loadingMore,
    setLoadingMore,
    limit,
  } = useBookReviews({ reviews, setReviews, setPage, page, bookReviews });

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

  useEffect(() => {
    setReviews(bookReviews);
    setLoadingMore(false);
  }, [bookReviews]);

  useEffect(() => {
    const status = searchParams.get("status") || "";
    const currentPage = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 6);
    setSelectedOption(status);
    setLimit(limit);
    setPage(currentPage);
  }, [searchParams]);

  // useEffect(() => {
  //   console.log("Limit in state: ", limit);
  //   const params = new URLSearchParams();

  //   params.set("limit", limit?.toString() as string);

  //   const url = `?${params.toString()}`;

  //   startTransition(() => {
  //     router.push(url);
  //     router.refresh();
  //   });
  // }, [limit]);
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold tracking-wide text-2xl mb-5">
          Book Reviews
        </h4>
        <Select
          loading={loading || isPending}
          style={{ minWidth: 155 }}
          value={selectedOption as BookReviewStatus}
          disabled={loading || isPending}
          placeholder="Filter by status"
          options={[
            {
              value: BookReviewStatus.APPROVED,
              label: "Approved",
            },
            {
              value: BookReviewStatus.IS_UNDER_APPROVAL,
              label: "Under Approval",
            },
            {
              value: BookReviewStatus.REJECTED,
              label: "Rejected",
            },
            {
              value: "",
              label: "All Reviews",
            },
          ]}
          onChange={handleChange}
        />
      </div>

      <div
        className={`flex ${cn(reviews?.length === 0 ? "items-center justify-center" : "flex-wrap gap-3")}`}
      >
        {reviews?.length === 0 ? (
          <>
            <Result
              status="404"
              title="Review not found"
              subTitle={"Looks like you haven't reviewed some book yet"}
            />
          </>
        ) : (
          <>
            {reviews?.map((item, index) => (
              <FadeUpWrapper key={item?.id} delay={index * 100}>
                <div
                  // key={item?.id}
                  // data-aos="fade-up"
                  // data-aos-delay={index * 100}
                  // data-aos-duration={800}
                  className={`p-4 rounded-xl border !w-[300px] min-h-[200px] max-w-[300px] border-gray-300 hover:shadow-xl cursor-pointer relative transition-all ${cn(loading ? "flex items-center justify-center min-w-[300px]" : "")}`}
                >
                  {loading ? (
                    <Spin size="large" />
                  ) : (
                    <>
                      {item?.status === BookReviewStatus.REJECTED && (
                        <button
                          className="absolute text-sm rounded-md  hover:!bg-red-100 transition-all bg-white text-red-500 border-red-500 border px-3 py-1 bottom-4 left-2 z-20 cursor-pointer"
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
                            : item?.status ===
                                BookReviewStatus.IS_UNDER_APPROVAL
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
                        className="flex text-[15px] items-center absolute top-2 transition-all right-2 hover:bg-gray-200 rounded-full p-2"
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
                            src={
                              item?.book?.images![0]?.imageUrl || BookDefaultImg
                            }
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
                          <StarLabel total_star={item?.rating} />
                        </div>
                      </div>

                      <div className="p-2">
                        <p className="text-[12px] text-gray-600">
                          {truncateText(item?.comment as string, 30)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </FadeUpWrapper>
            ))}
          </>
        )}
      </div>
      <>
        {/* {bookReviews?.length > 6 && (
          <> */}
        {hasMore && (
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore || isPending}
            loading={loadingMore || isPending}
            type="primary"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Load More
          </Button>
        )}
        {/* </>
        )} */}
      </>

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

export default BookReviews;
