import { getEnvVar } from '@shared/utils/envConfig'

export async function apiClient(url, options = {}) {
  // En desarrollo, getEnvVar devuelve '/api' para usar el proxy de Vite
  const baseUrl = getEnvVar('VITE_API_BASE_URL', import.meta.env.DEV ? '/api' : "http://localhost:8000/api");
  const res = await fetch(`${baseUrl}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
  return res.json();
}
