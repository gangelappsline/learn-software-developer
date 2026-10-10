import { describe, expect, it } from 'vitest';
import { getMissionById } from '@/data/missions';
import { runMission } from './missionRunner';

describe('mission runner', () => {
  it('runs JavaScript input/output tests', () => {
    const mission = getMissionById('js-doble-puntos');
    expect(mission).toBeDefined();
    const result = runMission(mission!, 'function sumarPuntos(puntos) { return puntos + 10; }');
    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(3);
  });

  it('keeps visual Scratch blocks in the intended sequence', () => {
    const mission = getMissionById('scratch-lazo-bailarin');
    expect(mission).toBeDefined();
    const inOrder = runMission(mission!, mission!.tests.map((test) => test.input).join('\n'));
    const reversed = runMission(
      mission!,
      [...mission!.tests]
        .reverse()
        .map((test) => test.input)
        .join('\n'),
    );
    expect(inOrder.success).toBe(true);
    expect(reversed.success).toBe(false);
  });

  it('gives actionable feedback when a required fragment is missing', () => {
    const mission = getMissionById('python-turtle-constelacion');
    expect(mission).toBeDefined();
    const result = runMission(mission!, 'import turtle\nprint("hola")');
    expect(result.success).toBe(false);
    expect(result.output).toContain('0 de 3');
  });
});
