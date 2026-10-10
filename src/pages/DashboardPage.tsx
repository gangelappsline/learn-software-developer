import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLoaderData, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, CirclePlay, Zap } from 'lucide-react';
import { getMissions } from '@/services/missionsApi';
import { useSessionStore } from '@/stores/sessionStore';
import { getLevelProgress } from '@/lib/formatters';
import { AGE_GROUPS, XP_PER_LEVEL } from '@/lib/constants';
import { languages } from '@/data/languages';
import { Badge, Card, Progress } from '@/components/ui';
import { Footer } from '@/components/layout/Footer';
import { BadgeGrid } from '@/components/gamification';
import { MissionCard } from '@/features/missions';
import type { Mission } from '@/types';

export const loader = () => getMissions();

export default function DashboardPage() {
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
  const addBadge = useSessionStore((state) => state.addBadge);
  const completed = profile?.completedMissions ?? [];
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const progress = getLevelProgress(xp);
  const ageGroup = profile?.ageGroup;
  const ageLabel = AGE_GROUPS.find((age) => age.id === ageGroup)?.label ?? 'tu nivel';
  const eligibleMissions = missions.filter(
    (mission) => !ageGroup || mission.ageGroups.includes(ageGroup),
  );
  const recommended = eligibleMissions
    .filter((mission) => !completed.includes(mission.id))
    .sort(
      (a, b) =>
        Number(profile?.preferredLanguages.includes(b.language) ?? false) -
        Number(profile?.preferredLanguages.includes(a.language) ?? false),
    )
    .slice(0, 3);
  const date = new Date();
  const dailyIndex = (date.getDate() + date.getMonth()) % Math.max(eligibleMissions.length, 1);
  const dailyMission = eligibleMissions[dailyIndex];
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);
  const firstMonday = new Date(2020, 0, 6);
  const weekIndex = Math.floor((weekStart.getTime() - firstMonday.getTime()) / (7 * 86_400_000));
  const weeklyMission = eligibleMissions[weekIndex % Math.max(eligibleMissions.length, 1)];
  const dailyDone = Boolean(dailyMission && completed.includes(dailyMission.id));
  const discoverSecret = () => {
    if (!profile?.badges.includes('night-owl')) {
      addBadge('night-owl');
      toast.success('¡Encontraste un secreto!', {
        description: 'Tu compañero de aventuras tenía una sorpresa para ti.',
      });
    }
  };
  const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const weekdayIndex = (date.getDay() + 6) % 7;
  const activeDays = Math.min(profile?.streak ?? 0, weekdayIndex + 1);
  const streakStart = weekdayIndex - activeDays + 1;
  const paths = languages
    .filter((language) => !ageGroup || language.ageGroups.includes(ageGroup))
    .slice(0, 5);
  const greeting =
    new Date().getHours() < 12
      ? '¡Buenos días'
      : new Date().getHours() < 19
        ? '¡Buenas tardes'
        : '¡Buenas noches';

  return (
    <div className="dashboard-page">
      <section className="welcome-row">
        <div>
          <p className="welcome-eyebrow">
            {greeting}, {profile?.name ?? 'explorador'} <span>✦</span>
          </p>
          <h2>¿Qué vas a crear hoy?</h2>
          <p className="welcome-subtitle">
            Tienes un mundo de ideas por programar. Vamos a por una más.
          </p>
        </div>
        <div className="daily-chip">
          <span className="daily-sun">☀️</span>
          <span>
            <small>TU NIVEL</small>
            <strong>{ageLabel}</strong>
          </span>
        </div>
      </section>

      <motion.section
        className="quest-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="quest-hero-content">
          <Badge tone="mint">✦ TU PRÓXIMO GRAN PASO</Badge>
          <h2>
            Pequeñas ideas.
            <br />
            <span>Grandes aventuras.</span>
          </h2>
          <p>Aprende a programar creando cosas que solo a ti se te ocurrirían.</p>
          <div className="quest-hero-actions">
            <Link className="button button-primary button-lg" to="/missions">
              <span>Explorar misiones</span>
              <ArrowRight size={17} />
            </Link>
            <span className="quest-time-note">
              <CirclePlay size={15} /> Retos desde 5 minutos
            </span>
          </div>
        </div>
        <div className="quest-illustration">
          <div className="planet planet-big" aria-hidden="true">
            🪐
          </div>
          <div className="planet planet-small" aria-hidden="true">
            ✦
          </div>
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="rocket-emoji" aria-hidden="true">
            🚀
          </div>
          <button
            className="hero-mascot"
            type="button"
            onClick={discoverSecret}
            aria-label="Saluda a tu compañero de aventuras"
          >
            {profile?.avatar ?? '🦊'}
          </button>
          <div className="hero-spark spark-one" aria-hidden="true">
            ✦
          </div>
          <div className="hero-spark spark-two" aria-hidden="true">
            ✧
          </div>
          <div className="hero-label" aria-hidden="true">
            ¡Despega!
          </div>
        </div>
        <div className="hero-decor hero-decor-one" />
        <div className="hero-decor hero-decor-two" />
      </motion.section>

      <section className="dashboard-stats" aria-label="Tu progreso">
        <Card className="stat-card stat-xp">
          <div className="stat-icon xp-stat-icon">
            <Zap size={19} fill="currentColor" />
          </div>
          <div className="stat-copy">
            <span>Experiencia</span>
            <strong>
              {xp.toLocaleString('es')} <small>XP</small>
            </strong>
          </div>
          <div className="stat-foot">
            {progress.current} / {XP_PER_LEVEL} para nivel {level + 1}
          </div>
          <Progress value={progress.percent} tone="purple" size="sm" label="Progreso de nivel" />
        </Card>
        <Card className="stat-card">
          <div className="stat-icon streak-stat-icon">🔥</div>
          <div className="stat-copy">
            <span>Racha actual</span>
            <strong>
              {profile?.streak ?? 0} <small>{(profile?.streak ?? 0) === 1 ? 'día' : 'días'}</small>
            </strong>
          </div>
          <div className="stat-foot">Un ratito cada día suma.</div>
          <div className="streak-week-dots" aria-label="Racha semanal">
            {weekdays.map((day, index) => (
              <span
                key={day}
                className={
                  index === weekdayIndex
                    ? 'dot-today'
                    : index >= streakStart && index < weekdayIndex
                      ? 'dot-done'
                      : ''
                }
              >
                {day}
              </span>
            ))}
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon coin-stat-icon">🪙</div>
          <div className="stat-copy">
            <span>Tus CodeCoins</span>
            <strong>
              {profile?.coins ?? 30} <small>coins</small>
            </strong>
          </div>
          <div className="stat-foot">Gana más al completar misiones.</div>
          <div className="coin-progress-note">
            <span>✨</span> ¡Puedes usarlas en pistas!
          </div>
        </Card>
      </section>

      <section className="level-progress-card">
        <div className="level-avatar">{profile?.avatar ?? '🦊'}</div>
        <div className="level-progress-copy">
          <strong>
            Nivel {level} · {profile?.name ?? 'Tu perfil'}
          </strong>
          <span>Vas por buen camino. Cada reto cuenta.</span>
        </div>
        <div className="level-progress-track">
          <Progress
            value={progress.percent}
            label={`${progress.current} de ${progress.next} XP para el siguiente nivel`}
            showValue
            tone="mint"
          />
        </div>
        <div className="next-level">
          <span>PRÓXIMO</span>
          <strong>{level + 1}</strong>
        </div>
      </section>

      {dailyMission && (
        <section className="daily-quest-card">
          <div className="daily-quest-icon">{dailyDone ? '✅' : '☀️'}</div>
          <div className="daily-quest-copy">
            <span className="section-kicker">
              RETO DIARIO · {dailyDone ? 'COMPLETADO' : 'UN RETO CORTITO'}
            </span>
            <strong>{dailyMission.title}</strong>
            <p>{dailyMission.description}</p>
          </div>
          <div className="daily-quest-progress">
            <Progress value={dailyDone ? 100 : 0} label="Tu reto de hoy" tone="orange" size="sm" />
            <small>{dailyDone ? '¡Lo lograste!' : `+${dailyMission.xpReward} XP`}</small>
          </div>
          <Link
            className="daily-quest-link"
            to={`/missions/${dailyMission.id}`}
            aria-label={`${dailyDone ? 'Volver a practicar' : 'Empezar'}: ${dailyMission.title}`}
          >
            <ArrowRight size={17} />
          </Link>
        </section>
      )}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="section-kicker">HECHAS PARA TI</span>
            <h2>
              Tu siguiente misión <span>✦</span>
            </h2>
            <p>Pequeños retos que te ayudan a subir de nivel.</p>
          </div>
          <Link to="/missions" className="text-link">
            Ver todas <ChevronRight size={16} />
          </Link>
        </div>
        {recommended.length ? (
          <div className="mission-grid dashboard-mission-grid">
            {recommended.map((mission, index) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                completed={completed.includes(mission.id)}
                index={index}
                compact
              />
            ))}
          </div>
        ) : (
          <Card className="all-done-card">
            <span>🎉</span>
            <div>
              <strong>¡Has completado todas las misiones de tu nivel!</strong>
              <p>Prueba otro lenguaje o vuelve más tarde para seguir explorando.</p>
            </div>
            <Link to="/languages" className="text-link">
              Explorar lenguajes <ArrowRight size={15} />
            </Link>
          </Card>
        )}
      </section>

      <div className="dashboard-bottom-grid">
        <section className="section-block language-shortlist">
          <div className="section-heading">
            <div>
              <span className="section-kicker">ELIGE TU HERRAMIENTA</span>
              <h2>Rutas de código</h2>
            </div>
            <Link to="/languages" className="text-link">
              Ver rutas <ChevronRight size={16} />
            </Link>
          </div>
          <div className="language-mini-grid">
            {paths.map((language, index) => (
              <motion.div
                key={language.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/languages/${language.id}`} className="language-mini-card">
                  <span
                    className="language-mini-emoji"
                    style={{ backgroundColor: `${language.color}1a` }}
                  >
                    {language.emoji}
                  </span>
                  <span>
                    <strong>{language.name}</strong>
                    <small>{language.track}</small>
                  </span>
                  <ChevronRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="section-block badge-shortlist">
          <div className="section-heading">
            <div>
              <span className="section-kicker">COLECCIONABLES</span>
              <h2>Próximas insignias</h2>
            </div>
            <Link to="/achievements" className="text-link">
              Ver todas <ChevronRight size={16} />
            </Link>
          </div>
          <BadgeGrid unlocked={profile?.badges ?? []} compact limit={3} />
        </section>
      </div>

      <section className="co-op-banner">
        <div className="co-op-icon">🤝</div>
        <div>
          <strong>¡Programar también es compartir!</strong>
          <p>
            {weeklyMission ? (
              <>
                Reto de esta semana: <b>{weeklyMission.title}</b>. Puedes invitar a alguien a
                resolverlo contigo.
              </>
            ) : (
              'La misión semanal cambia cada lunes. Invita a alguien a resolverla contigo.'
            )}
          </p>
        </div>
        <Link
          to={weeklyMission ? `/missions/${weeklyMission.id}` : '/missions'}
          className="text-link"
        >
          Abrir reto <ArrowRight size={15} />
        </Link>
        <div className="co-op-sparkle">✦</div>
      </section>
      <Footer completedCount={completed.length} />
    </div>
  );
}
