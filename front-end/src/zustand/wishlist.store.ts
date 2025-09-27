import { create } from "zustand";
import { BookWithWishlist } from "@/types/wishlist.type";
import fetchWishlist from "@/components/Account/fetchWishlist";

import fetchBooksHome from "@/app/actions/fetchBooksHome";
type WishlistState = {
  books: BookWithWishlist[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;

  fetchBooksHome: () => Promise<void>;
  clear: () => void;
};
export const useWishlistStore = create<WishlistState>((set) => ({
  books: [],
  loading: false,
  error: null,

  fetchBooksHome: async () => {
    try {
      set({ loading: true, error: null });
      const data = await fetchBooksHome();
      set({ books: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch books", loading: false });
    }
  },

  fetchBooks: async () => {
    try {
      set({ loading: true, error: null });
      const data = await fetchWishlist();
      set({ books: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch wishlist", loading: false });
    }
  },
  clear: () => set({ books: [] }),
}));
