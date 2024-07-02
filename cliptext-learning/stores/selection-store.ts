import { Word } from "@/types/transcript-types";
import { create } from "zustand";

interface ISelectionModel {
  selectionRect?: DOMRect;
  selectionMenuVisible: boolean;
  selectionWords?: Word[];
  setSelectionRect: (selectionRect: any) => void;
  setSelectionMenuVisible: (selectionMenuVisible: boolean) => void;
  setSelectionWords: (selectionWords?: Word[]) => void;
}

export const useSelection = create<ISelectionModel>((set) => ({
  selectionRect: undefined,
  selectionMenuVisible: false,
  selectionWords: undefined,
  setSelectionRect: (selectionRect?: DOMRect) => {
    set({ selectionRect });
  },
  setSelectionMenuVisible: (selectionMenuVisible: boolean) => {
    set({ selectionMenuVisible });
  },
  setSelectionWords: (selectionWords?: Word[]) => {
    set({ selectionWords });
  },
}));
