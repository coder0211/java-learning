import { create } from "zustand";

interface IGlobalSearch {
  searchValue?: string;
  searchType?: string;

  setSearchValue: (searchValue?: string) => void;
  setSearchType: (searchType?: string) => void;
}

export const useGlobalSearch = create<IGlobalSearch>((set) => ({
  setSearchValue: (searchValue?: string) => {
    set({ searchValue });
  },
  setSearchType: (searchType?: string) => {
    set({ searchType });
  },
}));
