import { openDB } from 'idb';
import type { Mission } from '@/types';

const DATABASE_NAME = 'codequest-offline';
const DATABASE_VERSION = 1;
const CONTENT_STORE = 'content';

async function getDatabase() {
  return openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(CONTENT_STORE)) {
        database.createObjectStore(CONTENT_STORE);
      }
    },
  });
}

export async function getCachedMissions(): Promise<Mission[] | null> {
  if (typeof indexedDB === 'undefined') return null;
  try {
    const database = await getDatabase();
    return ((await database.get(CONTENT_STORE, 'missions')) as Mission[] | undefined) ?? null;
  } catch {
    return null;
  }
}

export async function cacheMissions(missions: Mission[]): Promise<void> {
  if (typeof indexedDB === 'undefined') return;
  try {
    const database = await getDatabase();
    await database.put(CONTENT_STORE, missions, 'missions');
  } catch {
    // La app sigue disponible con el contenido empaquetado aunque IndexedDB esté bloqueado.
  }
}
