import CartIndex from "@/components/Cart";
import { Metadata } from "next";
import fetchCartedBooks from "../actions/fetchCartedBooks";

export const metadata: Metadata = {
  title: "Vivlio - Cart",
  description: "Home page",
};

const CartPage = async () => {
  const dataCartedBooks = await fetchCartedBooks();
  console.log("Data Carted Book: ", dataCartedBooks);
  return <CartIndex books={dataCartedBooks} />;
};

export default CartPage;
