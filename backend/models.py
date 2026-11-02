from pydantic import BaseModel, Field


class PingGeminiResponse(BaseModel):
    response: str


class AnalysisResult(BaseModel):
    score: int = Field(ge=0, le=100)
    summary: str
    recommendations: list[str]
