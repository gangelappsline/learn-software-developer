import scratch from './scratch.json';
import blockly from './blockly.json';
import python from './python.json';
import javascript from './javascript.json';
import htmlcss from './htmlcss.json';
import typescript from './typescript.json';
import sql from './sql.json';
import rust from './rust.json';
import kotlin from './kotlin.json';
import go from './go.json';
import type { Mission } from '@/types';

export const missionSeed = [
  ...scratch,
  ...blockly,
  ...python,
  ...javascript,
  ...htmlcss,
  ...typescript,
  ...sql,
  ...rust,
  ...kotlin,
  ...go,
] as Mission[];

export const getMissionById = (missionId: string): Mission | undefined =>
  missionSeed.find((mission) => mission.id === missionId);
