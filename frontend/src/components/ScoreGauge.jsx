const RADIUS = 62;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreGauge({ score }) {
  const offset = CIRCUMFERENCE * (1 - score / 100);
  return (
    <div className="gauge" role="img" aria-label={`Fitment score ${score} out of 100`}>
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle className="gauge-track" cx="75" cy="75" r={RADIUS} fill="none" strokeWidth="12" />
        <circle
          className="gauge-value"
          cx="75" cy="75" r={RADIUS}
          fill="none" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-number">
        {score}
        <small>out of 100</small>
      </div>
    </div>
  );
}
