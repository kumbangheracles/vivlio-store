"use client";
import { BookReviewsProps, initialBookReview } from "@/types/bookreview.type";
import Image from "next/image";
import BookDefaultImg from "../../assets/images/bookDefault.png";
import StarLabel from "../BookDetail/StarLabel";
import { EditOutlined } from "@ant-design/icons";
import { truncateText } from "@/helpers/truncateText";

import dayjs from "dayjs";
import { Button, Input, message, Modal, Spin } from "antd";
import { submitReview } from "@/helpers/submitReview";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppRate from "../AppRate";
import useDeviceType from "@/hooks/useDeviceType";
import { isEmpty } from "@/helpers/validation";
import { ErrorHandler } from "@/helpers/handleError";
import myAxios from "@/libs/myAxios";
import { cn } from "@/libs/cn";
interface PropTypes {
  bookReviews?: BookReviewsProps[];
}

const BookReviews = ({ bookReviews }: PropTypes) => {
  const isMobile = useDeviceType();
  const router = useRouter();
  const [dataReview, setDataReview] =
    useState<BookReviewsProps>(initialBookReview);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedId, setSelectedId] = useState<string>("");
  const [isModalReview, setIsModalReview] = useState<boolean>(false);
  const memoizedReview = useMemo(() => {
    return bookReviews?.find((item) => item.id === selectedId);
  }, [selectedId]);

  const selectedReview = bookReviews?.find((item) => item.id === selectedId);

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
    const review = bookReviews?.find((item) => item.id === id);
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
  //   setDataReview(memoizedReview as BookReviewsProps);
  // }, [memoizedReview]);
  return (
    <div className="p-4">
      <h4 className="font-semibold tracking-wide text-2xl mb-5">
        Book Reviews
      </h4>

      <div className="flex flex-wrap gap-3">
        {bookReviews?.map((item) => (
          <div
            key={item?.id}
            className={`"card-wish p-4 rounded-xl border max-w-[300px] border-gray-300 hover:shadow-xl cursor-pointer relative transition-all" ${cn(loading ? "flex items-center justify-center min-w-[300px]" : "")}`}
          >
            {loading ? (
              <Spin size="large" />
            ) : (
              <>
                <div
                  className="flex text-[15px] items-center absolute top-2 transition-all right-2 hover:bg-gray-200 rounded-full p-2"
                  onClick={() => handleOpenModalRev(item?.id as string)}
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

      <Modal
        open={isModalReview}
        closable={true}
        onCancel={() => handleCloseModalRev()}
        footer={false}
        className="sm:!w-[650px]  !w-full"
      >
        <div className="sm:p-4 p-0 noselect">
          <h4 className="font-semibold text-center tracking-wide text-xl sm:text-2xl">
            Book Reviews
          </h4>

          <div className="flex gap-4 items-center justify-center sm:justify-normal flex-col my-4 sm:mt-3">
            <div className="relative w-[80px] h-[120px] h sm:w-[100px] sm:h-[150px] rounded-lg overflow-hidden">
              <Image
                src={
                  (dataReview?.book?.images![0]?.imageUrl as string) ||
                  BookDefaultImg
                }
                alt={"book-img"}
                fill
                className="object-cover w-full h-full "
              />
            </div>

            <div className="tracking-wide flex items-center justify-center flex-col">
              <h4 className="text-gray-700">
                {dataReview?.book?.author || "No Content"}
              </h4>
              <h4 className="font-semibold text-xl">
                {dataReview?.book?.title || "No Content"}
              </h4>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <AppRate
              size={isMobile ? 25 : 37}
              value={dataReview?.rating}
              onChange={(e) =>
                setDataReview({
                  ...dataReview,
                  rating: e,
                })
              }
            />
          </div>

          <div className="mt-4">
            <h4 className="text-center font-semibold text-sm sm:text-xl tracking-wide">
              What do you think about this book?
            </h4>
            <div className="mt-2">
              <Input.TextArea
                minLength={10}
                style={{
                  border: "1px solid gray",
                  padding: 10,
                  fontSize: isMobile ? 12 : 14,
                  minHeight: 150,
                }}
                defaultValue={dataReview?.comment}
                value={dataReview?.comment}
                onChange={(e) =>
                  setDataReview({
                    ...dataReview,
                    comment: e.target.value,
                  })
                }
                placeholder="Tell us about your experience with this book, minimum 10 characters"
              />
            </div>
          </div>

          <Button
            type="primary"
            onClick={() => handleSubmitReview(dataReview)}
            className="!w-full mt-2"
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BookReviews;
