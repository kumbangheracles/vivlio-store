import CartIndex from "@/components/Cart";
import fetchBooksHome from "../actions/fetchBooksHome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vivlio - Cart",
  description: "Home page",
};

const CartPage = async () => {
  const dataBooks = await fetchBooksHome();
  const cartedBook = dataBooks.filter((item) => item.isInCart === true);

  console.log("Carted Book: ", cartedBook);
  return <CartIndex books={cartedBook} key={Math.random()} />;
};

export default CartPage;
