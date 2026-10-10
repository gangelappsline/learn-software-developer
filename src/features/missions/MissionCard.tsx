import { motion } from 'motion/react';
import { ArrowUpRight, Check, Clock3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui';
import { languages } from '@/data/languages';
import { DIFFICULTIES, VALUE_TAGS } from '@/lib/constants';
import { fadeUpVariants } from '@/lib/animations';
import { formatDuration } from '@/lib/formatters';
import type { Mission } from '@/types';

interface MissionCardProps {
  mission: Mission;
  completed?: boolean;
  index?: number;
  compact?: boolean;
}

export function MissionCard({
  mission,
  completed = false,
  index = 0,
  compact = false,
}: MissionCardProps) {
  const language = languages.find((item) => item.id === mission.language)!;
  const difficulty = DIFFICULTIES[mission.difficulty];
  return (
    <motion.article
      className={`mission-card ${compact ? 'mission-card-compact' : ''}`}
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={{ delay: Math.min(index * 0.045, 0.3) }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/missions/${mission.id}`}
        className="mission-card-link"
        aria-label={`${mission.title}, ${language.name}, ${mission.xpReward} XP`}
      >
        <div className="mission-card-top">
          <span
            className="mission-language-icon"
            style={{ color: language.color, backgroundColor: `${language.color}18` }}
            aria-hidden="true"
          >
            {language.emoji}
          </span>
          <div className="mission-card-meta">
            <span>{language.name}</span>
            <span className={`difficulty-label ${difficulty.className}`}>
              {difficulty.emoji} {difficulty.label}
            </span>
          </div>
          {completed && (
            <span className="completed-mark" title="Misión completada">
              <Check size={15} />
            </span>
          )}
        </div>
        <h3>{mission.title}</h3>
        <p className="mission-card-description">{mission.description}</p>
        <div className="mission-card-tags">
          <Badge tone="purple">{mission.topic}</Badge>
          {mission.values.slice(0, 1).map((value) => (
            <Badge key={value} tone="mint">
              {VALUE_TAGS.find((tag) => tag.id === value)?.label ?? value}
            </Badge>
          ))}
        </div>
        <div className="mission-card-bottom">
          <span>
            <Clock3 size={14} /> {formatDuration(mission.estimatedMinutes)}
          </span>
          <span className="mission-reward">
            <Sparkles size={14} /> {mission.xpReward} XP
          </span>
          <span className="mission-open-icon">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
