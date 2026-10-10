import { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  ChevronRight,
  Clock3,
  Coins,
  Lightbulb,
  LockKeyhole,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMission } from '@/services/missionsApi';
import { runMission } from '@/features/missions/missionRunner';
import { useSessionStore } from '@/stores/sessionStore';
import { useXP } from '@/hooks/useXP';
import { languages } from '@/data/languages';
import { DIFFICULTIES, VALUE_TAGS } from '@/lib/constants';
import { formatDuration } from '@/lib/formatters';
import { Badge, Button, Card } from '@/components/ui';
import { CodePlayground, OutputConsole } from '@/components/editor';
import type { Mission, MissionRun } from '@/types';

export async function loader({ params }: LoaderFunctionArgs): Promise<Mission> {
  const mission = await getMission(params.missionId ?? '');
  if (!mission)
    throw new Response('No encontramos esta misión.', {
      status: 404,
      statusText: 'Misión no encontrada',
    });
  return mission;
}

export default function MissionDetailPage() {
  const loadedMission = useLoaderData() as Mission;
  const profileId = useSessionStore((state) => state.currentProfileId);
  return (
    <MissionDetailContent
      key={`${profileId ?? 'guest'}:${loadedMission.id}`}
      loadedMission={loadedMission}
    />
  );
}

function MissionDetailContent({ loadedMission }: { loadedMission: Mission }) {
  const { data: mission = loadedMission } = useQuery({
    queryKey: ['mission', loadedMission.id],
    queryFn: () => getMission(loadedMission.id),
    initialData: loadedMission,
    staleTime: 60_000,
  });
  const navigate = useNavigate();
  const profile = useSessionStore((state) =>
    state.currentProfileId ? (state.profiles[state.currentProfileId] ?? null) : null,
  );
  const updateMissionDraft = useSessionStore((state) => state.updateMissionDraft);
  const unlockHint = useSessionStore((state) => state.unlockHint);
  const { awardMission } = useXP();
  const [code, setCode] = useState(profile?.missionDrafts[mission.id] ?? mission.starterCode);
  const [run, setRun] = useState<MissionRun | null>(null);
  const [completedNow, setCompletedNow] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const alreadyComplete = Boolean(profile?.completedMissions.includes(mission.id)) || completedNow;
  const language = languages.find((item) => item.id === mission.language)!;
  const difficulty = DIFFICULTIES[mission.difficulty];
  const unlockedHints = profile?.usedHints ?? [];
  const nextHintIndex = mission.hints.findIndex(
    (_, index) => !unlockedHints.includes(`${mission.id}:${index}`),
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => updateMissionDraft(mission.id, code), 350);
    return () => window.clearTimeout(timeout);
  }, [code, mission.id, updateMissionDraft]);

  const executeTests = () => {
    const result = runMission(mission, code);
    setRun(result);
    if (result.success && !alreadyComplete) {
      const award = awardMission(mission);
      if (award) {
        setCompletedNow(true);
        setShowSolution(false);
      }
    }
  };

  const revealNextHint = () => {
    if (nextHintIndex < 0) {
      toast.info('Ya tienes todas las pistas de esta misión.');
      return;
    }
    if (!unlockHint(mission.id, nextHintIndex, 5)) {
      toast.error('Te faltan CodeCoins para esa pista.', {
        description: 'Puedes conseguir monedas completando otra misión.',
      });
      return;
    }
    toast.success('Pista desbloqueada', { description: 'No hay prisa: prueba una idea a la vez.' });
  };

  const resetCode = () => {
    setCode(mission.starterCode);
    setRun(null);
    setShowSolution(false);
    toast('Código reiniciado', { description: 'Tu borrador vuelve a empezar desde la plantilla.' });
  };

  const valueLabels = mission.values.map(
    (value) => VALUE_TAGS.find((tag) => tag.id === value)?.label ?? value,
  );

  return (
    <div className="mission-detail-page">
      <div className="mission-detail-breadcrumb">
        <button type="button" className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Volver al mapa
        </button>
        <ChevronRight size={14} />
        <span>{language.name}</span>
        <ChevronRight size={14} />
        <span className="breadcrumb-current">Misión</span>
      </div>
      <section className="mission-detail-header">
        <div className="mission-detail-heading-row">
          <span
            className="detail-language-icon"
            style={{ color: language.color, backgroundColor: `${language.color}1a` }}
          >
            {language.emoji}
          </span>
          <div>
            <div className="mission-meta-line">
              <span>{language.name}</span>
              <span className={`difficulty-label ${difficulty.className}`}>
                {difficulty.emoji} {difficulty.label}
              </span>
              <span className="mission-meta-dot">·</span>
              <span>{formatDuration(mission.estimatedMinutes)}</span>
            </div>
            <h2>{mission.title}</h2>
          </div>
          {alreadyComplete && <Badge tone="mint">✓ Completada</Badge>}
        </div>
        <p>{mission.description}</p>
        <div className="mission-detail-tags">
          <Badge tone="purple">{mission.topic}</Badge>
          {valueLabels.map((value) => (
            <Badge key={value} tone="mint">
              {value}
            </Badge>
          ))}
          <span className="age-recommendation">Para {mission.ageGroups.join(' · ')}</span>
        </div>
      </section>

      <div className="mission-workspace-grid">
        <div className="mission-workspace-main">
          <Card className="mission-challenge-card">
            <div className="challenge-title">
              <span>
                <WandSparkles size={18} />
              </span>
              <div>
                <small>EL RETO</small>
                <h3>Tu misión</h3>
              </div>
            </div>
            <p>{mission.challenge}</p>
            <div className="challenge-rewards">
              <span>
                <Sparkles size={15} /> {mission.xpReward} XP
              </span>
              <span>
                <Coins size={15} /> {mission.coinReward} CodeCoins
              </span>
              <span>
                <Clock3 size={15} /> {formatDuration(mission.estimatedMinutes)}
              </span>
            </div>
          </Card>
          <CodePlayground
            mission={mission}
            value={code}
            onChange={setCode}
            onRun={executeTests}
            onReset={resetCode}
            isComplete={alreadyComplete}
          />
          <OutputConsole run={run} />
          {run?.success && (
            <motion.div
              className="mission-complete-banner"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
            >
              <span className="complete-banner-emoji">🎉</span>
              <div>
                <strong>{completedNow ? '¡Reto superado!' : '¡Lo hiciste!'}</strong>
                <p>
                  {completedNow
                    ? 'Tu esfuerzo se convirtió en experiencia y una misión más en tu mapa.'
                    : 'Esta misión ya forma parte de tus logros. Sigue practicando o continúa con otra aventura.'}
                </p>
              </div>
              {mission.solution && (
                <Button
                  variant="soft"
                  size="sm"
                  onClick={() => setShowSolution((value) => !value)}
                  type="button"
                >
                  {showSolution ? 'Ocultar ejemplo' : 'Ver otro ejemplo'}
                </Button>
              )}
            </motion.div>
          )}
          {showSolution && (
            <Card className="solution-card">
              <div>
                <BookOpenCheck size={17} />
                <strong>Una solución posible</strong>
              </div>
              <pre>
                <code>{mission.solution}</code>
              </pre>
              <p>Hay muchas formas de programar una idea. Compara y descubre qué cambia.</p>
            </Card>
          )}
        </div>

        <aside className="mission-workspace-aside">
          <Card className="hint-card">
            <div className="aside-card-heading">
              <span className="hint-icon">
                <Lightbulb size={18} />
              </span>
              <div>
                <strong>Pistas pequeñas</strong>
                <small>Sin presión, a tu ritmo</small>
              </div>
            </div>
            <p>Si te atascas, desbloquea una pista. Cada una cuesta 5 CodeCoins.</p>
            <div className="hint-list">
              {mission.hints.map((hint, index) => {
                const isUnlocked = unlockedHints.includes(`${mission.id}:${index}`);
                return (
                  <div
                    className={`hint-row ${isUnlocked ? 'hint-unlocked' : ''}`}
                    key={`${mission.id}-hint-${index}`}
                  >
                    <span className="hint-number">
                      {isUnlocked ? <Lightbulb size={13} /> : <LockKeyhole size={12} />}
                    </span>
                    <span>{isUnlocked ? hint : `Pista ${index + 1}`}</span>
                  </div>
                );
              })}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="hint-unlock-button"
              icon={<LockKeyhole size={14} />}
              onClick={revealNextHint}
              disabled={nextHintIndex < 0}
              type="button"
            >
              {nextHintIndex < 0 ? 'Todas desbloqueadas' : `Desbloquear pista · 5 coins`}
            </Button>
            <span className="hint-balance">Tienes {profile?.coins ?? 0} CodeCoins</span>
          </Card>
          <Card className="mission-about-card">
            <div className="aside-card-heading">
              <span className="about-icon">📚</span>
              <div>
                <strong>Lo que practicarás</strong>
                <small>Una herramienta para tu caja</small>
              </div>
            </div>
            <ul>
              <li>
                <span>Lenguaje</span>
                <strong>{language.name}</strong>
              </li>
              <li>
                <span>Concepto</span>
                <strong>{mission.topic}</strong>
              </li>
              <li>
                <span>Duración</span>
                <strong>{formatDuration(mission.estimatedMinutes)}</strong>
              </li>
              <li>
                <span>Recompensa</span>
                <strong>+{mission.xpReward} XP</strong>
              </li>
            </ul>
          </Card>
          <Card className="kind-reminder-card">
            <span>💜</span>
            <div>
              <strong>Equivocarse es parte del plan.</strong>
              <p>Tu borrador se guarda automáticamente en este perfil.</p>
            </div>
          </Card>
          <Link to="/missions" className="next-mission-link">
            Ver más misiones <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
