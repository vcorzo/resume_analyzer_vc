import os

from google import genai

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")


class GeminiError(Exception):
    pass


def ping_gemini() -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise GeminiError("GEMINI_API_KEY is not set")
    try:
        client = genai.Client(api_key=api_key)
        result = client.models.generate_content(
            model=MODEL_NAME, contents="Reply with a short friendly greeting."
        )
        return result.text
    except Exception as exc:
        raise GeminiError(str(exc)) from exc
