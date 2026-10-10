import { create } from 'zustand';
import type { MissionAward } from './sessionStore';

interface GamificationState {
  lastAward: (MissionAward & { id: number }) | null;
  setLastAward: (award: MissionAward | null) => void;
  clearAward: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  lastAward: null,
  setLastAward: (award) => set({ lastAward: award ? { ...award, id: Date.now() } : null }),
  clearAward: () => set({ lastAward: null }),
}));
