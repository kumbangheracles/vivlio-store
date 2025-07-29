export type BookProps = {
  id?: string;
  title: string;
  author: string;
  price: number;
  status: string;
  book_type: string;
  book_cover?: string;
  categoryId?: string;
  genre?: string[];
  images?: BookImage[];
};
type BookImage = {
  bookId: string;
  imageUrl: string;
};

export enum BookStatusType {
  PUBLISH = "PUBLISHED",
  UNPUBLISH = "UNPUBLISHED",
}
export const initialBookProps: BookProps = {
  title: "",
  author: "",
  price: 0,
  book_type: "",
  status: "",
  book_cover: "",
  categoryId: "",
};
