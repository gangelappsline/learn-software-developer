import { motion } from 'motion/react';
import { Award, LockKeyhole, Sparkles, Trophy } from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { badges } from '@/data/badges';
import { BadgeGrid } from '@/components/gamification';
import { Card } from '@/components/ui';

export default function AchievementsPage() {
  const profile = useSessionStore((state) =>
    state.currentProfileId ? (state.profiles[state.currentProfileId] ?? null) : null,
  );
  const unlocked = profile?.badges ?? [];
  const percent = Math.round((unlocked.length / badges.length) * 100);
  return (
    <div className="achievements-page">
      <section className="page-intro achievements-intro">
        <div>
          <div className="intro-icon intro-icon-gold">
            <Trophy size={20} />
          </div>
          <span className="section-kicker">TUS MOMENTOS ÉPICOS</span>
          <h2>Cada paso merece una insignia</h2>
          <p>
            Las insignias celebran lo que vas aprendiendo. No hace falta desbloquearlas todas para
            ser un gran creador.
          </p>
        </div>
        <div className="achievement-trophy-art" aria-hidden="true">
          🏆<span>✦</span>
        </div>
      </section>
      <div className="achievement-summary-grid">
        <Card className="achievement-summary-card">
          <span className="summary-icon summary-icon-purple">
            <Award size={19} />
          </span>
          <div>
            <strong>
              {unlocked.length} <small>/ {badges.length}</small>
            </strong>
            <span>insignias desbloqueadas</span>
          </div>
          <div className="achievement-summary-track">
            <span style={{ width: `${percent}%` }} />
          </div>
        </Card>
        <Card className="achievement-summary-card">
          <span className="summary-icon summary-icon-mint">
            <Sparkles size={19} />
          </span>
          <div>
            <strong>{profile?.completedMissions.length ?? 0}</strong>
            <span>misiones superadas</span>
          </div>
          <p>¡Sigue construyendo tu colección!</p>
        </Card>
        <Card className="achievement-summary-card">
          <span className="summary-icon summary-icon-orange">🔥</span>
          <div>
            <strong>{profile?.streak ?? 0}</strong>
            <span>días de racha</span>
          </div>
          <p>La constancia se ve diferente para cada persona.</p>
        </Card>
      </div>
      <div className="section-heading achievement-heading">
        <div>
          <span className="section-kicker">TU COLECCIÓN</span>
          <h2>Insignias de CodeQuest</h2>
        </div>
        <span className="achievement-private">
          <LockKeyhole size={14} /> Solo visibles en este perfil
        </span>
      </div>
      <div className="achievement-grid">
        {badges.map((badge, index) => {
          const earned = unlocked.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.045 }}
            >
              <Card
                className={`achievement-card ${earned ? 'achievement-earned' : 'achievement-locked'}`}
              >
                <div className="achievement-medal">
                  {earned ? badge.emoji : badge.secret ? '✨' : '🔒'}
                </div>
                <div className="achievement-card-copy">
                  <span className="section-kicker">
                    {earned ? 'DESBLOQUEADA' : badge.secret ? 'SECRETO' : 'PRÓXIMO RETO'}
                  </span>
                  <h3>{earned || !badge.secret ? badge.name : 'Una insignia misteriosa'}</h3>
                  <p>
                    {earned
                      ? badge.description
                      : badge.secret
                        ? 'Algunas sorpresas aparecen cuando menos las esperas.'
                        : badge.rule}
                  </p>
                </div>
                {earned && <span className="achievement-check">✓</span>}
              </Card>
            </motion.div>
          );
        })}
      </div>
      <section className="badge-mini-section">
        <h3>Resumen de tu colección</h3>
        <BadgeGrid unlocked={unlocked} compact limit={4} />
      </section>
    </div>
  );
}
