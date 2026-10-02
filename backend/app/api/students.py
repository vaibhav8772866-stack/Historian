from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.db import models

router = APIRouter(tags=["Students"])

@router.get("/students")
def get_all_students(
    risk: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns list of all students with profile summary, predicted score, and risk classification.
    """
    students = db.query(models.Student).all()
    results = []

    for s in students:
        # Latest prediction
        pred = db.query(models.Prediction).filter(models.Prediction.student_id == s.student_id).order_by(models.Prediction.id.desc()).first()
        # Latest historical record
        hist = db.query(models.HistoricalRecord).filter(models.HistoricalRecord.student_id == s.student_id).order_by(models.HistoricalRecord.id.desc()).first()
        # Latest cluster
        clust = db.query(models.Cluster).filter(models.Cluster.student_id == s.student_id).order_by(models.Cluster.id.desc()).first()

        risk_level = pred.risk_level if pred else "Low"
        if risk and risk_level.lower() != risk.lower():
            continue

        results.append({
            "id": s.id,
            "student_id": s.student_id,
            "name": s.name,
            "class_name": s.class_name or "Class A",
            "semester": s.semester or "Semester 1",
            "attendance": hist.attendance if hist else 0.0,
            "previous_marks": hist.previous_marks if hist else 0.0,
            "assignment_score": hist.assignment_score if hist else 0.0,
            "study_hours": hist.study_hours if hist else 0.0,
            "exam_score": hist.exam_score if hist else 0.0,
            "predicted_score": pred.predicted_score if pred else 0.0,
            "risk_level": risk_level,
            "confidence": pred.confidence if pred else 0.0,
            "cluster_name": clust.cluster_name if clust else "Unassigned"
        })

    return results

@router.get("/students/{student_id}")
def get_student_detail(student_id: str, db: Session = Depends(get_db)):
    """
    Returns full detailed profile of a student including predictions, explanations, anomalies, and recommendations.
    """
    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "STUDENT_NOT_FOUND", "message": f"Student with ID '{student_id}' not found."}
        )

    # Latest analytics
    hist = db.query(models.HistoricalRecord).filter(models.HistoricalRecord.student_id == student_id).order_by(models.HistoricalRecord.id.desc()).first()
    pred = db.query(models.Prediction).filter(models.Prediction.student_id == student_id).order_by(models.Prediction.id.desc()).first()
    anom = db.query(models.Anomaly).filter(models.Anomaly.student_id == student_id).order_by(models.Anomaly.id.desc()).first()
    clust = db.query(models.Cluster).filter(models.Cluster.student_id == student_id).order_by(models.Cluster.id.desc()).first()
    recom = db.query(models.Recommendation).filter(models.Recommendation.student_id == student_id).order_by(models.Recommendation.id.desc()).first()

    return {
        "profile": {
            "id": student.id,
            "student_id": student.student_id,
            "name": student.name,
            "class_name": student.class_name or "Class A",
            "semester": student.semester or "Semester 1",
            "created_at": student.created_at
        },
        "metrics": {
            "attendance": hist.attendance if hist else 0.0,
            "previous_marks": hist.previous_marks if hist else 0.0,
            "assignment_score": hist.assignment_score if hist else 0.0,
            "study_hours": hist.study_hours if hist else 0.0,
            "exam_score": hist.exam_score if hist else 0.0
        },
        "analytics": {
            "predicted_score": pred.predicted_score if pred else 0.0,
            "risk_level": pred.risk_level if pred else "Low",
            "confidence": pred.confidence if pred else 0.0,
            "cluster_id": clust.cluster_id if clust else 0,
            "cluster_name": clust.cluster_name if clust else "Unassigned",
            "explanation": pred.explanation_json if (pred and pred.explanation_json) else {}
        },
        "anomaly": {
            "is_anomaly": True if (anom and anom.severity in ["High", "Critical"]) else False,
            "anomaly_score": anom.anomaly_score if anom else 0.0,
            "severity": anom.severity if anom else "Low",
            "explanation": anom.explanation if anom else "Normal performance pattern."
        },
        "recommendation": {
            "priority": recom.priority if recom else "Low",
            "actions": [a.strip() for a in recom.recommendation.split(";")] if recom else [],
            "reason": recom.reason if recom else "No immediate intervention required."
        }
    }

@router.get("/students/{student_id}/history")
def get_student_history(student_id: str, db: Session = Depends(get_db)):
    """
    Returns historical record sequence for a given student.
    """
    records = db.query(models.HistoricalRecord).filter(models.HistoricalRecord.student_id == student_id).order_by(models.HistoricalRecord.id.asc()).all()
    return records
