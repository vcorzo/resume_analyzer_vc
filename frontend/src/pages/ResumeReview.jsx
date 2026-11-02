import { useState } from "react";
import { analyzeResume } from "../api/client.js";
import AnalysisForm from "../components/AnalysisForm.jsx";
import AnalysisReport from "../components/AnalysisReport.jsx";
import PingGeminiButton from "../components/PingGeminiButton.jsx";

export default function ResumeReview() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(file, jdText) {
    setResult(null);
    setError(null);
    if (!file) {
      setError("Please choose a resume file (.pdf or .md).");
      return;
    }
    if (!jdText.trim()) {
      setError("Please paste a job description.");
      return;
    }
    setLoading(true);
    try {
      setResult(await analyzeResume(file, jdText));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Resume Analyzer</h1>
      <AnalysisForm onSubmit={handleSubmit} loading={loading} />
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {result && <AnalysisReport result={result} />}
      <hr style={{ margin: "2rem 0" }} />
      <PingGeminiButton />
    </main>
  );
}
