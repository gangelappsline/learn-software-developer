import type { AgeGroup } from '@/types';

export function getAgeGroup(age: number): AgeGroup {
  if (age <= 8) return '6-8';
  if (age <= 11) return '9-11';
  if (age <= 14) return '12-14';
  return '15-17';
}

export function getLevelProgress(xp: number): { current: number; next: number; percent: number } {
  const current = xp % 500;
  return { current, next: 500, percent: Math.min(100, (current / 500) * 100) };
}

export function formatDuration(minutes: number): string {
  return minutes >= 30 ? '30+ min' : `${minutes} min`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(new Date(date));
}

export function getGreeting(hour = new Date().getHours()): string {
  if (hour < 12) return '¡Buenos días';
  if (hour < 19) return '¡Buenas tardes';
  return '¡Buenas noches';
}
