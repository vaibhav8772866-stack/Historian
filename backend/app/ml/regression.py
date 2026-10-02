import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any
from sklearn.ensemble import GradientBoostingRegressor
from app.core.config import settings
from app.ml.preprocessing import FEATURE_COLUMNS, MLPreprocessor

class PerformanceRegressorModel:
    def __init__(self):
        self.model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
        self.model_path = os.path.join(settings.MODEL_DIR, "regression_model.joblib")
        self.is_trained = False
        self.load_model()

    def train(self, df: pd.DataFrame, preprocessor: MLPreprocessor) -> Dict[str, Any]:
        """Trains GradientBoostingRegressor to predict final exam score."""
        X_scaled = preprocessor.transform(df)
        y = df["exam_score"].values

        self.model.fit(X_scaled, y)
        self.is_trained = True
        self.save_model()

        return {"status": "trained", "samples": len(df)}

    def predict_single(self, record: Dict[str, float], preprocessor: MLPreprocessor) -> float:
        """Predicts expected exam score clamped between 0 and 100."""
        df_single = pd.DataFrame([record])
        X_scaled = preprocessor.transform(df_single)

        if not self.is_trained:
            # Deterministic fallback estimation if model not yet fit
            prev = record.get("previous_marks", 70.0)
            att = record.get("attendance", 80.0)
            ass = record.get("assignment_score", 75.0)
            hrs = record.get("study_hours", 4.0)
            predicted = (prev * 0.4 + ass * 0.3 + (att / 100.0 * 20.0) + (hrs * 2.5))
            return float(round(np.clip(predicted, 0.0, 100.0), 1))

        raw_pred = self.model.predict(X_scaled)[0]
        clamped_score = round(float(np.clip(raw_pred, 0.0, 100.0)), 1)
        return clamped_score

    def save_model(self):
        joblib.dump(self.model, self.model_path)

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                self.is_trained = True
            except Exception:
                self.is_trained = False
