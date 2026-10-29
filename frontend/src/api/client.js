const API_BASE = "http://localhost:8000";

export async function pingGemini() {
  const res = await fetch(`${API_BASE}/api/ping-gemini`);
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return body.response;
}
