import { create } from 'zustand';
import type { Difficulty, LanguageId, MissionFilters, ValueTag } from '@/types';

interface ProgressState {
  filters: MissionFilters;
  setLanguage: (language: LanguageId | 'all') => void;
  setAgeGroup: (ageGroup: MissionFilters['ageGroup']) => void;
  setDifficulty: (difficulty: Difficulty | 'all') => void;
  setValue: (value: ValueTag | 'all') => void;
  setDuration: (duration: MissionFilters['duration']) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

const initialFilters: MissionFilters = {
  language: 'all',
  ageGroup: 'all',
  difficulty: 'all',
  value: 'all',
  duration: 'all',
  search: '',
};

export const useProgressStore = create<ProgressState>((set) => ({
  filters: initialFilters,
  setLanguage: (language) => set((state) => ({ filters: { ...state.filters, language } })),
  setAgeGroup: (ageGroup) => set((state) => ({ filters: { ...state.filters, ageGroup } })),
  setDifficulty: (difficulty) => set((state) => ({ filters: { ...state.filters, difficulty } })),
  setValue: (value) => set((state) => ({ filters: { ...state.filters, value } })),
  setDuration: (duration) => set((state) => ({ filters: { ...state.filters, duration } })),
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  resetFilters: () => set({ filters: initialFilters }),
}));
