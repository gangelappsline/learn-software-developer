interface ProgressProps {
  value: number;
  label?: string;
  showValue?: boolean;
  tone?: 'purple' | 'mint' | 'orange';
  size?: 'sm' | 'md';
}

export function Progress({
  value,
  label,
  showValue = false,
  tone = 'purple',
  size = 'md',
}: ProgressProps) {
  const safeValue = Math.max(0, Math.min(value, 100));
  return (
    <div className="progress-wrap">
      {(label || showValue) && (
        <div className="progress-meta">
          <span>{label}</span>
          {showValue && <span>{Math.round(safeValue)}%</span>}
        </div>
      )}
      <div
        className={`progress-track progress-${size}`}
        role="progressbar"
        aria-label={label ?? 'Progreso'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(safeValue)}
      >
        <div className={`progress-fill progress-${tone}`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
