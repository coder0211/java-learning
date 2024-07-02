import { create } from "zustand";

interface IMediaPlayerRender {
  currentTime: number;
  duration: number;

  setCurrentTime: (currentTime: number) => void;
  setDuration: (duration: number) => void;
}

export const useMediaPlayerRender = create<IMediaPlayerRender>((set) => ({
  currentTime: 0,
  duration: 0,

  setCurrentTime: (currentTime: number) => {
    set({ currentTime });
  },
  setDuration: (duration: number) => {
    set({ duration });
  },
}));
