from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models

router = APIRouter(tags=["Anomalies"])

@router.get("/anomalies")
def get_all_anomalies(db: Session = Depends(get_db)):
    """
    Returns detected unusual student profiles or multi-metric anomalies.
    """
    latest_run = db.query(models.AnalysisRun).order_by(models.AnalysisRun.id.desc()).first()
    if not latest_run:
        return []

    anomalies = db.query(models.Anomaly).filter(models.Anomaly.analysis_run_id == latest_run.id).all()
    results = []
    for a in anomalies:
        student = db.query(models.Student).filter(models.Student.student_id == a.student_id).first()
        results.append({
            "id": a.id,
            "student_id": a.student_id,
            "student_name": student.name if student else "Unknown",
            "anomaly_score": a.anomaly_score,
            "severity": a.severity,
            "explanation": a.explanation,
            "created_at": a.created_at
        })
    return results
