from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from models import AnalysisResult, PingGeminiResponse
from services.file_parser import MAX_UPLOAD_BYTES, FileParseError, extract_resume_text
from services.gemini_client import GeminiError, analyze_resume, ping_gemini

router = APIRouter(prefix="/api")


@router.get("/ping-gemini", response_model=PingGeminiResponse)
def ping_gemini_endpoint() -> PingGeminiResponse:
    try:
        return PingGeminiResponse(response=ping_gemini())
    except GeminiError as exc:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}")


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_endpoint(
    resume: UploadFile = File(...),
    jd_text: str = Form(""),
) -> AnalysisResult:
    jd_text = jd_text.strip()
    if not jd_text:
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    data = await resume.read(MAX_UPLOAD_BYTES + 1)
    try:
        resume_text = extract_resume_text(resume.filename, data)
    except FileParseError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    try:
        return analyze_resume(resume_text, jd_text)
    except GeminiError as exc:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}")
