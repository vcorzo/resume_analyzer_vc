import { useState } from "react";
import { pingGemini } from "../api/client.js";

export default function PingGeminiButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleClick() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      setResult(await pingGemini());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <button className="btn btn-ghost" onClick={handleClick} disabled={loading}>
        {loading ? "Pinging..." : "Ping Gemini"}
      </button>
      {result && <span>{result}</span>}
      {error && <span style={{ color: "var(--low)" }}>{error}</span>}
    </div>
  );
}
