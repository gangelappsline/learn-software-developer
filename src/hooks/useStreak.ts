import { useSessionStore } from '@/stores/sessionStore';

export function useStreak() {
  const streak = useSessionStore((state) => {
    const profileId = state.currentProfileId;
    return profileId ? (state.profiles[profileId]?.streak ?? 0) : 0;
  });
  return { streak, multiplier: 1 + Math.min(Math.max(streak - 1, 0), 7) * 0.05 };
}
