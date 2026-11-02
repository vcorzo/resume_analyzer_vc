import { useState } from "react";
import { analyzeResume } from "../api/client.js";
import AnalysisForm from "../components/AnalysisForm.jsx";
import AnalysisReport from "../components/AnalysisReport.jsx";
import PingGeminiButton from "../components/PingGeminiButton.jsx";
import { ReportEmpty, ReportLoading } from "../components/ReportPlaceholder.jsx";

export default function ResumeReview() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(file, jdText) {
    setResult(null);
    setError(null);
    if (!file) {
      setError("Choose a resume file (.pdf or .md) to continue.");
      return;
    }
    if (!jdText.trim()) {
      setError("Paste a job description to continue.");
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
    <div className="app">
      <header className="app-header">
        <h1>Resume Analyzer</h1>
        <p>See how well your resume fits a job, and what to change to fit it better.</p>
      </header>

      <main className="layout">
        <div className="sheet">
          <AnalysisForm onSubmit={handleSubmit} loading={loading} />
          {error && <p className="alert" role="alert" style={{ marginTop: "1rem" }}>{error}</p>}
        </div>
        <div className="sheet">
          {loading ? <ReportLoading /> : result ? <AnalysisReport result={result} /> : <ReportEmpty />}
        </div>
      </main>

      <footer className="app-footer">
        <p>Connection check</p>
        <PingGeminiButton />
      </footer>
    </div>
  );
}
