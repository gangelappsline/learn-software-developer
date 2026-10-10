import { useSessionStore } from '@/stores/sessionStore';

export function useSessionGuard() {
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const currentProfile = useSessionStore((state) =>
    state.currentProfileId ? (state.profiles[state.currentProfileId] ?? null) : null,
  );
  const hasProfiles = useSessionStore((state) => Object.keys(state.profiles).length > 0);
  const ready = hasHydrated;
  const hasSession = ready && Boolean(currentProfile);
  return {
    ready,
    hasSession,
    requiresOnboarding: ready && !hasSession,
    hasProfiles,
    profile: currentProfile,
  };
}
