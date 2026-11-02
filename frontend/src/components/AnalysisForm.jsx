import { useState } from "react";

export default function AnalysisForm({ onSubmit, loading }) {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(file, jdText);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", maxWidth: 640 }}>
      <label>
        Resume (.pdf or .md)
        <br />
        <input
          type="file"
          accept=".pdf,.md"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
      </label>
      <label>
        Job description
        <br />
        <textarea
          rows={10}
          style={{ width: "100%" }}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the job description here"
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </form>
  );
}
