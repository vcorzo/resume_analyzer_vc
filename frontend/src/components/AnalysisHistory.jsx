function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function AnalysisHistory({ items, activeId, onSelect, error }) {
  if (error) return <p className="alert" role="alert">{error}</p>;
  if (items.length === 0) {
    return <p className="history-empty">Past analyses will be listed here after you run one.</p>;
  }
  return (
    <ul className="history">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className={`history-item${item.id === activeId ? " is-active" : ""}`}
            aria-current={item.id === activeId ? "true" : undefined}
            onClick={() => onSelect(item.id)}
          >
            <span className="history-score">{item.score}</span>
            <span className="history-meta">
              <span className="history-name">{item.resume_filename}</span>
              <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
