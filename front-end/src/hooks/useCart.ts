"use client";
import { message } from "antd";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";

interface PropTypes {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isCart: boolean;
  setIsCart: Dispatch<SetStateAction<boolean>>;
  bookId: string;
  fetchCart?: () => void;
}

const useCart = (prop: PropTypes) => {
  const { loading, setLoading, isCart, setIsCart, bookId, fetchCart } = prop;
  const auth = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!auth.accessToken) {
      message.info("You must login first!!!");
      router.push("/auth/login");
      return;
    }

    try {
      setLoading(true);
      if (!isCart) {
        await myAxios.post("/cart", { bookId });
        setIsCart(true);
        message.success("Success add to cart");
      } else {
        await myAxios.delete(`/cart/${bookId}`);
        setIsCart(false);
        message.success("Success remove from cart");
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      await fetchCart?.();
      setLoading(false);
      router.refresh();
    }
  };

  return {
    handleAddToCart,
  };
};

export default useCart;
