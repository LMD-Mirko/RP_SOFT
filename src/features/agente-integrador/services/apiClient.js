export async function apiClient(url, options = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const res = await fetch(`${baseUrl}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
  return res.json();
}
