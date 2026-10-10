import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'purple' | 'mint' | 'orange' | 'pink';
  className?: string;
}

export function Badge({ children, tone = 'neutral', className = '' }: BadgeProps) {
  return <span className={`pill pill-${tone} ${className}`}>{children}</span>;
}
