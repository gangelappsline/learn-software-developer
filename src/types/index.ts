export type AgeGroup = '6-8' | '9-11' | '12-14' | '15-17';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'epic';
export type LanguageId =
  | 'scratch'
  | 'blockly'
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'htmlcss'
  | 'sql'
  | 'rust'
  | 'kotlin'
  | 'go';
export type ValueTag =
  | 'creatividad'
  | 'logica'
  | 'colaboracion'
  | 'perseverancia'
  | 'etica'
  | 'critico'
  | 'inclusion'
  | 'sostenibilidad';
export type ReferralSource =
  | 'Colegio'
  | 'Redes sociales'
  | 'Amigo o familiar'
  | 'YouTube'
  | 'Búsqueda Google'
  | 'Profesor'
  | 'Otro';
export type ValidationMode = 'tokens' | 'runtime' | 'markup';

export interface MissionTest {
  /** En modo runtime se interpreta como JSON de entrada; en modo tokens es el fragmento requerido. */
  input: string;
  /** Resultado esperado o descripción visible de la comprobación. */
  expected: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  challenge: string;
  language: LanguageId;
  difficulty: Difficulty;
  ageGroups: AgeGroup[];
  values: ValueTag[];
  topic: string;
  xpReward: number;
  coinReward: number;
  estimatedMinutes: number;
  starterCode: string;
  solution: string;
  tests: MissionTest[];
  hints: string[];
  validationMode: ValidationMode;
  entryPoint?: string;
}

export interface LanguageDefinition {
  id: LanguageId;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  ageGroups: AgeGroup[];
  track: string;
  focus: string[];
  color: string;
  missions: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  referralSource: ReferralSource;
  referralOther?: string;
  avatar: string;
  createdAt: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActive: string;
  badges: string[];
  completedMissions: string[];
  preferredLanguages: LanguageId[];
  completedLanguages: LanguageId[];
  missionDrafts: Record<string, string>;
  usedHints: string[];
  tourCompleted: boolean;
}

export interface MissionFilters {
  language: LanguageId | 'all';
  ageGroup: AgeGroup | 'all';
  difficulty: Difficulty | 'all';
  value: ValueTag | 'all';
  duration: 'all' | 'quick' | 'medium' | 'long';
  search: string;
}

export interface TestResult {
  label: string;
  passed: boolean;
  detail: string;
}

export interface MissionRun {
  results: TestResult[];
  output: string;
  success: boolean;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rule: string;
  secret?: boolean;
}
