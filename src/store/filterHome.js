import create from 'zustand';

export const useFilterHome = create((set) => ({
  filterHome: null,
  setFilterHome: (filter) => set((state) => ({ ...state, filterHome: filter })),
}));

export const useFilterTersimpan = create((set) => ({
  filterTersimpan: null,
  setFilterTersimpan: (filter) =>
    set((state) => ({ ...state, filterTersimpan: filter })),
}));
