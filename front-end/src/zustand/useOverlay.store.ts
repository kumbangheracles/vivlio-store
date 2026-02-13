import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";

interface OverlayState {
  isOverlay: boolean;
  setIsOverlay: (val: boolean) => void;
  toggleOverlay: () => void;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  isOverlay: false,
  setIsOverlay: (val) => set({ isOverlay: val }),
  toggleOverlay: () => set((state) => ({ isOverlay: !state.isOverlay })),
  keyword: "",
  setKeyword: (val) => set({ keyword: val as string }),
}));
