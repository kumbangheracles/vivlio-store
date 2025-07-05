export type BookProps = {
  id?: number;
  title: string;
  author: string;
  price: number;
  book_type: string;
  book_cover?: string;
  categoryId?: number | null;
};

export const initialBookProps: BookProps = {
  title: "",
  author: "",
  price: 0,
  book_type: "",
  book_cover: "",
  categoryId: null,
};
