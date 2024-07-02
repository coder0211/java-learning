import { UploadType } from "@/types/project-types";
import { create } from "zustand";

interface ICreateProjectModal {
  isOpen: boolean;
  isCreating: boolean;
  uploadType: UploadType;
  setOpen: (open: boolean) => void;
  setIsCreating: (creating: boolean) => void;
  setUploadType: (type: UploadType) => void;
}

export const useCreateProjectModal = create<ICreateProjectModal>((set) => {
  return {
    isOpen: false,
    isCreating: false,
    uploadType: UploadType.Local,
    setOpen: (open: boolean) => {
      set({ isOpen: open });
    },
    setIsCreating: (creating) => {
      set({ isCreating: creating });
    },
    setUploadType: (type: UploadType) => {
      set({ uploadType: type });
    },
  };
});

