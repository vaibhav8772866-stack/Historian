from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models

router = APIRouter(tags=["Predictions"])

@router.get("/predictions")
def get_all_predictions(db: Session = Depends(get_db)):
    """
    Returns predicted score, risk level, and confidence for all analyzed students.
    """
    latest_run = db.query(models.AnalysisRun).order_by(models.AnalysisRun.id.desc()).first()
    if not latest_run:
        return []

    predictions = db.query(models.Prediction).filter(models.Prediction.analysis_run_id == latest_run.id).all()
    results = []
    for p in predictions:
        student = db.query(models.Student).filter(models.Student.student_id == p.student_id).first()
        results.append({
            "id": p.id,
            "student_id": p.student_id,
            "student_name": student.name if student else "Unknown",
            "predicted_score": p.predicted_score,
            "risk_level": p.risk_level,
            "confidence": p.confidence,
            "explanation": p.explanation_json,
            "created_at": p.created_at
        })
    return results
