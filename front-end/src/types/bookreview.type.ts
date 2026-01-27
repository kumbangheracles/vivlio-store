import { BookProps } from "./books.type";
import { UserProperties } from "./user.type";

export interface BookReviewsProps {
  id?: string;
  rating?: number;
  comment?: string;
  bookId?: string;
  userId?: string;
  user?: UserProperties;
  book?: BookProps;
  createdAt?: Date;
  updatedAt?: Date;
}

export const initialBookReview: BookReviewsProps = {
  id: "",
  rating: 0,
  comment: "",
  bookId: "",
  userId: "",
};
