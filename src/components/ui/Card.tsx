import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false, ...props }: CardProps) {
  return (
    <div
      className={`surface-card ${hoverable ? 'surface-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
