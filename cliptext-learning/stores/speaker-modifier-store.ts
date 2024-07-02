import { create } from "zustand";

interface ISpeakerModifierModel {
  currentSpeaker?: string;
  currentSpeakerElement?: HTMLParagraphElement;

  setCurrentSpeaker: (currentSpeaker?: string) => void;
  setCurrentSpeakerElement: (
    currentSpeakerElement?: HTMLParagraphElement
  ) => void;
}

export const useSpeakerModifier = create<ISpeakerModifierModel>((set) => ({
  setCurrentSpeaker: (currentSpeaker?: string) => {
    set({ currentSpeaker });
  },
  setCurrentSpeakerElement: (currentSpeakerElement?: HTMLParagraphElement) => {
    set({ currentSpeakerElement });
  },
}));
