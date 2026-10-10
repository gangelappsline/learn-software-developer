import { useLoaderData, Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Sparkles } from 'lucide-react';
import { getMissions } from '@/services/missionsApi';
import { languages } from '@/data/languages';
import { useSessionStore } from '@/stores/sessionStore';
import { MissionCard } from '@/features/missions';
import { Badge, Button } from '@/components/ui';
import type { Mission } from '@/types';

export const loader = () => getMissions();

export default function LanguageDetailPage() {
  const { languageId } = useParams();
  const initialMissions = useLoaderData() as Mission[];
  const { data: missions = initialMissions } = useQuery({
    queryKey: ['missions'],
    queryFn: getMissions,
    initialData: initialMissions,
    staleTime: 60_000,
  });
  const language = languages.find((item) => item.id === languageId);
  const profile = useSessionStore((state) =>
    state.currentProfileId ? (state.profiles[state.currentProfileId] ?? null) : null,
  );
  if (!language)
    return (
      <div className="empty-state">
        <h2>Ruta no encontrada</h2>
        <Link to="/languages">Volver a lenguajes</Link>
      </div>
    );
  const eligibleMissions = missions.filter(
    (mission) =>
      mission.language === language.id &&
      (!profile || mission.ageGroups.includes(profile.ageGroup)),
  );
  const accessible = !profile || language.ageGroups.includes(profile.ageGroup);

  return (
    <div className="language-detail-page">
      <Link to="/languages" className="back-link">
        <ArrowLeft size={16} /> Todas las rutas
      </Link>
      <section className="language-detail-hero">
        <div className="language-detail-emoji" style={{ backgroundColor: `${language.color}25` }}>
          {language.emoji}
        </div>
        <div className="language-detail-copy">
          <span className="section-kicker">{language.track}</span>
          <h2>{language.name}</h2>
          <p>
            {language.tagline} {language.description}
          </p>
          <div className="language-focus-list">
            {language.focus.map((focus) => (
              <Badge key={focus} tone="purple">
                {focus}
              </Badge>
            ))}
          </div>
        </div>
        <div className="language-detail-stat">
          <span>
            <BookOpen size={17} /> {eligibleMissions.length} misiones
          </span>
          <span>
            <Clock3 size={17} /> 5–30 minutos
          </span>
          <span>
            <Sparkles size={17} /> XP y CodeCoins
          </span>
        </div>
      </section>
      {!accessible && (
        <div className="age-route-note">
          <span>🌱</span>
          <p>
            Esta ruta está pensada para una edad diferente. Puedes probarla si tienes curiosidad,
            pero aquí priorizamos los retos recomendados para ti.
          </p>
        </div>
      )}
      <div className="section-heading">
        <div>
          <span className="section-kicker">EMPIEZA POR AQUÍ</span>
          <h2>Misiones de {language.name}</h2>
        </div>
        <Link to={`/missions?language=${language.id}`} className="text-link">
          Ver en el mapa <ArrowRight size={15} />
        </Link>
      </div>
      <div className="mission-grid">
        {eligibleMissions.map((mission, index) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            completed={Boolean(profile?.completedMissions.includes(mission.id))}
            index={index}
          />
        ))}
      </div>
      {!eligibleMissions.length && (
        <div className="empty-state">
          <span>🪴</span>
          <h3>Esta ruta sigue creciendo</h3>
          <p>Pronto habrá más misiones para este nivel.</p>
          <Button variant="secondary" onClick={() => window.history.back()} type="button">
            Volver
          </Button>
        </div>
      )}
    </div>
  );
}
