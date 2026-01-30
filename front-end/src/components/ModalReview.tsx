import { BookReviewsProps } from "@/types/bookreview.type";
import { Button, Input, Modal } from "antd";
import Image from "next/image";
import AppRate from "./AppRate";
import { Dispatch, SetStateAction } from "react";
import BookDefaultImg from "../assets/images/bookDefault.png";
import useDeviceType from "@/hooks/useDeviceType";
interface PropTypes {
  isModalReview: boolean;
  handleCloseModalRev?: () => void;
  dataReview?: BookReviewsProps;
  setDataReview?: Dispatch<SetStateAction<BookReviewsProps>>;
  handleSubmitReview: (data: BookReviewsProps) => void;
  loading?: boolean;
}

const ModalReview = ({
  handleSubmitReview,
  isModalReview,
  dataReview,
  handleCloseModalRev,
  setDataReview,
  loading,
}: PropTypes) => {
  const isMobile = useDeviceType();
  return (
    <Modal
      open={isModalReview}
      closable={true}
      onCancel={() => handleCloseModalRev?.()}
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
              setDataReview?.({
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
              maxLength={1000}
              defaultValue={dataReview?.comment}
              value={dataReview?.comment}
              onChange={(e) =>
                setDataReview?.({
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
          onClick={() => handleSubmitReview(dataReview as BookReviewsProps)}
          className="!w-full mt-2"
          loading={loading}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default ModalReview;
