import { useState } from "react";

export default function AnalysisForm({ onSubmit, loading }) {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [dragging, setDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  }

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(file, jdText);
      }}
    >
      <div>
        <span className="field-label">Resume</span>
        <label
          className={`dropzone${dragging ? " is-over" : ""}${file ? " has-file" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.md"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
            {!file && <path d="M12 17v-5m-2.5 2.5L12 12l2.5 2.5" />}
          </svg>
          <span className="dropzone-title">{file ? file.name : "Drop your resume here"}</span>
          <span className="dropzone-hint">
            {file ? "Click to choose a different file" : "or click to browse. PDF or Markdown, up to 5 MB"}
          </span>
        </label>
      </div>

      <div>
        <label className="field-label" htmlFor="jd">Job description</label>
        <textarea
          id="jd"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the full job posting, including requirements and responsibilities"
        />
      </div>

      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Analyzing your resume..." : "Analyze resume"}
      </button>
    </form>
  );
}
