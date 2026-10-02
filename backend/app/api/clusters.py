from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.db import models

router = APIRouter(tags=["Clusters"])

@router.get("/clusters")
def get_all_clusters(db: Session = Depends(get_db)):
    """
    Returns student segmentation clusters, statistics, and student memberships.
    """
    latest_run = db.query(models.AnalysisRun).order_by(models.AnalysisRun.id.desc()).first()
    if not latest_run:
        return []

    clusters = db.query(models.Cluster).filter(models.Cluster.analysis_run_id == latest_run.id).all()
    
    # Group by cluster_name
    summary_map = {}
    for c in clusters:
        name = c.cluster_name
        if name not in summary_map:
            summary_map[name] = {
                "cluster_id": c.cluster_id,
                "cluster_name": name,
                "student_count": 0,
                "students": []
            }
        summary_map[name]["student_count"] += 1
        summary_map[name]["students"].append(c.student_id)

    return list(summary_map.values())
