import myAxios from "@/libs/myAxios";
import { BookReviewsProps } from "@/types/bookreview.type";
import { message } from "antd";
import { ErrorHandler } from "./handleError";
import { isEmpty } from "./validation";

interface SubmitReviewParams {
  data: BookReviewsProps;
  rating: number;
  bookId: string;
  userId: string;
  selectedReviewId?: string;
  onSuccess?: () => void;
  onFinally?: () => void;
}

export const submitReview = async ({
  data,
  rating,
  bookId,
  userId,
  selectedReviewId,
  onSuccess,
  onFinally,
}: SubmitReviewParams) => {
  // 🔹 Validasi
  if (!data?.comment || isEmpty(data.comment)) {
    message.error("Comment are required!.");
    return;
  }

  if (data.comment.length < 10) {
    message.error("Comment Atleast 10 characters!.");
    return;
  }

  try {
    const payload = {
      rating,
      comment: data.comment,
      bookId,
      userId,
    };

    if (selectedReviewId) {
      await myAxios.patch(`/book-reviews/${selectedReviewId}`, payload);
      message.success("Success update review");
    } else {
      await myAxios.post(`/book-reviews/${bookId}`, payload);
      message.success("Success create review");
    }

    onSuccess?.();
  } catch (error) {
    ErrorHandler(error);
  } finally {
    onFinally?.();
  }
};
