import type { AgeGroup, Difficulty, LanguageId, ValueTag } from '@/types';

export const AVATARS = [
  '🦊',
  '🐼',
  '🐸',
  '🦄',
  '🤖',
  '👾',
  '🐙',
  '🐯',
  '🦖',
  '🐧',
  '🐝',
  '🦋',
] as const;

export const AGE_GROUPS: { id: AgeGroup; label: string; min: number; max: number }[] = [
  { id: '6-8', label: '6–8 años', min: 6, max: 8 },
  { id: '9-11', label: '9–11 años', min: 9, max: 11 },
  { id: '12-14', label: '12–14 años', min: 12, max: 14 },
  { id: '15-17', label: '15–17 años', min: 15, max: 17 },
];

export const DIFFICULTIES: Record<Difficulty, { label: string; emoji: string; className: string }> =
  {
    easy: { label: 'Fácil', emoji: '🟢', className: 'difficulty-easy' },
    medium: { label: 'Medio', emoji: '🟡', className: 'difficulty-medium' },
    hard: { label: 'Difícil', emoji: '🔴', className: 'difficulty-hard' },
    epic: { label: 'Épico', emoji: '🟣', className: 'difficulty-epic' },
  };

export const VALUE_TAGS: { id: ValueTag; label: string; emoji: string }[] = [
  { id: 'creatividad', label: 'Creatividad', emoji: '✨' },
  { id: 'logica', label: 'Lógica', emoji: '🧩' },
  { id: 'colaboracion', label: 'Colaboración', emoji: '🤝' },
  { id: 'perseverancia', label: 'Perseverancia', emoji: '🌱' },
  { id: 'etica', label: 'Ética digital', emoji: '🛡️' },
  { id: 'critico', label: 'Pensamiento crítico', emoji: '🔎' },
  { id: 'inclusion', label: 'Inclusión', emoji: '🌈' },
  { id: 'sostenibilidad', label: 'Sostenibilidad', emoji: '🌍' },
];

export const LANGUAGE_LABELS: Record<LanguageId, string> = {
  scratch: 'Scratch',
  blockly: 'Blockly',
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  htmlcss: 'HTML & CSS',
  sql: 'SQL',
  rust: 'Rust',
  kotlin: 'Kotlin',
  go: 'Go',
};

export const XP_PER_LEVEL = 500;
