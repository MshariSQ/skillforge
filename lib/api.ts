const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

async function apiFetch(path: string, options?: RequestInit, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export const getStats = () => apiFetch("/api/stats");
export const getMe = (token: string) => apiFetch("/api/auth/me", undefined, token);
export const getUserProfile = (username: string) => apiFetch(`/api/users/${username}`);

export function getLoginUrl(): string {
  return `${API}/api/auth/github`;
}

// ── Progress ──────────────────────────────────────────────────────────────────
export const getProgress = (roadmapId: string, token: string): Promise<{ completed: string[] }> =>
  apiFetch(`/api/progress?roadmap_id=${encodeURIComponent(roadmapId)}`, undefined, token);

export const markNodeDone = (roadmapId: string, nodeId: string, token: string) =>
  apiFetch("/api/progress", { method: "POST", body: JSON.stringify({ roadmap_id: roadmapId, node_id: nodeId }) }, token);

export const markNodeUndone = (roadmapId: string, nodeId: string, token: string) =>
  apiFetch("/api/progress", { method: "DELETE", body: JSON.stringify({ roadmap_id: roadmapId, node_id: nodeId }) }, token);

// ── Bookmarks ─────────────────────────────────────────────────────────────────
export const getBookmarks = (token: string): Promise<{ bookmarks: { type: string; item_id: string }[] }> =>
  apiFetch("/api/bookmarks", undefined, token);

export const addBookmark = (type: string, itemId: string, token: string) =>
  apiFetch("/api/bookmarks", { method: "POST", body: JSON.stringify({ type, item_id: itemId }) }, token);

export const removeBookmark = (type: string, itemId: string, token: string) =>
  apiFetch("/api/bookmarks", { method: "DELETE", body: JSON.stringify({ type, item_id: itemId }) }, token);
