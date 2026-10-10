import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UIState {
  soundEnabled: boolean;
  dyslexiaFont: boolean;
  isMobileNavOpen: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setDyslexiaFont: (enabled: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      soundEnabled: false,
      dyslexiaFont: false,
      isMobileNavOpen: false,
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setDyslexiaFont: (dyslexiaFont) => set({ dyslexiaFont }),
      setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
    }),
    {
      name: 'codequest-ui-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        dyslexiaFont: state.dyslexiaFont,
      }),
    },
  ),
);
