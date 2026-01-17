import { BookProps } from "./books.type";

export type WishlistProps = {
  id?: string;
  bookId?: string;
  userId?: string;
};

export interface BookWithWishlist {
  book?: BookProps;
  id?: string;
  bookId?: string;
  userId?: string;
  createdAt?: Date;
  updateAt?: Date;
}
