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
import { Button, message, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isEmpty } from "@/helpers/validation";
import { ErrorHandler } from "@/helpers/handleError";
import myAxios from "@/libs/myAxios";
import { cn } from "@/libs/cn";
import ModalReview from "../ModalReview";
interface PropTypes {
  bookReviews: BookReviewsProps[];
}

const BookReviews = ({ bookReviews }: PropTypes) => {
  const router = useRouter();
  const [dataReview, setDataReview] =
    useState<BookReviewsProps>(initialBookReview);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState<BookReviewsProps[]>(bookReviews);
  const [loadingLoad, setLoadingLoad] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isModalReview, setIsModalReview] = useState<boolean>(false);

  const selectedReview = reviews?.find((item) => item.id === selectedId);
  const handleLoadMore = async () => {
    setLoadingLoad(true);
    const nextPage = page + 1;

    try {
      const response = await fetch(`/api/reviews?page=${nextPage}`);
      const newData = await response.json();

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setReviews((prev) => [...prev!, ...newData]);
        setPage(nextPage);
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoadingLoad(false);
      router.refresh();
    }
  };
  const handleSubmitReview = async (data: BookReviewsProps) => {
    if (data?.comment?.length! < 10) {
      message.error("Comment Atleast 10 characters!.");
      return;
    }
    if (isEmpty(data.comment)) {
      message.error("Comment are required!.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        rating: data?.rating,
        comment: data?.comment,
        bookId: selectedReview?.bookId,
        userId: selectedReview?.userId,
      };

      const res = await myAxios.patch(`/book-reviews/${selectedId}`, payload);
      if (res) {
        message.success("Success update review");
        setReviews((prev) =>
          prev.map((review) =>
            review.id === selectedId
              ? { ...review, rating: data.rating, comment: data.comment }
              : review,
          ),
        );
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
      setIsModalReview(false);
      router.refresh();
    }
  };

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

  // useEffect(() => {
  //   router.refresh();
  // }, [reviews]);
  return (
    <div className="p-4">
      <h4 className="font-semibold tracking-wide text-2xl mb-5">
        Book Reviews
      </h4>

      <div className="flex flex-wrap gap-3">
        {reviews?.map((item) => (
          <div
            key={item?.id}
            // data-aos="fade-up"
            // data-aos-delay={index * 100}
            // data-aos-duration={800}
            className={`p-4 rounded-xl border !w-[300px] min-h-[190px] max-w-[300px] border-gray-300 hover:shadow-xl cursor-pointer relative transition-all ${cn(loading ? "flex items-center justify-center min-w-[300px]" : "")}`}
          >
            {loading ? (
              <Spin size="large" />
            ) : (
              <>
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
        ))}
      </div>
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
      <ModalReview
        handleSubmitReview={() => handleSubmitReview(dataReview)}
        isModalReview={isModalReview}
        dataReview={dataReview}
        handleCloseModalRev={() => handleCloseModalRev()}
        setDataReview={setDataReview}
        loading={loading}
      />
    </div>
  );
};

export default BookReviews;
