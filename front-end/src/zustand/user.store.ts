import { UserProperties } from "@/types/user.type";
import { create } from "zustand";

interface UserState {
  user: UserProperties | null;
  setUser: (user: UserProperties | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
