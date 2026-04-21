import { create } from "zustand";

interface ScrollStore {
  scrollProgress: number;
  setScrollProgress: (v: number) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (v) => set({ scrollProgress: v }),
}));
