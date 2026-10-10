import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Compass, Sparkles } from 'lucide-react';
import { getMissions } from '@/services/missionsApi';
import { useFilters } from '@/hooks/useFilters';
import { useProgressStore } from '@/stores/progressStore';
import { useSessionStore } from '@/stores/sessionStore';
import { AGE_GROUPS } from '@/lib/constants';
import { MissionCard, MissionFilters } from '@/features/missions';
import { Card } from '@/components/ui';
import type { Mission } from '@/types';

export const loader = () => getMissions();

export default function MissionsPage() {
  const initialMissions = useLoaderData() as Mission[];
  const { data: missions = initialMissions, isPending } = useQuery({
    queryKey: ['missions'],
    queryFn: getMissions,
    initialData: initialMissions,
    staleTime: 60_000,
  });
  const {
    filters,
    filteredMissions,
    activeCount,
    setLanguage,
    setAgeGroup,
    setDifficulty,
    setValue,
    setDuration,
    setSearch,
    resetFilters,
  } = useFilters(missions);
  const profile = useSessionStore((state) =>
    state.currentProfileId ? (state.profiles[state.currentProfileId] ?? null) : null,
  );
  const setFilterLanguage = useProgressStore((state) => state.setLanguage);
  const groupLabel = AGE_GROUPS.find((group) => group.id === profile?.ageGroup)?.label;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const language = params.get('language');
    if (language && missions.some((mission) => mission.language === language)) {
      setFilterLanguage(language as Mission['language']);
    }
  }, [missions, setFilterLanguage]);

  return (
    <div className="missions-page">
      <section className="page-intro missions-intro">
        <div>
          <div className="intro-icon intro-icon-mint">
            <Compass size={20} />
          </div>
          <span className="section-kicker">TU MAPA DE AVENTURAS</span>
          <h2>Elige tu próximo reto</h2>
          <p>
            Prueba, equivócate, descubre. Cada misión es una idea nueva esperando a que la
            programes.
          </p>
        </div>
        <div className="intro-mascot">
          🧭<span>✦</span>
        </div>
      </section>
      <div className="mission-overview-row">
        <span>
          <strong>{filteredMissions.length}</strong>{' '}
          {filteredMissions.length === 1 ? 'misión disponible' : 'misiones disponibles'}
          {groupLabel && (
            <>
              {' '}
              para <b>{groupLabel}</b>
            </>
          )}
        </span>
        <span className="mission-overview-note">
          <Sparkles size={15} /> {profile?.completedMissions.length ?? 0} completadas
        </span>
      </div>
      <MissionFilters
        filters={filters}
        activeCount={activeCount}
        onLanguage={setLanguage}
        onAgeGroup={setAgeGroup}
        onDifficulty={setDifficulty}
        onValue={setValue}
        onDuration={setDuration}
        onSearch={setSearch}
        onReset={resetFilters}
      />
      {isPending ? (
        <div className="loading-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="loading-card" key={index} />
          ))}
        </div>
      ) : filteredMissions.length ? (
        <motion.div layout className="mission-grid mission-list-grid">
          {filteredMissions.map((mission, index) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              completed={Boolean(profile?.completedMissions.includes(mission.id))}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <Card className="empty-state">
          <span className="empty-state-emoji">🛸</span>
          <h3>No encontramos esa misión</h3>
          <p>
            Prueba con otros filtros o busca algo diferente. Siempre hay otra ruta por descubrir.
          </p>
          <button type="button" className="text-link" onClick={resetFilters}>
            Quitar filtros
          </button>
        </Card>
      )}
    </div>
  );
}
