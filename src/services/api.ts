const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL)
    throw new Error('No hay una API remota configurada. CodeQuest funciona en modo local.');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
  });
  if (!response.ok) throw new Error(`La solicitud falló (${response.status}).`);
  return (await response.json()) as T;
}
