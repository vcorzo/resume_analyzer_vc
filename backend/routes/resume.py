from fastapi import APIRouter, HTTPException

from models import PingGeminiResponse
from services.gemini_client import GeminiError, ping_gemini

router = APIRouter(prefix="/api")


@router.get("/ping-gemini", response_model=PingGeminiResponse)
def ping_gemini_endpoint() -> PingGeminiResponse:
    try:
        return PingGeminiResponse(response=ping_gemini())
    except GeminiError as exc:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}")
