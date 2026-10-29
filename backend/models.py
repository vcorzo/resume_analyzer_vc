from pydantic import BaseModel


class PingGeminiResponse(BaseModel):
    response: str
