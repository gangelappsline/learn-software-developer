import { useLoaderData, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';
import { getMissions } from '@/services/missionsApi';
import { languages } from '@/data/languages';
import { useSessionStore } from '@/stores/sessionStore';
import { AGE_GROUPS } from '@/lib/constants';
import { Badge, Card } from '@/components/ui';
import type { Mission } from '@/types';

export const loader = () => getMissions();

export default function LanguagesPage() {
  const initialMissions = useLoaderData() as Mission[];
  const { data: missions = initialMissions } = useQuery({
    queryKey: ['missions'],
    queryFn: getMissions,
    initialData: initialMissions,
    staleTime: 60_000,
  });
  const profile = useSessionStore((state) =>
    state.currentProfileId ? (state.profiles[state.currentProfileId] ?? null) : null,
  );
  const ageGroup = profile?.ageGroup;
  const currentLabel = AGE_GROUPS.find((group) => group.id === ageGroup)?.label;

  return (
    <div className="languages-page">
      <section className="page-intro languages-intro">
        <div>
          <div className="intro-icon intro-icon-purple">
            <Sparkles size={20} />
          </div>
          <span className="section-kicker">HERRAMIENTAS DE CREADOR</span>
          <h2>Encuentra tu lenguaje</h2>
          <p>Empieza con bloques visuales o escribe código real. Cada ruta crece contigo.</p>
        </div>
        <div className="language-orbit-art" aria-hidden="true">
          <span>🐍</span>
          <i>✦</i>
          <b>⌘</b>
        </div>
      </section>
      <div className="age-route-note">
        <span>✨</span>
        <p>
          Tu ruta se adapta a <strong>{currentLabel ?? 'tu edad'}</strong>. Puedes curiosear otros
          lenguajes y volver a ellos cuando estés listo.
        </p>
      </div>
      <div className="language-grid">
        {languages.map((language, index) => {
          const available = !ageGroup || language.ageGroups.includes(ageGroup);
          const total = missions.filter(
            (mission) =>
              mission.language === language.id &&
              (!ageGroup || mission.ageGroups.includes(ageGroup)),
          ).length;
          const done = missions.filter(
            (mission) =>
              mission.language === language.id && profile?.completedMissions.includes(mission.id),
          ).length;
          return (
            <motion.div
              key={language.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
            >
              <Card className={`language-route-card ${!available ? 'language-route-locked' : ''}`}>
                <div className="language-card-heading">
                  <span
                    className="language-large-icon"
                    style={{ backgroundColor: `${language.color}20` }}
                  >
                    {language.emoji}
                  </span>
                  <span className="language-card-count">{total} retos</span>
                </div>
                <span className="language-track-label">{language.track}</span>
                <h3>{language.name}</h3>
                <p>{language.description}</p>
                <div className="language-focus-list">
                  {language.focus.map((focus) => (
                    <Badge key={focus} tone="neutral">
                      {focus}
                    </Badge>
                  ))}
                </div>
                <div className="language-card-footer">
                  {available ? (
                    <>
                      <span>
                        {done}/{total} retos completados
                      </span>
                      <Link className="text-link" to={`/missions?language=${language.id}`}>
                        Explorar <ArrowRight size={14} />
                      </Link>
                    </>
                  ) : (
                    <>
                      <span>
                        <LockKeyhole size={14} /> Para{' '}
                        {language.ageGroups
                          .map((group) => AGE_GROUPS.find((item) => item.id === group)?.label)
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                      <span className="language-future">
                        Te espera más adelante <span>✦</span>
                      </span>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
