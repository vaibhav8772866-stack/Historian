from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.db import models

router = APIRouter(tags=["Dashboard"])

@router.get("/dashboard")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """
    Returns aggregated real-time analytics for the Historian Dashboard.
    All data is computed dynamically from DB + ML analysis.
    """
    total_students = db.query(models.Student).count()
    if total_students == 0:
        return {
            "ai_performance_score": 0.0,
            "trend": "+0.0%",
            "risk_level": "Low",
            "predicted_average": 0.0,
            "students_analyzed": 0,
            "risk_distribution": {
                "high": 0,
                "medium": 0,
                "low": 0
            },
            "detected_pattern": "No historical data ingested yet. Upload PDF to start analysis.",
            "recommendation": "Upload student records PDF to generate AI insights.",
            "anomaly_count": 0
        }

    # Latest analysis run
    latest_run = db.query(models.AnalysisRun).order_by(models.AnalysisRun.id.desc()).first()
    run_id = latest_run.id if latest_run else None

    # Predictions query
    pred_query = db.query(models.Prediction)
    if run_id:
        pred_query = pred_query.filter(models.Prediction.analysis_run_id == run_id)
    predictions = pred_query.all()

    high_risk = sum(1 for p in predictions if p.risk_level == "High")
    med_risk = sum(1 for p in predictions if p.risk_level == "Medium")
    low_risk = sum(1 for p in predictions if p.risk_level == "Low")

    # Average predicted score
    avg_pred_score = round(sum(p.predicted_score for p in predictions) / len(predictions), 1) if predictions else 0.0

    # Historical average
    hist_records = db.query(models.HistoricalRecord).all()
    avg_exam_score = round(sum(r.exam_score for r in hist_records) / len(hist_records), 1) if hist_records else 0.0
    avg_attendance = round(sum(r.attendance for r in hist_records) / len(hist_records), 1) if hist_records else 0.0

    # Trend calculation (predicted score vs past exam average)
    trend_val = round(avg_pred_score - avg_exam_score, 1)
    trend_str = f"+{trend_val}%" if trend_val >= 0 else f"{trend_val}%"

    # Anomalies count
    anom_query = db.query(models.Anomaly)
    if run_id:
        anom_query = anom_query.filter(models.Anomaly.analysis_run_id == run_id, models.Anomaly.severity.in_(["High", "Critical"]))
    anom_count = anom_query.count()

    # AI Overall Performance Score (0-100)
    # Weighted by cohort attendance, assignment score, and low risk percentage
    low_risk_pct = (low_risk / len(predictions) * 100.0) if predictions else 0.0
    ai_score = round(0.4 * avg_exam_score + 0.3 * avg_attendance + 0.3 * low_risk_pct, 1)

    # Dominant Cohort Pattern & System Recommendation
    if high_risk > med_risk and high_risk > low_risk:
        overall_risk = "High"
        detected_pattern = "Systemic vulnerability detected: Low attendance and low daily study hours across high-risk cohort."
        recommendation = "Execute immediate academic advisor interventions and mandatory tutoring sessions for high-risk students."
    elif med_risk >= high_risk and med_risk >= low_risk:
        overall_risk = "Medium"
        detected_pattern = "Moderate performance gap: Students demonstrate adequate attendance but inconsistent assignment completion."
        recommendation = "Implement targeted assignment workshops and weekly progress checkpoints."
    else:
        overall_risk = "Low"
        detected_pattern = "Strong academic trajectory: High attendance and study discipline correlating with top exam scores."
        recommendation = "Maintain current academic support framework and encourage peer-mentorship programs."

    return {
        "ai_performance_score": ai_score,
        "trend": trend_str,
        "risk_level": overall_risk,
        "predicted_average": avg_pred_score,
        "students_analyzed": len(predictions) if predictions else total_students,
        "risk_distribution": {
            "high": high_risk,
            "medium": med_risk,
            "low": low_risk
        },
        "detected_pattern": detected_pattern,
        "recommendation": recommendation,
        "anomaly_count": anom_count
    }
