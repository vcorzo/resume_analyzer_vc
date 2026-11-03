import logging
import sqlite3

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from database import get_analysis, list_analyses, save_analysis
from models import (
    AnalysisRecord,
    AnalysisSummaryItem,
    AnalyzeResponse,
    PingGeminiResponse,
)
from services.file_parser import MAX_UPLOAD_BYTES, FileParseError, extract_resume_text
from services.gemini_client import GeminiError, analyze_resume, ping_gemini

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


@router.get("/ping-gemini", response_model=PingGeminiResponse)
def ping_gemini_endpoint() -> PingGeminiResponse:
    try:
        return PingGeminiResponse(response=ping_gemini())
    except GeminiError as exc:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}")


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_endpoint(
    resume: UploadFile = File(...),
    jd_text: str = Form(""),
) -> AnalyzeResponse:
    jd_text = jd_text.strip()
    if not jd_text:
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    data = await resume.read(MAX_UPLOAD_BYTES + 1)
    try:
        resume_text = extract_resume_text(resume.filename, data)
    except FileParseError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    try:
        result = analyze_resume(resume_text, jd_text)
    except GeminiError as exc:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}")

    # A save failure shouldn't throw away a successful (and costly) analysis.
    analysis_id = None
    try:
        analysis_id = save_analysis(resume.filename or "", resume_text, jd_text, result)
    except sqlite3.Error:
        logger.exception("Failed to save analysis to SQLite")
    return AnalyzeResponse(**result.model_dump(), id=analysis_id)


@router.get("/analyses", response_model=list[AnalysisSummaryItem])
def list_analyses_endpoint() -> list[AnalysisSummaryItem]:
    return list_analyses()


@router.get("/analyses/{analysis_id}", response_model=AnalysisRecord)
def get_analysis_endpoint(analysis_id: int) -> AnalysisRecord:
    record = get_analysis(analysis_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return record
