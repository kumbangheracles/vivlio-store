import { ErrorHandler } from "@/helpers/handleError";
import myAxios from "@/libs/myAxios";
import { message } from "antd";

const fetchStats = async (
  bookId: string,
  count: number,
  type: "wishlist" | "purchase"
) => {
  try {
    const payload =
      type === "wishlist" ? { wishlistCount: count } : { purchaseCount: count };
    await myAxios.patch(`/books/update-stats/${bookId}`, payload);

    if (type === "wishlist") {
      message.success("Add to wishlist success");
    } else if (type === "purchase") {
      message.success("Purchased success");
    }
  } catch (error) {
    console.log("Failed Update stats: ", error);
    ErrorHandler(error);
    // if (type === "wishlist") {
    //   message.error("Failed added to wishlist");
    // } else if (type === "purchase") {
    //   message.error("Purchased failed");
    // }
  }
};

export default fetchStats;
