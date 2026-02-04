import { ErrorHandler } from "@/helpers/handleError";
import { isEmpty } from "@/helpers/validation";
import myAxios from "@/libs/myAxios";
import { BookReviewsProps, BookReviewStatus } from "@/types/bookreview.type";
import { message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import useGlobalLoadingBar from "./useGlobalLoadingBar";
import useDeviceType from "./useDeviceType";

interface PropTypes {
  page?: number;
  setPage?: Dispatch<SetStateAction<number>>;
  reviews: BookReviewsProps[];
  setReviews: Dispatch<SetStateAction<BookReviewsProps[]>>;
  initialStatus?: string;
  bookReviews: BookReviewsProps[];
}

const useBookReviews = ({
  page,
  reviews,
  setReviews,
  setPage,
  initialStatus = "",
  bookReviews,
}: PropTypes) => {
  const router = useRouter();
  const [loadingLoad, setLoadingLoad] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isModalReview, setIsModalReview] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const isMobile = useDeviceType();
  const [selectedId, setSelectedId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const { handlePushRoute } = useGlobalLoadingBar();
  const limitParams = Number(searchParams.get("limit") || 6);
  const [limit, setLimit] = useState<number | null>(limitParams || 6);
  const [selectedOption, setSelectedOption] = useState<
    BookReviewStatus | string
  >(initialStatus);

  const selectedReview = reviews?.find((item) => item.id === selectedId);

  useEffect(() => {
    // console.log("Fresh data received:", bookReviews.length, "reviews");
    setReviews(bookReviews);
    setLoadingMore(false);

    const currentLimit = Number(searchParams.get("limit") || 6);
    setHasMore(bookReviews.length >= currentLimit);
  }, [bookReviews, setReviews, searchParams]);
  const handleLoadMore = () => {
    const newLimit = (limit as number) + 6;

    setLoadingMore(true);
    setLimit(newLimit);

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", newLimit.toString());

    // Preserve status jika ada
    const currentStatus = searchParams.get("status");
    if (currentStatus && currentStatus.trim() !== "") {
      params.set("status", currentStatus);
    }

    let url = "";
    if (isMobile) {
      url = `?${params.toString()}`;
    } else {
      url = `?key=books_reviews?${params.toString()}`;
    }

    startTransition(() => {
      router.push(url, { scroll: false });
      router.refresh();
    });

    console.log("=== LOAD MORE END ===");
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
  const handleChange = (value: string) => {
    setLimit(6);
    setSelectedOption(value);
    setLoadingMore(false);

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", "6");

    if (value && value.trim() !== "") {
      params.set("status", value);
    }

    let url = "";
    if (isMobile) {
      url = `?${params.toString()}`;
    } else {
      url = `?key=books_reviews?${params.toString()}`;
    }

    startTransition(() => {
      handlePushRoute(url);
      router.refresh();
    });
  };

  return {
    deleteModal,
    handleLoadMore,
    handleSubmitReview,
    handleDelete,
    handleChange,
    hasMore,
    limit,
    setLimit,
    isModalReview,
    isPending,
    loadingLoad,
    loading,
    selectedId,
    selectedOption,
    setSelectedOption,
    setSelectedId,
    setIsModalReview,
    setLoading,
    setLoadingLoad,
    setDeleteModal,
    startTransition,
    setHasMore,
    loadingMore,
    setLoadingMore,
  };
};

export default useBookReviews;
