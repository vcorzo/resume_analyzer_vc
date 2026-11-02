export function ReportEmpty() {
  return (
    <div className="report-empty">
      <h2>Your report will appear here</h2>
      <p>Add your resume and a job description, then select Analyze resume to see your fitment score.</p>
    </div>
  );
}

export function ReportLoading() {
  return (
    <div className="skeleton" aria-busy="true" aria-label="Analyzing your resume">
      <span className="skeleton-circle" />
      <span /><span /><span /><span />
    </div>
  );
}
