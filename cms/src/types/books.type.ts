export type BookProps = {
  id?: string;
  title: string;
  author: string;
  price: number;
  book_type: string;
  book_cover?: string;
  categoryId?: string;
  genre?: string[];
};

export const initialBookProps: BookProps = {
  title: "",
  author: "",
  price: 0,
  book_type: "",
  book_cover: "",
  categoryId: "",
};
