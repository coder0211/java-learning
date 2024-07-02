import { create } from "zustand";

interface IDeleteProjectModal {
  id: string | undefined;
  name: string | undefined;
  isOpen: boolean;
  open: (id: string, name: string) => void;
  close: () => void;
}

export const useDeleteProjectModal = create<IDeleteProjectModal>((set) => ({
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
