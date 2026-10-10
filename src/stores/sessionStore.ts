import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AGE_GROUPS, XP_PER_LEVEL } from '@/lib/constants';
import type { LanguageId, Mission, ReferralSource, UserProfile } from '@/types';

interface CreateProfileInput {
  name: string;
  age: number;
  referralSource: ReferralSource;
  referralOther?: string;
  avatar: string;
}

export interface MissionAward {
  xpEarned: number;
  coinsEarned: number;
  streak: number;
  levelUp: boolean;
  unlockedBadgeIds: string[];
}

interface SessionState {
  profiles: Record<string, UserProfile>;
  currentProfileId: string | null;
  hasHydrated: boolean;
  createProfile: (input: CreateProfileInput) => string;
  selectProfile: (profileId: string) => void;
  signOut: () => void;
  setHasHydrated: (hydrated: boolean) => void;
  setTourCompleted: (completed?: boolean) => void;
  updateMissionDraft: (missionId: string, code: string) => void;
  unlockHint: (missionId: string, hintIndex: number, cost?: number) => boolean;
  completeMission: (mission: Mission) => MissionAward | null;
  addBadge: (badgeId: string) => void;
  setAvatar: (avatar: string) => void;
  setPreferredLanguage: (languageId: LanguageId) => void;
}

const dateKey = (date: Date): string => date.toISOString().slice(0, 10);

function getNextStreak(profile: UserProfile, today: string): number {
  const previousDay = dateKey(new Date(new Date(`${today}T00:00:00.000Z`).getTime() - 86_400_000));
  if (profile.lastActive.slice(0, 10) === today) return Math.max(1, profile.streak);
  if (profile.lastActive.slice(0, 10) === previousDay) return profile.streak + 1;
  return 1;
}

function findNewBadges(profile: UserProfile): string[] {
  const completed = profile.completedMissions.length;
  const candidates: string[] = [];
  if (completed >= 1) candidates.push('first-step');
  if (completed >= 3) candidates.push('loop-legend');
  if (profile.streak >= 7) candidates.push('week-streak');
  if (profile.completedLanguages.length >= 3) candidates.push('curious-mind');
  if (completed >= 10) candidates.push('helper');
  if (completed >= 20) candidates.push('quest-master');
  return candidates.filter((badgeId) => !profile.badges.includes(badgeId));
}

const createProfileId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      profiles: {},
      currentProfileId: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      createProfile: (input) => {
        const id = createProfileId();
        const now = new Date().toISOString();
        const ageGroup =
          AGE_GROUPS.find((group) => input.age >= group.min && input.age <= group.max)?.id ??
          '9-11';
        const profile: UserProfile = {
          id,
          name: input.name.trim(),
          age: input.age,
          ageGroup,
          referralSource: input.referralSource,
          ...(input.referralOther ? { referralOther: input.referralOther.trim() } : {}),
          avatar: input.avatar,
          createdAt: now,
          xp: 0,
          level: 1,
          coins: 30,
          streak: 0,
          lastActive: now,
          badges: [],
          completedMissions: [],
          preferredLanguages: [],
          completedLanguages: [],
          missionDrafts: {},
          usedHints: [],
          tourCompleted: false,
        };
        set((state) => ({
          profiles: { ...state.profiles, [id]: profile },
          currentProfileId: id,
        }));
        return id;
      },
      selectProfile: (profileId) => {
        if (get().profiles[profileId]) set({ currentProfileId: profileId });
      },
      signOut: () => set({ currentProfileId: null }),
      setTourCompleted: (completed = true) => {
        const profileId = get().currentProfileId;
        if (!profileId) return;
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: { ...state.profiles[profileId]!, tourCompleted: completed },
          },
        }));
      },
      updateMissionDraft: (missionId, code) => {
        const profileId = get().currentProfileId;
        if (!profileId) return;
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: {
              ...state.profiles[profileId]!,
              missionDrafts: { ...state.profiles[profileId]!.missionDrafts, [missionId]: code },
            },
          },
        }));
      },
      unlockHint: (missionId, hintIndex, cost = 5) => {
        const profileId = get().currentProfileId;
        if (!profileId) return false;
        const profile = get().profiles[profileId];
        if (!profile) return false;
        const hintKey = `${missionId}:${hintIndex}`;
        if (profile.usedHints.includes(hintKey)) return true;
        if (profile.coins < cost) return false;
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: {
              ...state.profiles[profileId]!,
              coins: state.profiles[profileId]!.coins - cost,
              usedHints: [...state.profiles[profileId]!.usedHints, hintKey],
            },
          },
        }));
        return true;
      },
      completeMission: (mission) => {
        const profileId = get().currentProfileId;
        if (!profileId) return null;
        const current = get().profiles[profileId];
        if (!current || current.completedMissions.includes(mission.id)) return null;
        const now = new Date();
        const today = dateKey(now);
        const streak = getNextStreak(current, today);
        const multiplier = 1 + Math.min(Math.max(streak - 1, 0), 7) * 0.05;
        const xpEarned = Math.round(mission.xpReward * multiplier);
        const xp = current.xp + xpEarned;
        const completedLanguages = current.completedLanguages.includes(mission.language)
          ? current.completedLanguages
          : [...current.completedLanguages, mission.language];
        const updated: UserProfile = {
          ...current,
          xp,
          level: Math.floor(xp / XP_PER_LEVEL) + 1,
          coins: current.coins + mission.coinReward,
          streak,
          lastActive: now.toISOString(),
          completedMissions: [...current.completedMissions, mission.id],
          completedLanguages,
        };
        const unlockedBadgeIds = findNewBadges(updated);
        updated.badges = [...updated.badges, ...unlockedBadgeIds];
        set((state) => ({ profiles: { ...state.profiles, [profileId]: updated } }));
        return {
          xpEarned,
          coinsEarned: mission.coinReward,
          streak,
          levelUp: updated.level > current.level,
          unlockedBadgeIds,
        };
      },
      addBadge: (badgeId) => {
        const profileId = get().currentProfileId;
        if (!profileId || get().profiles[profileId]?.badges.includes(badgeId)) return;
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: {
              ...state.profiles[profileId]!,
              badges: [...state.profiles[profileId]!.badges, badgeId],
            },
          },
        }));
      },
      setAvatar: (avatar) => {
        const profileId = get().currentProfileId;
        if (!profileId) return;
        set((state) => ({
          profiles: { ...state.profiles, [profileId]: { ...state.profiles[profileId]!, avatar } },
        }));
      },
      setPreferredLanguage: (languageId) => {
        const profileId = get().currentProfileId;
        if (!profileId) return;
        set((state) => {
          const profile = state.profiles[profileId]!;
          const preferredLanguages = profile.preferredLanguages.includes(languageId)
            ? profile.preferredLanguages.filter((id) => id !== languageId)
            : [...profile.preferredLanguages, languageId];
          return {
            profiles: { ...state.profiles, [profileId]: { ...profile, preferredLanguages } },
          };
        });
      },
    }),
    {
      name: 'codequest-session-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profiles: state.profiles,
        currentProfileId: state.currentProfileId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const getActiveProfile = (): UserProfile | null => {
  const { currentProfileId, profiles } = useSessionStore.getState();
  return currentProfileId ? (profiles[currentProfileId] ?? null) : null;
};
