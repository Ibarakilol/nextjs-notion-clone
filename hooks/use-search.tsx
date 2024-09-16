import { create } from 'zustand';

type SearchStore = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  toggle: () => void;
};

export const useSearch = create<SearchStore>((set, get) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
  toggle: () => set({ isOpen: !get().isOpen }),
}));
