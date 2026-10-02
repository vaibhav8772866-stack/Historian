from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.analysis_service import AnalysisService
from app.schemas.analysis import APIErrorResponse

router = APIRouter(tags=["Analysis Engine"])

@router.post(
    "/analysis/run",
    responses={
        400: {"model": APIErrorResponse},
        500: {"model": APIErrorResponse}
    }
)
def run_analysis_pipeline(
    dataset_name: str = "Uploaded Student PDF Dataset",
    db: Session = Depends(get_db)
):
    """
    Triggers the end-to-end Machine Learning Analysis Pipeline:
    Extraction -> Validation -> Cleaning -> Feature Engineering ->
    Classification -> Regression -> Clustering -> Anomaly Detection ->
    Explainability -> Recommendations -> DB Storage.
    """
    try:
        summary = AnalysisService.run_full_pipeline(db, dataset_name=dataset_name)
        return summary
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "ANALYSIS_PIPELINE_ERROR",
                "message": str(ve)
            }
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "ANALYSIS_FAILED",
                "message": f"Pipeline execution failed: {str(err)}"
            }
        )
