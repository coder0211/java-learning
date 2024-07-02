import { create } from "zustand";

interface IWordRefsModel {
  wordRefs?: HTMLSpanElement[];
  setMediaRefCurrent: (wordRefs?: HTMLSpanElement[]) => void;
}

export const useWordRefs = create<IWordRefsModel>((set) => ({
  wordRefs: undefined,
  setMediaRefCurrent: (wordRefs?: HTMLSpanElement[]) => {
    set({ wordRefs });
  },
}));
