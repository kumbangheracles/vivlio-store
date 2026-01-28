import { BookReviewsProps } from "./bookreview.type";
import { CategoryProps } from "./category.types";
import { GenreProperties } from "./genre.type";

export interface BookFilters {
  search?: string;
  sortBy?: "newest" | "oldest" | "priceAsc" | "priceDesc" | "popular";
  minPrice?: number;
  maxPrice?: number;
  id?: string;
  page?: number;
  limit?: number;
}
export type BookProps = {
  id?: string;
  title: string;
  author: string;
  price: number;
  status: string;
  book_type: BookType;
  book_cover?: string;
  categoryId?: string;
  genres?: GenreProperties[];
  isPopular?: boolean;
  images?: BookImage[];
  description?: string;
  categories?: CategoryProps;
  createdByAdminId?: string;
  stats?: {
    popularityScore?: number;
    purchaseCount?: number;
    wishlistCount?: number;
  };
  wishlistUsers?: WishlistUser[];
  fetchBooks?: () => void;
  createdAt?: Date;
  updateAt?: Date;
  isInCart?: boolean;
  quantity?: number;
  reviews?: BookReviewsProps[];
  UserCart?: { quantity?: number; id?: string };
};

export interface WishlistUser {
  id: string;
  username: string;
}
export type BookImage = {
  bookId?: string;
  imageUrl?: string;
  public_id?: string;
};

export enum BookType {
  Novel = "Novel",
  PictureStory = "Picture Story",
  Comic = "Comic",
  Encyclopedia = "Encyclopedia",
  Anthology = "Anthology",
  Folktale = "Folktale",
  Biography = "Biography",
  Diary = "Diary",
  Novelette = "Novelette",
  Photography = "Photography",
  ScientificWork = "Scientific Work",
  Interpretation = "Interpretation",
  Dictionary = "Dictionary",
  Guide = "Guide (how to)",
  Atlas = "Atlas",
  ScientificBook = "Scientific Book",
  Textbook = "Textbook",
  Magazine = "Magazine",
  DigitalBook = "Digital Book",
}

export enum BookStatusType {
  PUBLISH = "PUBLISHED",
  UNPUBLISH = "UNPUBLISHED",
}
export const initialBookProps: BookProps = {
  title: "",
  author: "",
  price: 0,
  book_type: BookType.Novel,
  status: "",
  book_cover: "",
  categoryId: "",
};
