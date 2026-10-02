from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models

router = APIRouter(tags=["Recommendations"])

@router.get("/recommendations")
def get_all_recommendations(db: Session = Depends(get_db)):
    """
    Returns recommendations generated for all analyzed students.
    """
    latest_run = db.query(models.AnalysisRun).order_by(models.AnalysisRun.id.desc()).first()
    if not latest_run:
        return []

    recommendations = db.query(models.Recommendation).filter(models.Recommendation.analysis_run_id == latest_run.id).all()
    results = []
    for r in recommendations:
        student = db.query(models.Student).filter(models.Student.student_id == r.student_id).first()
        results.append({
            "id": r.id,
            "student_id": r.student_id,
            "student_name": student.name if student else "Unknown",
            "priority": r.priority,
            "recommendation": r.recommendation,
            "reason": r.reason,
            "created_at": r.created_at
        })
    return results

@router.get("/recommendations/{student_id}")
def get_student_recommendation(student_id: str, db: Session = Depends(get_db)):
    """
    Returns specific recommendations generated for a student.
    """
    recom = db.query(models.Recommendation).filter(models.Recommendation.student_id == student_id).order_by(models.Recommendation.id.desc()).first()
    if not recom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "RECOMMENDATION_NOT_FOUND", "message": f"No recommendations found for student '{student_id}'."}
        )

    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    return {
        "id": recom.id,
        "student_id": recom.student_id,
        "student_name": student.name if student else "Unknown",
        "priority": recom.priority,
        "recommendations": [a.strip() for a in recom.recommendation.split(";")],
        "reason": recom.reason,
        "created_at": recom.created_at
    }
