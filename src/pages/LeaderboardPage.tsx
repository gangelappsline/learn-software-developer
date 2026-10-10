import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, HeartHandshake, LockKeyhole, Medal, Trophy } from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { Card } from '@/components/ui';

export default function LeaderboardPage() {
  const [showSample, setShowSample] = useState(false);
  const profile = useSessionStore((state) =>
    state.currentProfileId ? (state.profiles[state.currentProfileId] ?? null) : null,
  );
  const entries = [
    {
      name: profile?.name ?? 'Tú',
      avatar: profile?.avatar ?? '🦊',
      xp: profile?.xp ?? 0,
      isYou: true,
    },
    { name: 'Alex', avatar: '🦋', xp: 540, isYou: false },
    { name: 'Sam', avatar: '🐙', xp: 420, isYou: false },
    { name: 'Noa', avatar: '🤖', xp: 310, isYou: false },
  ].sort((a, b) => b.xp - a.xp);
  const yourRank = entries.findIndex((entry) => entry.isYou) + 1;
  return (
    <div className="leaderboard-page">
      <section className="page-intro leaderboard-intro">
        <div>
          <div className="intro-icon intro-icon-gold">
            <Trophy size={20} />
          </div>
          <span className="section-kicker">JUNTOS ES MÁS DIVERTIDO</span>
          <h2>Un desafío amable</h2>
          <p>
            Comparte ideas, celebra el progreso de los demás y aprende en equipo. Sin presión, sin
            vidas que perder.
          </p>
        </div>
        <div className="leaderboard-art" aria-hidden="true">
          🏅<span>✦</span>
        </div>
      </section>
      <Card className="leaderboard-privacy-note">
        <span className="privacy-shield">
          <LockKeyhole size={20} />
        </span>
        <div>
          <strong>Tu progreso es privado por defecto</strong>
          <p>
            La clasificación global está desactivada. La vista de ejemplo de abajo usa nombres
            ficticios y no comparte ningún dato.
          </p>
        </div>
        <span className="leaderboard-lock-label">
          <EyeOff size={14} /> Privado
        </span>
      </Card>
      <div className="leaderboard-layout">
        <section className="leaderboard-main">
          <div className="section-heading">
            <div>
              <span className="section-kicker">DESAFÍO SEMANAL · SOLO DE MUESTRA</span>
              <h2>Exploradores de la semana</h2>
            </div>
            <button
              className={`leaderboard-toggle ${showSample ? 'toggle-on' : ''}`}
              type="button"
              onClick={() => setShowSample((value) => !value)}
              aria-pressed={showSample}
            >
              {showSample ? <Eye size={15} /> : <EyeOff size={15} />}
              {showSample ? 'Ver ejemplo' : 'Mostrar ejemplo'}
            </button>
          </div>
          {showSample ? (
            <div className="leaderboard-list">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.name}
                  className={`leaderboard-entry ${entry.isYou ? 'leaderboard-entry-you' : ''}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07 }}
                >
                  <span className={`leaderboard-rank rank-${index + 1}`}>
                    {index === 0 ? '🏆' : String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="leaderboard-avatar">{entry.avatar}</span>
                  <span className="leaderboard-player">
                    <strong>
                      {entry.name}
                      {entry.isYou && <small> · tú</small>}
                    </strong>
                    <small>{entry.isYou ? 'Tu progreso local' : 'Perfil de ejemplo'}</small>
                  </span>
                  <span className="leaderboard-xp">
                    {entry.xp} <small>XP</small>
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="leaderboard-hidden-state">
              <div className="hidden-state-icon">
                <HeartHandshake size={26} />
              </div>
              <h3>Aprender no es una carrera</h3>
              <p>
                La comparación está apagada. Celebra tus propias metas o invita a tu aula a resolver
                un reto cooperativo.
              </p>
              <button type="button" className="text-link" onClick={() => setShowSample(true)}>
                Ver clasificación ficticia de ejemplo <Eye size={15} />
              </button>
            </Card>
          )}
        </section>
        <aside className="leaderboard-side">
          <Card className="your-rank-card">
            <div className="rank-card-icon">
              <Medal size={18} />
            </div>
            <span className="section-kicker">TU AVANCE</span>
            <strong>{showSample ? `#${yourRank}` : 'A tu ritmo'}</strong>
            <p>
              {showSample
                ? 'Posición ilustrativa en la lista de muestra.'
                : 'Cada misión que completas es una victoria propia.'}
            </p>
          </Card>
          <Card className="weekly-challenge-card">
            <span className="weekly-challenge-emoji">🌱</span>
            <span className="section-kicker">RETO COOPERATIVO</span>
            <h3>Una idea puede crecer en equipo.</h3>
            <p>Resuelve una misión con alguien y compartan lo que cada uno descubrió.</p>
            <span className="weekly-tag">Sin puntuaciones públicas</span>
          </Card>
        </aside>
      </div>
    </div>
  );
}
