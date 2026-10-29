import os

import google.generativeai as genai

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
