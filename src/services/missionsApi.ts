import { missionSeed } from '@/data/missions';
import { getCachedMissions, cacheMissions } from './storage';
import type { Mission } from '@/types';

/** Devuelve contenido local-first: funciona también en modo avión y se cachea en IndexedDB. */
export async function getMissions(): Promise<Mission[]> {
  const cached = await getCachedMissions();
  if (cached?.length) return cached;
  await cacheMissions(missionSeed);
  return missionSeed;
}

export async function getMission(missionId: string): Promise<Mission | undefined> {
  const missions = await getMissions();
  return missions.find((mission) => mission.id === missionId);
}
