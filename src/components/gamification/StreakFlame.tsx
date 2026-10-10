import { Flame } from 'lucide-react';

interface StreakFlameProps {
  streak: number;
  compact?: boolean;
}

export function StreakFlame({ streak, compact = false }: StreakFlameProps) {
  return (
    <div
      className={`streak-display ${compact ? 'streak-compact' : ''}`}
      aria-label={`Racha de ${streak} días`}
    >
      <span className="streak-icon">
        <Flame size={compact ? 17 : 21} fill="currentColor" aria-hidden="true" />
      </span>
      <span className="streak-count">
        {streak}
        <small>{compact ? '' : ` ${streak === 1 ? 'día' : 'días'}`}</small>
      </span>
    </div>
  );
}
