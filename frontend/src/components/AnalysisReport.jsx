import ScoreGauge from "./ScoreGauge.jsx";

function getTier(score) {
  if (score >= 75) return { cls: "tier-good", label: "Strong match" };
  if (score >= 50) return { cls: "tier-mid", label: "Partial match" };
  return { cls: "tier-low", label: "Weak match" };
}

export default function AnalysisReport({ result }) {
  const tier = getTier(result.score);
  return (
    <section className={tier.cls} aria-live="polite">
      <div className="report-head">
        <ScoreGauge score={result.score} />
        <div>
          <h2 className="verdict">{tier.label}</h2>
          <p className="summary">{result.summary}</p>
        </div>
      </div>
      <div className="scale" style={{ "--pos": `${result.score}%` }}>
        <div className="scale-bar" />
        <div className="scale-labels">
          <span>0</span><span>50</span><span>75</span><span>100</span>
        </div>
      </div>
      <h3 className="recs-title">How to improve your match</h3>
      <ul className="recs">
        {result.recommendations.map((rec, i) => (
          <li key={i}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 12 5 5 9-10" />
            </svg>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
