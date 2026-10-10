import { CheckCircle2, Circle, Terminal } from 'lucide-react';
import type { MissionRun } from '@/types';

interface OutputConsoleProps {
  run: MissionRun | null;
  compact?: boolean;
}

export function OutputConsole({ run, compact = false }: OutputConsoleProps) {
  return (
    <section
      className={`output-console ${compact ? 'output-console-compact' : ''}`}
      aria-live="polite"
      aria-label="Resultado de las pruebas"
    >
      <div className="console-heading">
        <span>
          <Terminal size={15} /> Consola de pruebas
        </span>
        {run && (
          <span className={run.success ? 'console-status success' : 'console-status'}>
            {run.success ? 'Todas listas' : 'En progreso'}
          </span>
        )}
      </div>
      {!run ? (
        <p className="console-empty">Ejecuta las pruebas para ver qué tal va tu código.</p>
      ) : (
        <>
          <p className={`console-output ${run.success ? 'console-output-success' : ''}`}>
            {run.output}
          </p>
          <ul className="test-list">
            {run.results.map((result, index) => (
              <li
                key={`${result.label}-${index}`}
                className={result.passed ? 'test-passed' : 'test-pending'}
              >
                {result.passed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                <span>
                  <strong>{result.label}</strong>
                  <small>{result.detail}</small>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
