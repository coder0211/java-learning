import { create } from "zustand";

interface IGlobalToggleState {
  onExpand: boolean;
  onTranscriptEditMode: boolean;

  setOnExpand: (onExpand: boolean) => void;
  setOnTranscriptEditMode: (onEditMode: boolean) => void;
}

export const useGlobalToggleState = create<IGlobalToggleState>((set) => ({
  onExpand: false,
  onTranscriptEditMode: false,

  setOnExpand: (onExpand: boolean) => {
    set({ onExpand });
  },
  setOnTranscriptEditMode: (onEditMode: boolean) => {
    set({ onTranscriptEditMode: onEditMode });
  },
}));
