import { useEffect, useState } from "react";
import fetchStats from "@/app/actions/fetchStats";

const useStats = () => {
  const [bookId, setBookId] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [purchaseCount, setPurchaseCount] = useState<number>(0);

  const toggleWishlist = () => {
    const change = isWishlisted ? -1 : 1;
    fetchStats(bookId, change, "wishlist");
    setIsWishlisted(!isWishlisted);
  };

  const addPurchase = () => {
    fetchStats(bookId, 1, "purchase");
    setPurchaseCount((prev) => prev + 1);
  };

  return {
    setBookId,
    isWishlisted,
    toggleWishlist,
    purchaseCount,
    addPurchase,
  };
};

export default useStats;
