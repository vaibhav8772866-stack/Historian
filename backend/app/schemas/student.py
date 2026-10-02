from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class StudentBase(BaseModel):
    student_id: str = Field(..., description="Unique student identifier")
    name: str = Field(..., description="Full student name")
    class_name: Optional[str] = Field(None, description="Class / Section name")
    semester: Optional[str] = Field(None, description="Semester / Term")

class StudentCreate(StudentBase):
    pass

class StudentOut(StudentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class HistoricalRecordBase(BaseModel):
    student_id: str
    attendance: float = Field(..., ge=0.0, le=100.0, description="Attendance percentage (0-100)")
    previous_marks: float = Field(..., ge=0.0, le=100.0, description="Previous marks percentage (0-100)")
    assignment_score: float = Field(..., ge=0.0, le=100.0, description="Assignment score (0-100)")
    study_hours: float = Field(..., ge=0.0, le=24.0, description="Daily study hours (0-24)")
    exam_score: float = Field(..., ge=0.0, le=100.0, description="Exam score (0-100)")

    @validator('attendance', 'previous_marks', 'assignment_score', 'exam_score')
    def validate_scores(cls, v):
        if v < 0.0 or v > 100.0:
            raise ValueError("Score must be between 0 and 100.")
        return round(float(v), 2)

    @validator('study_hours')
    def validate_hours(cls, v):
        if v < 0.0 or v > 24.0:
            raise ValueError("Study hours must be between 0 and 24.")
        return round(float(v), 2)

class HistoricalRecordCreate(HistoricalRecordBase):
    record_date: Optional[datetime] = None

class HistoricalRecordOut(HistoricalRecordBase):
    id: int
    record_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
