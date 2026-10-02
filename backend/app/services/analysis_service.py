from datetime import datetime
import pandas as pd
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.db import models
from app.services.feature_engineering import FeatureEngineeringService
from app.services.recommendation_service import RecommendationService
from app.ml.preprocessing import MLPreprocessor
from app.ml.classification import RiskClassifierModel
from app.ml.regression import PerformanceRegressorModel
from app.ml.clustering import StudentClustererModel
from app.ml.anomaly_detection import AnomalyDetectorModel
from app.ml.explainability import PredictionExplainer

class AnalysisService:
    @staticmethod
    def run_full_pipeline(db: Session, dataset_name: str = "Uploaded Dataset") -> Dict[str, Any]:
        """
        Runs the complete end-to-end Historian ML Analysis Pipeline:
        Historical Records -> Feature Engineering -> Classification -> Regression ->
        Clustering -> Anomaly Detection -> Explainability -> Recommendations -> DB Storage.
        """
        # 1. Fetch latest historical records from DB
        records = db.query(models.HistoricalRecord).all()
        if not records:
            raise ValueError("No historical student records found in database to analyze. Please upload data first.")

        # Convert to Pandas DataFrame
        data_list = []
        for r in records:
            data_list.append({
                "student_id": r.student_id,
                "attendance": r.attendance,
                "previous_marks": r.previous_marks,
                "assignment_score": r.assignment_score,
                "study_hours": r.study_hours,
                "exam_score": r.exam_score
            })
        df = pd.DataFrame(data_list)

        # 2. Create AnalysisRun record
        analysis_run = models.AnalysisRun(
            dataset_name=dataset_name,
            records_count=len(df),
            status="running",
            started_at=datetime.utcnow(),
            model_version="1.0.0"
        )
        db.add(analysis_run)
        db.commit()
        db.refresh(analysis_run)

        # 3. Feature Engineering
        df_feat = FeatureEngineeringService.generate_features(df)

        # 4. Initialize ML Models & Preprocessor
        preprocessor = MLPreprocessor()
        classifier = RiskClassifierModel()
        regressor = PerformanceRegressorModel()
        clusterer = StudentClustererModel(n_clusters=min(4, max(1, len(df))))
        anomaly_detector = AnomalyDetectorModel()

        # 5. Train / Fit ML Models on cohort dataset
        classifier.train(df_feat, preprocessor)
        regressor.train(df_feat, preprocessor)
        clusterer.train(df_feat, preprocessor)
        anomaly_detector.train(df_feat, preprocessor)

        # 6. Run Inference & Store Results
        high_risk_count = 0
        medium_risk_count = 0
        low_risk_count = 0
        anomaly_count = 0

        for _, row in df.iterrows():
            sid = str(row["student_id"])
            rec_dict = {
                "attendance": float(row["attendance"]),
                "previous_marks": float(row["previous_marks"]),
                "assignment_score": float(row["assignment_score"]),
                "study_hours": float(row["study_hours"]),
                "exam_score": float(row["exam_score"])
            }

            # A. Classification (Risk)
            clf_res = classifier.predict_single(rec_dict, preprocessor)
            risk_level = clf_res["risk_level"]
            confidence = clf_res["confidence"]

            if risk_level == "High":
                high_risk_count += 1
            elif risk_level == "Medium":
                medium_risk_count += 1
            else:
                low_risk_count += 1

            # B. Regression (Predicted Performance)
            predicted_score = regressor.predict_single(rec_dict, preprocessor)

            # C. Explainability
            exp_res = PredictionExplainer.explain_prediction(rec_dict, risk_level, predicted_score)

            # Save Prediction to DB
            prediction_record = models.Prediction(
                student_id=sid,
                analysis_run_id=analysis_run.id,
                predicted_score=predicted_score,
                risk_level=risk_level,
                confidence=confidence,
                explanation_json=exp_res
            )
            db.add(prediction_record)

            # D. Anomaly Detection
            anom_res = anomaly_detector.predict_single(rec_dict, preprocessor)
            if anom_res["is_anomaly"]:
                anomaly_count += 1

            anomaly_record = models.Anomaly(
                student_id=sid,
                analysis_run_id=analysis_run.id,
                anomaly_score=anom_res["anomaly_score"],
                severity=anom_res["severity"],
                explanation=anom_res["explanation"]
            )
            db.add(anomaly_record)

            # E. Clustering
            clust_res = clusterer.predict_single(rec_dict, preprocessor)
            cluster_record = models.Cluster(
                student_id=sid,
                analysis_run_id=analysis_run.id,
                cluster_id=clust_res["cluster_id"],
                cluster_name=clust_res["cluster_name"]
            )
            db.add(cluster_record)

            # F. Recommendations
            recom_res = RecommendationService.generate_recommendations(rec_dict, risk_level, predicted_score)
            recom_record = models.Recommendation(
                student_id=sid,
                analysis_run_id=analysis_run.id,
                priority=recom_res["priority"],
                recommendation="; ".join(recom_res["recommendations"]),
                reason=recom_res["reason"]
            )
            db.add(recom_record)

        # Update AnalysisRun Status
        analysis_run.status = "completed"
        analysis_run.completed_at = datetime.utcnow()
        db.commit()

        return {
            "analysis_id": analysis_run.id,
            "status": "completed",
            "records_analyzed": len(df),
            "high_risk": high_risk_count,
            "medium_risk": medium_risk_count,
            "low_risk": low_risk_count,
            "anomalies": anomaly_count
        }
