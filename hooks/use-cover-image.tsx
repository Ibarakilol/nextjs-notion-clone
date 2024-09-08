import { create } from 'zustand';

type CoverImageStore = {
  isOpen: boolean;
  url?: string;
  onClose: () => void;
  onOpen: () => void;
  onReplace: (url: string) => void;
};

export const useCoverImage = create<CoverImageStore>((set) => ({
  isOpen: false,
  url: undefined,
  onClose: () => set({ isOpen: false, url: undefined }),
  onOpen: () => set({ isOpen: true, url: undefined }),
  onReplace: (url: string) => set({ isOpen: true, url }),
}));
