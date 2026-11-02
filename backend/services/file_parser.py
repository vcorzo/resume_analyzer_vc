import io
from pathlib import Path

from pypdf import PdfReader

ALLOWED_EXTENSIONS = {".pdf", ".md"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024


class FileParseError(Exception):
    pass


def extract_resume_text(filename: str, data: bytes) -> str:
    """Validate an uploaded resume and return its plain text."""
    ext = Path(filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise FileParseError("Unsupported file type. Please upload a .pdf or .md resume.")
    if not data:
        raise FileParseError("The uploaded resume file is empty.")
    if len(data) > MAX_UPLOAD_BYTES:
        raise FileParseError(
            f"Resume file is too large (max {MAX_UPLOAD_BYTES // (1024 * 1024)} MB)."
        )

    if ext == ".md":
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError as exc:
            raise FileParseError("Markdown resume must be UTF-8 encoded.") from exc
    else:
        try:
            reader = PdfReader(io.BytesIO(data))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception as exc:
            raise FileParseError("Could not read the PDF file.") from exc

    text = text.strip()
    if not text:
        raise FileParseError("No text could be extracted from the resume.")
    return text
