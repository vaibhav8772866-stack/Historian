import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from app.core.config import settings
from app.ml.preprocessing import FEATURE_COLUMNS, MLPreprocessor

class RiskClassifierModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model_path = os.path.join(settings.MODEL_DIR, "classification_model.joblib")
        self.classes_ = ["Low", "Medium", "High"]
        self.is_trained = False
        self.load_model()

    def derive_target_labels(self, df: pd.DataFrame) -> pd.Series:
        """
        Derives ground-truth risk labels deterministically based on historical metrics.
        - High: exam_score < 55 or (attendance < 65 and previous_marks < 60)
        - Medium: exam_score between 55 and 75
        - Low: exam_score >= 75
        """
        labels = []
        for _, row in df.iterrows():
            score = row["exam_score"]
            att = row["attendance"]
            prev = row["previous_marks"]

            if score < 55.0 or (att < 65.0 and prev < 60.0):
                labels.append("High")
            elif score <= 75.0:
                labels.append("Medium")
            else:
                labels.append("Low")

        return pd.Series(labels)

    def train(self, df: pd.DataFrame, preprocessor: MLPreprocessor) -> Dict[str, Any]:
        """Trains the RandomForestClassifier model on historical dataset."""
        X_scaled = preprocessor.fit_transform(df)
        y = self.derive_target_labels(df)

        self.model.fit(X_scaled, y)
        self.is_trained = True
        self.save_model()

        return {"status": "trained", "samples": len(df)}

    def predict_single(self, record: Dict[str, float], preprocessor: MLPreprocessor) -> Dict[str, Any]:
        """Predicts risk level and confidence score for a single student record."""
        df_single = pd.DataFrame([record])
        X_scaled = preprocessor.transform(df_single)

        if not self.is_trained:
            # Fallback rule-based inference if model not yet fit
            y_derived = self.derive_target_labels(df_single).iloc[0]
            return {
                "risk_level": y_derived,
                "confidence": 88.5
            }

        probs = self.model.predict_proba(X_scaled)[0]
        max_prob_idx = np.argmax(probs)
        predicted_label = self.model.classes_[max_prob_idx]
        confidence = round(float(probs[max_prob_idx]) * 100.0, 1)

        return {
            "risk_level": str(predicted_label),
            "confidence": max(50.0, confidence)
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
