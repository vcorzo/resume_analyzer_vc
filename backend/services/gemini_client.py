import json
import os

import google.generativeai as genai

from models import AnalysisResult

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")


class GeminiError(Exception):
    pass


def ping_gemini() -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise GeminiError("GEMINI_API_KEY is not set")
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(MODEL_NAME)
        result = model.generate_content("Reply with a short friendly greeting.")
        return result.text
    except Exception as exc:
        raise GeminiError(str(exc)) from exc


def build_analysis_prompt(resume_text: str, jd_text: str) -> str:
    return (
        "You are an expert recruiter. Compare the resume to the job description.\n"
        "Respond with JSON only, in this exact shape:\n"
        '{"score": <integer 0-100 fitment score>, '
        '"summary": "<2-3 sentence assessment>", '
        '"recommendations": ["<specific, actionable suggestion>", ...]}\n'
        "Recommendations should cover missing keywords, skill gaps, phrasing "
        "improvements and formatting notes.\n\n"
        f"=== RESUME ===\n{resume_text}\n\n=== JOB DESCRIPTION ===\n{jd_text}\n"
    )


def analyze_resume(resume_text: str, jd_text: str) -> AnalysisResult:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise GeminiError("GEMINI_API_KEY is not set")
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            MODEL_NAME,
            generation_config={"response_mime_type": "application/json"},
        )
        result = model.generate_content(build_analysis_prompt(resume_text, jd_text))
        return AnalysisResult(**json.loads(result.text))
    except Exception as exc:
        raise GeminiError(str(exc)) from exc
