import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useProgressStore } from '@/stores/progressStore';
import { useSessionStore } from '@/stores/sessionStore';
import type { Mission } from '@/types';

export function useFilters(missions: Mission[]) {
  const filters = useProgressStore((state) => state.filters);
  const profile = useSessionStore((state) =>
    state.currentProfileId ? (state.profiles[state.currentProfileId] ?? null) : null,
  );
  const actions = useProgressStore(
    useShallow((state) => ({
      setLanguage: state.setLanguage,
      setAgeGroup: state.setAgeGroup,
      setDifficulty: state.setDifficulty,
      setValue: state.setValue,
      setDuration: state.setDuration,
      setSearch: state.setSearch,
      resetFilters: state.resetFilters,
    })),
  );

  const filteredMissions = useMemo(() => {
    const ageGroup = filters.ageGroup === 'all' ? profile?.ageGroup : filters.ageGroup;
    const query = filters.search.trim().toLocaleLowerCase('es');
    return missions.filter((mission) => {
      if (ageGroup && !mission.ageGroups.includes(ageGroup)) return false;
      if (filters.language !== 'all' && mission.language !== filters.language) return false;
      if (filters.difficulty !== 'all' && mission.difficulty !== filters.difficulty) return false;
      if (filters.value !== 'all' && !mission.values.includes(filters.value)) return false;
      if (filters.duration === 'quick' && mission.estimatedMinutes > 5) return false;
      if (
        filters.duration === 'medium' &&
        (mission.estimatedMinutes <= 5 || mission.estimatedMinutes > 15)
      )
        return false;
      if (filters.duration === 'long' && mission.estimatedMinutes <= 15) return false;
      if (
        query &&
        !`${mission.title} ${mission.description} ${mission.topic} ${mission.language}`
          .toLocaleLowerCase('es')
          .includes(query)
      )
        return false;
      return true;
    });
  }, [filters, missions, profile?.ageGroup]);

  const activeCount =
    Number(filters.language !== 'all') +
    Number(filters.ageGroup !== 'all') +
    Number(filters.difficulty !== 'all') +
    Number(filters.value !== 'all') +
    Number(filters.duration !== 'all') +
    Number(Boolean(filters.search));
  return { filters, filteredMissions, activeCount, ...actions };
}
