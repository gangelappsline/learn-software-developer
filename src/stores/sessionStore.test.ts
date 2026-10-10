import { beforeEach, describe, expect, it } from 'vitest';
import { useSessionStore } from './sessionStore';
import type { Mission } from '@/types';

const sampleMission: Mission = {
  id: 'test-first-loop',
  title: 'Primer bucle',
  description: 'Prueba de store',
  challenge: 'Completa una prueba.',
  language: 'javascript',
  difficulty: 'easy',
  ageGroups: ['9-11'],
  values: ['logica'],
  topic: 'Bucles',
  xpReward: 80,
  coinReward: 12,
  estimatedMinutes: 5,
  starterCode: '',
  solution: '',
  tests: [],
  hints: [],
  validationMode: 'tokens',
};

beforeEach(() => {
  localStorage.clear();
  useSessionStore.setState({ profiles: {}, currentProfileId: null, hasHydrated: true });
});

describe('sessionStore', () => {
  it('creates an age-adapted profile and makes it active', () => {
    const id = useSessionStore
      .getState()
      .createProfile({ name: 'Lucía', age: 13, referralSource: 'Colegio', avatar: '🦊' });
    const state = useSessionStore.getState();
    expect(state.currentProfileId).toBe(id);
    expect(state.profiles[id]?.ageGroup).toBe('12-14');
    expect(state.profiles[id]?.coins).toBe(30);
  });

  it('awards XP only once and unlocks the first badge', () => {
    useSessionStore
      .getState()
      .createProfile({ name: 'Noa', age: 10, referralSource: 'Profesor', avatar: '🐼' });
    const firstAward = useSessionStore.getState().completeMission(sampleMission);
    const duplicateAward = useSessionStore.getState().completeMission(sampleMission);
    const profileId = useSessionStore.getState().currentProfileId!;
    const profile = useSessionStore.getState().profiles[profileId]!;
    expect(firstAward?.xpEarned).toBe(80);
    expect(firstAward?.unlockedBadgeIds).toContain('first-step');
    expect(duplicateAward).toBeNull();
    expect(profile.xp).toBe(80);
    expect(profile.completedMissions).toEqual([sampleMission.id]);
  });

  it('keeps sibling progress on separate profiles', () => {
    const first = useSessionStore
      .getState()
      .createProfile({ name: 'Alex', age: 8, referralSource: 'Colegio', avatar: '🐸' });
    const second = useSessionStore.getState().createProfile({
      name: 'Sam',
      age: 15,
      referralSource: 'Otro',
      referralOther: 'Una feria',
      avatar: '🤖',
    });
    useSessionStore.getState().selectProfile(first);
    useSessionStore.getState().completeMission(sampleMission);
    const state = useSessionStore.getState();
    expect(state.profiles[first]?.xp).toBeGreaterThan(0);
    expect(state.profiles[second]?.xp).toBe(0);
  });
});
