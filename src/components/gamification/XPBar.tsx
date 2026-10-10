import { getLevelProgress } from '@/lib/formatters';
import { Progress } from '@/components/ui';

interface XPBarProps {
  xp: number;
  level: number;
  compact?: boolean;
}

export function XPBar({ xp, level, compact = false }: XPBarProps) {
  const progress = getLevelProgress(xp);
  return (
    <div className={`xp-bar ${compact ? 'xp-bar-compact' : ''}`}>
      <div className="xp-bar-heading">
        <span className="level-chip">NIVEL {level}</span>
        <span>
          {progress.current} / {progress.next} XP
        </span>
      </div>
      <Progress
        value={progress.percent}
        label="Progreso al siguiente nivel"
        tone="purple"
        size="sm"
      />
    </div>
  );
}
