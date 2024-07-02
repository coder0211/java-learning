import { create } from "zustand";

interface IUpdateProjectModal {
  id: string | undefined;
  name: string | undefined;
  isOpen: boolean;
  open: (id: string, name: string) => void;
  close: () => void;
}

export const useUpdateProjectModal = create<IUpdateProjectModal>((set) => ({
  id: undefined,
  name: undefined,
  isOpen: false,
  open: (id: string, name: string) => {
    set({ id, name, isOpen: true });
  },
  close: () => {
    set({ id: undefined, name: undefined, isOpen: false });
  },
}));
