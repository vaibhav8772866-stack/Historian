from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class HistorianMetricsSchema(BaseModel):
    performance_score: float = 90.0
    attendance_rate: str = "95.0%"
    risk_classification: str = "Low Risk"
    anomalies_flagged: int = 0
    key_contributions: List[str] = []

class EmployeeOut(BaseModel):
    id: str
    employee_id: str
    name: str
    designation: str
    department: str
    email: str
    joining_date: str
    location: str
    manager: str
    employment_status: str
    security_clearance: str
    avatar: str
    historian_metrics: Optional[HistorianMetricsSchema] = None

class OCRDataExtracted(BaseModel):
    employee_id: Optional[str] = None
    name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    email: Optional[str] = None

class OCRSearchResponse(BaseModel):
    success: bool
    filename: str
    confidence: float
    ocr_extracted: OCRDataExtracted
    matches: List[EmployeeOut] = []
    message: str

class SendEmailRequest(BaseModel):
    employee_id: str
    recipient_email: str
    search_method: Optional[str] = "Employee Badge/Image → OCR → Employee Directory"

class SendEmailResponse(BaseModel):
    success: bool
    recipient: str
    masked_email: str
    employee_id: str
    message: str
    mode: str
