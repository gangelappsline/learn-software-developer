import type { ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  return (
    <span className="tooltip-wrap" tabIndex={0} aria-label={text}>
      {children}
      <span className="tooltip-bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}
