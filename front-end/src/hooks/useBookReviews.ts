import { ErrorHandler } from "@/helpers/handleError";
import { isEmpty } from "@/helpers/validation";
import myAxios from "@/libs/myAxios";
import { BookReviewsProps } from "@/types/bookreview.type";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

interface PropTypes {
  page?: number;
  setPage?: Dispatch<SetStateAction<number>>;
  reviews: BookReviewsProps[];
  setReviews: Dispatch<SetStateAction<BookReviewsProps[]>>;
}

const useBookReviews = ({ page, reviews, setReviews, setPage }: PropTypes) => {
  const router = useRouter();
  const [loadingLoad, setLoadingLoad] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isModalReview, setIsModalReview] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const selectedReview = reviews?.find((item) => item.id === selectedId);
  const handleLoadMore = async () => {
    setLoadingLoad(true);
    const nextPage = (page as number) + 1;

    try {
      const response = await fetch(`/api/reviews?page=${nextPage}`);
      const newData = await response.json();

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setReviews((prev) => [...prev!, ...newData]);
        setPage?.(nextPage);
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

  const handleDelete = async (reviewId: string) => {
    try {
      setLoading(true);

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));

      await myAxios.delete(`/book-reviews/${reviewId}`);

      message.success("Successfully delete review");
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setSelectedId("");
      setLoading(false);
      setDeleteModal(false);
    }
  };

  return {
    handleLoadMore,
    handleSubmitReview,
    handleDelete,
    loadingLoad,
    loading,
    hasMore,
    isModalReview,
    deleteModal,
    selectedId,
    setSelectedId,
    setIsModalReview,
    setLoading,
    setLoadingLoad,
    setDeleteModal,
  };
};

export default useBookReviews;
