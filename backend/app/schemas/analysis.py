from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UploadResponse(BaseModel):
    success: bool = True
    filename: str
    dataset_name: str
    records_extracted: int
    quality_score: float = Field(..., ge=0.0, le=100.0, description="Overall data quality score")
    warnings: List[str] = []
    message: str

class AnalysisRunOut(BaseModel):
    id: int
    dataset_name: str
    records_count: int
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    model_version: str

    class Config:
        from_attributes = True

class APIErrorDetail(BaseModel):
    code: str
    message: str

class APIErrorResponse(BaseModel):
    success: bool = False
    error: APIErrorDetail
