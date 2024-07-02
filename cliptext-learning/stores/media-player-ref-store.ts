import { create } from "zustand";

interface IMediaPlayerRef {
  objectUrl?: string;
  duration: number;
  mediaRefCurrent?: HTMLVideoElement;

  setObjectUrl: (objectUrl?: string) => void;
  setDuration: (duration: number) => void;
  setMediaRefCurrent: (mediaRefCurrent?: HTMLVideoElement) => void;
  clear: () => void;
}

export const useMediaPlayerRef = create<IMediaPlayerRef>((set) => ({
  objectUrl: undefined,
  duration: 0,
  mediaRefCurrent: undefined,

  setObjectUrl: (objectUrl?: string) => {
    set({ objectUrl });
  },
  setDuration: (duration: number) => {
    set({ duration });
  },
  setMediaRefCurrent: (mediaRefCurrent?: HTMLVideoElement) => {
    set({ mediaRefCurrent });
  },
  clear: () => {
    set({
      objectUrl: undefined,
      duration: 0,
      mediaRefCurrent: undefined,
    });
  },
}));
