import { motion } from 'motion/react';
import { badges } from '@/data/badges';
import { Card } from '@/components/ui';

interface BadgeGridProps {
  unlocked: string[];
  compact?: boolean;
  limit?: number;
}

export function BadgeGrid({ unlocked, compact = false, limit }: BadgeGridProps) {
  const orderedBadges = [...badges].sort(
    (a, b) => Number(unlocked.includes(b.id)) - Number(unlocked.includes(a.id)),
  );
  const visible = limit ? orderedBadges.slice(0, limit) : orderedBadges;
  return (
    <div className={`badge-grid ${compact ? 'badge-grid-compact' : ''}`}>
      {visible.map((badge, index) => {
        const earned = unlocked.includes(badge.id);
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <Card className={`badge-card ${earned ? 'badge-earned' : 'badge-locked'}`}>
              <span className="badge-emoji" aria-hidden="true">
                {earned ? badge.emoji : '🔒'}
              </span>
              <span className="badge-copy">
                <strong>{earned ? badge.name : badge.secret ? 'Secreto' : badge.name}</strong>
                <small>
                  {earned
                    ? badge.description
                    : badge.secret
                      ? 'Hay algo por descubrir…'
                      : badge.rule}
                </small>
              </span>
              {earned && (
                <span className="badge-check" aria-label="Desbloqueada">
                  ✓
                </span>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
