import { create } from "zustand";

interface LoadingState {
  loading: boolean;
  progress: number;
  start: () => void;
  finish: () => void;
  increment: () => void;
}

let timer: NodeJS.Timeout | null = null;

export const useLoadingStore = create<LoadingState>((set, get) => ({
  loading: false,
  progress: 0,

  start: () => {
    if (get().loading) return;

    set({ loading: true, progress: 10 });

    timer = setInterval(() => {
      const current = get().progress;
      if (current < 90) {
        set({ progress: current + Math.random() * 10 });
      }
    }, 300);
  },
  finish: () => {
    if (!get().loading) return;

    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    set({ progress: 100 });

    setTimeout(() => {
      set({ loading: false, progress: 0 });
    }, 300);
  },

  increment: () =>
    set((state) => ({
      progress: Math.min(state.progress + 10, 90),
    })),
}));
