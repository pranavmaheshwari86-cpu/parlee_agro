import { create } from 'zustand';

export type PreloadState = 'not_loaded' | 'preloading' | 'loaded';

interface VideoPreloadStore {
  states: Record<number, PreloadState>;
  visibleIndex: number | null;
  setVisibleIndex: (index: number) => void;
  setPreloadState: (index: number, state: PreloadState) => void;
}

export const useVideoPreloadStore = create<VideoPreloadStore>((set) => ({
  states: {},
  visibleIndex: null,
  setVisibleIndex: (index) => set({ visibleIndex: index }),
  setPreloadState: (index, state) => set((prev) => ({ 
    states: { ...prev.states, [index]: state } 
  })),
}));
