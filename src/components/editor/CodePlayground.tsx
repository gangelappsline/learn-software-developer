import { RotateCcw, Sparkles, Play } from 'lucide-react';
import { LANGUAGE_LABELS } from '@/lib/constants';
import type { Mission } from '@/types';
import { Button } from '@/components/ui';
import { ScratchBlockBuilder } from './ScratchBlockBuilder';
import { CodeMirrorWrapper } from './CodeMirrorWrapper';

interface CodePlaygroundProps {
  mission: Mission;
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  isComplete: boolean;
}

export function CodePlayground({
  mission,
  value,
  onChange,
  onRun,
  onReset,
  isComplete,
}: CodePlaygroundProps) {
  return (
    <section className="playground-card" aria-label="Editor de código">
      <div className="playground-topline">
        <div className="editor-file">
          <span className="file-dot" />
          <span>
            {mission.id}.
            {mission.language === 'htmlcss'
              ? 'html'
              : mission.language === 'scratch'
                ? 'blocks'
                : mission.language === 'python'
                  ? 'py'
                  : mission.language === 'rust'
                    ? 'rs'
                    : mission.language === 'go'
                      ? 'go'
                      : mission.language === 'kotlin'
                        ? 'kt'
                        : mission.language === 'sql'
                          ? 'sql'
                          : mission.language === 'typescript'
                            ? 'ts'
                            : 'js'}
          </span>
        </div>
        <span className="editor-language">{LANGUAGE_LABELS[mission.language]}</span>
      </div>
      {mission.language === 'scratch' ? (
        <ScratchBlockBuilder mission={mission} value={value} onChange={onChange} />
      ) : (
        <CodeMirrorWrapper language={mission.language} value={value} onChange={onChange} />
      )}
      <div className="playground-footer">
        <span className="saved-label">
          <span className="saved-dot" /> Guardado en este perfil
        </span>
        <div className="editor-actions">
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={15} />}
            onClick={onReset}
            type="button"
          >
            Reiniciar
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={isComplete ? <Sparkles size={16} /> : <Play size={16} fill="currentColor" />}
            onClick={onRun}
            type="button"
          >
            {isComplete ? 'Ver pruebas' : 'Ejecutar pruebas'}
          </Button>
        </div>
      </div>
    </section>
  );
}
