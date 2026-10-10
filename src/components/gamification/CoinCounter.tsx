import { Coins } from 'lucide-react';

interface CoinCounterProps {
  coins: number;
  compact?: boolean;
}

export function CoinCounter({ coins, compact = false }: CoinCounterProps) {
  return (
    <div
      className={`coin-counter ${compact ? 'coin-counter-compact' : ''}`}
      aria-label={`${coins} CodeCoins`}
    >
      <span className="coin-icon">
        <Coins size={18} aria-hidden="true" />
      </span>
      <strong>{coins}</strong>
      <span className="coin-label">Coins</span>
    </div>
  );
}
