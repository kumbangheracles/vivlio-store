import { create } from "zustand";
interface WishlistState {
  wishlist: Record<string, boolean>;
  setIsWishlist: (bookId: string, value: boolean) => void;
  isWishlist: (bookId: string) => boolean;
}

export const useIsWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: {},

  setIsWishlist: (bookId, value) =>
    set((state) => ({
      wishlist: {
        ...state.wishlist,
        [bookId]: value,
      },
    })),

  isWishlist: (bookId) => {
    return get().wishlist[bookId] ?? false;
  },
}));
