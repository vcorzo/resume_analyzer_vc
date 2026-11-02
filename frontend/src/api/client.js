const API_BASE = "http://localhost:8000";

export async function pingGemini() {
  const res = await fetch(`${API_BASE}/api/ping-gemini`);
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return body.response;
}

export async function analyzeResume(resumeFile, jdText) {
  const form = new FormData();
  form.append("resume", resumeFile);
  form.append("jd_text", jdText);
  const res = await fetch(`${API_BASE}/api/analyze`, { method: "POST", body: form });
  let body = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON error body
  }
  if (!res.ok) {
    throw new Error(body?.detail || `Request failed (${res.status})`);
  }
  return body;
}
