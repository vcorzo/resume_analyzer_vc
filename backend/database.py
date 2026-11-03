import json
import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path

from models import AnalysisRecord, AnalysisResult, AnalysisSummaryItem

# Repo root, per AGENTS.md: resume_analyzer.db sits next to backend/ and frontend/.
DB_PATH = Path(__file__).resolve().parent.parent / "resume_analyzer.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    resume_filename TEXT NOT NULL,
    resume_text TEXT NOT NULL,
    jd_text TEXT NOT NULL,
    score INTEGER NOT NULL,
    summary TEXT NOT NULL,
    recommendations TEXT NOT NULL
)
"""


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create the database file and schema if they don't exist yet."""
    with closing(_connect()) as conn, conn:
        conn.execute(SCHEMA)


def save_analysis(
    resume_filename: str, resume_text: str, jd_text: str, result: AnalysisResult
) -> int:
    created_at = datetime.now(timezone.utc).isoformat()
    with closing(_connect()) as conn, conn:
        cur = conn.execute(
            "INSERT INTO analyses (created_at, resume_filename, resume_text, jd_text,"
            " score, summary, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                created_at,
                resume_filename,
                resume_text,
                jd_text,
                result.score,
                result.summary,
                json.dumps(result.recommendations),
            ),
        )
        return cur.lastrowid


def list_analyses() -> list[AnalysisSummaryItem]:
    with closing(_connect()) as conn:
        rows = conn.execute(
            "SELECT id, resume_filename, score, created_at FROM analyses"
            " ORDER BY created_at DESC, id DESC"
        ).fetchall()
    return [AnalysisSummaryItem(**dict(row)) for row in rows]


def get_analysis(analysis_id: int) -> AnalysisRecord | None:
    with closing(_connect()) as conn:
        row = conn.execute(
            "SELECT * FROM analyses WHERE id = ?", (analysis_id,)
        ).fetchone()
    if row is None:
        return None
    data = dict(row)
    data["recommendations"] = json.loads(data["recommendations"])
    return AnalysisRecord(**data)
