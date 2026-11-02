export default function AnalysisReport({ result }) {
  return (
    <section>
      <h2>Fitment score: {result.score}/100</h2>
      <p>{result.summary}</p>
      <h3>Recommendations</h3>
      <ul>
        {result.recommendations.map((rec, i) => (
          <li key={i}>{rec}</li>
        ))}
      </ul>
    </section>
  );
}
