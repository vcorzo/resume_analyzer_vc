import { useCallback, useEffect, useState } from "react";
import { analyzeResume, getAnalysis, listAnalyses } from "../api/client.js";
import AnalysisForm from "../components/AnalysisForm.jsx";
import AnalysisHistory from "../components/AnalysisHistory.jsx";
import AnalysisReport from "../components/AnalysisReport.jsx";
import PingGeminiButton from "../components/PingGeminiButton.jsx";
import { ReportEmpty, ReportLoading } from "../components/ReportPlaceholder.jsx";

export default function ResumeReview() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState(null);

  const refreshHistory = useCallback(async () => {
    try {
      setHistory(await listAnalyses());
      setHistoryError(null);
    } catch (err) {
      setHistoryError(`Could not load past analyses: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  async function handleSelect(id) {
    setError(null);
    try {
      setResult(await getAnalysis(id));
    } catch (err) {
      setError(err.message);
    }
  }

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
      refreshHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                <path d="m9 14 2 2 4-4" />
              </svg>
            </span>
            Resume Analyzer
          </div>
          <h1>Know how well you fit before you apply</h1>
          <p>Upload your resume, paste the job description, and get a fitment score with specific changes to make.</p>
        </div>
      </header>

      <main className="app-main layout">
        <div className="column">
          <div className="sheet">
            <h2 className="sheet-title">Your application</h2>
            <AnalysisForm onSubmit={handleSubmit} loading={loading} />
            {error && <p className="alert" role="alert" style={{ marginTop: "1rem" }}>{error}</p>}
          </div>
          <div className="sheet">
            <h2 className="sheet-title">Past analyses</h2>
            <AnalysisHistory items={history} activeId={result?.id} onSelect={handleSelect} error={historyError} />
          </div>
        </div>
        <div className="sheet">
          <h2 className="sheet-title">Fitment report</h2>
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
