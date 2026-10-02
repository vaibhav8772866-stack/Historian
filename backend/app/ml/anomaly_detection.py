import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any
from sklearn.ensemble import IsolationForest
from app.core.config import settings
from app.ml.preprocessing import FEATURE_COLUMNS, MLPreprocessor

class AnomalyDetectorModel:
    def __init__(self, contamination: float = 0.1):
        self.model = IsolationForest(contamination=contamination, random_state=42)
        self.model_path = os.path.join(settings.MODEL_DIR, "anomaly_model.joblib")
        self.is_trained = False
        self.load_model()

    def train(self, df: pd.DataFrame, preprocessor: MLPreprocessor) -> Dict[str, Any]:
        """Trains IsolationForest on historical features."""
        X_scaled = preprocessor.transform(df)
        self.model.fit(X_scaled)
        self.is_trained = True
        self.save_model()

        return {"status": "trained", "samples": len(df)}

    def predict_single(self, record: Dict[str, float], preprocessor: MLPreprocessor) -> Dict[str, Any]:
        """
        Detects structural anomalies or unusual feature combinations.
        Note: Low performance alone is NOT an anomaly; an anomaly represents unusual patterns
        (e.g., 98% attendance & 8 hrs study but 30% exam score).
        """
        df_single = pd.DataFrame([record])
        X_scaled = preprocessor.transform(df_single)

        att = record.get("attendance", 75.0)
        prev = record.get("previous_marks", 70.0)
        ass = record.get("assignment_score", 70.0)
        hrs = record.get("study_hours", 4.0)
        exam = record.get("exam_score", 70.0)

        # Rule-based pattern checks for domain explanations
        explanations = []
        if att >= 90.0 and hrs >= 6.0 and exam < 50.0:
            explanations.append("High effort (attendance >= 90%, study >= 6h) mismatched with low exam score (<50%).")
        if prev >= 85.0 and exam < 45.0:
            explanations.append("Sharp unexpected drop from historical previous marks (>=85%) to exam score (<45%).")
        if ass >= 90.0 and exam < 40.0:
            explanations.append("Severe discrepancy between high assignment score (>=90%) and low exam score (<40%).")
        if att < 40.0 and exam >= 90.0:
            explanations.append("Unusual combination of low attendance (<40%) with top-tier exam performance (>=90%).")

        if self.is_trained:
            raw_score = float(self.model.decision_function(X_scaled)[0])
            is_anomaly = bool(self.model.predict(X_scaled)[0] == -1)
        else:
            # Fallback estimation
            is_anomaly = len(explanations) > 0
            raw_score = -0.15 if is_anomaly else 0.25

        if not explanations and is_anomaly:
            explanations.append("Unusual multi-dimensional metric combination detected relative to cohort baseline.")

        if not explanations:
            explanations.append("Record conforms to normal cohort performance patterns.")

        # Severity ranking
        if is_anomaly or len(explanations) > 1:
            severity = "High" if len(explanations) > 1 else "Medium"
        else:
            severity = "Low"

        return {
            "anomaly_score": round(raw_score, 3),
            "is_anomaly": is_anomaly or len(explanations) > 1,
            "severity": severity,
            "explanation": " ".join(explanations)
        }

    def save_model(self):
        joblib.dump(self.model, self.model_path)

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                self.is_trained = True
            except Exception:
                self.is_trained = False
