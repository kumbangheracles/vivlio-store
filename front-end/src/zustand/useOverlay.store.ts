import { create } from "zustand";

interface OverlayState {
  isOverlay: boolean;
  setIsOverlay: (val: boolean) => void;
  toggleOverlay: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  isOverlay: false,
  setIsOverlay: (val) => set({ isOverlay: val }),
  toggleOverlay: () => set((state) => ({ isOverlay: !state.isOverlay })),
}));
