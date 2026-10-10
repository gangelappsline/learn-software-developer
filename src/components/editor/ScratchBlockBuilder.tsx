import { motion } from 'motion/react';
import { Blocks, Check, Plus, Trash2 } from 'lucide-react';
import type { DragEvent } from 'react';
import type { Mission } from '@/types';

interface ScratchBlockBuilderProps {
  mission: Mission;
  value: string;
  onChange: (value: string) => void;
}

function blockTone(text: string): string {
  const phrase = text.toLocaleLowerCase('es');
  if (phrase.includes('presionar')) return 'scratch-event';
  if (phrase.includes('repetir')) return 'scratch-control';
  if (phrase.includes('mover') || phrase.includes('girar') || phrase.includes('tamaño'))
    return 'scratch-motion';
  return 'scratch-look';
}

export function ScratchBlockBuilder({ mission, value, onChange }: ScratchBlockBuilderProps) {
  const startBlock = mission.starterCode.split('\n')[0]?.trim();
  const placed = mission.tests
    .filter((test) => test.input !== startBlock && value.includes(test.input))
    .sort((first, second) => value.indexOf(first.input) - value.indexOf(second.input));
  const addBlock = (block: string) => {
    if (value.includes(block)) return;
    onChange(`${value.trimEnd()}\n${block}`.trim());
  };
  const removeBlock = (block: string) => {
    onChange(
      value
        .replace(block, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim(),
    );
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const block = event.dataTransfer.getData('text/plain');
    if (mission.tests.some((test) => test.input === block)) addBlock(block);
  };
  return (
    <div className="scratch-builder" aria-label="Constructor de bloques de Scratch">
      <div className="scratch-builder-header">
        <span>
          <Blocks size={16} /> Constructor visual de bloques
        </span>
        <small>Arrastra o pulsa para añadir</small>
      </div>
      <div className="scratch-builder-layout">
        <div
          className="scratch-workspace"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          aria-label="Área de programación. Suelta los bloques aquí."
        >
          <span className="scratch-workspace-label">MI PROGRAMA</span>
          {startBlock && (
            <div className="scratch-start-block">
              <span>✦</span>
              {startBlock}
            </div>
          )}
          {placed.length ? (
            <div className="scratch-placed-list">
              {placed.map((test, index) => (
                <motion.button
                  key={test.input}
                  type="button"
                  className={`scratch-block ${blockTone(test.input)}`}
                  initial={{ opacity: 0, x: -8, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => removeBlock(test.input)}
                  aria-label={`Quitar bloque: ${test.input}`}
                  title="Pulsa para quitar este bloque"
                >
                  <span className="scratch-block-grip">⠿</span>
                  <span>{test.input}</span>
                  <Trash2 size={13} />
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="scratch-drop-hint">
              <span>🧩</span>
              <strong>Tu programa empieza aquí</strong>
              <small>Añade un bloque desde la caja de herramientas.</small>
            </div>
          )}
          <div className="scratch-workspace-check">
            <Check size={12} /> Los bloques se unen en orden
          </div>
        </div>
        <div className="scratch-toolbox">
          <span className="scratch-toolbox-label">CAJA DE BLOQUES</span>
          {mission.tests.map((test) => {
            const isPlaced = value.includes(test.input);
            return (
              <button
                key={test.input}
                type="button"
                className={`scratch-tool ${blockTone(test.input)} ${isPlaced ? 'scratch-tool-used' : ''}`}
                draggable={!isPlaced}
                onDragStart={(event) => event.dataTransfer.setData('text/plain', test.input)}
                onClick={() => addBlock(test.input)}
                disabled={isPlaced}
                title={isPlaced ? 'Este bloque ya está en tu programa' : 'Añadir bloque'}
              >
                <span className="scratch-tool-icon">
                  {isPlaced ? <Check size={13} /> : <Plus size={13} />}
                </span>
                <span>{test.expected}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="scratch-builder-note">
        Pista visual: cada bloque representa una instrucción. Pulsa un bloque de tu programa para
        quitarlo y probar otro orden.
      </p>
    </div>
  );
}
