from pydantic import BaseModel, Field


class PingGeminiResponse(BaseModel):
    response: str


class AnalysisResult(BaseModel):
    score: int = Field(ge=0, le=100)
    summary: str
    recommendations: list[str]


class AnalyzeResponse(AnalysisResult):
    # None when the analysis succeeded but could not be saved.
    id: int | None = None


class AnalysisSummaryItem(BaseModel):
    id: int
    resume_filename: str
    score: int
    created_at: str


class AnalysisRecord(AnalysisResult):
    id: int
    created_at: str
    resume_filename: str
    resume_text: str
    jd_text: str
