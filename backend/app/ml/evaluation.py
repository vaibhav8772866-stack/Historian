from typing import Dict, Any
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, mean_absolute_error, mean_squared_error, r2_score

class MLEvaluator:
    @staticmethod
    def evaluate_classification(y_true, y_pred) -> Dict[str, Any]:
        """Calculates classification evaluation metrics."""
        if len(y_true) < 5:
            return {"status": "Evaluation unavailable: insufficient labeled historical records."}

        return {
            "accuracy": round(float(accuracy_score(y_true, y_pred)) * 100.0, 2),
            "precision": round(float(precision_score(y_true, y_pred, average="weighted", zero_division=0)) * 100.0, 2),
            "recall": round(float(recall_score(y_true, y_pred, average="weighted", zero_division=0)) * 100.0, 2),
            "f1_score": round(float(f1_score(y_true, y_pred, average="weighted", zero_division=0)) * 100.0, 2)
        }

    @staticmethod
    def evaluate_regression(y_true, y_pred) -> Dict[str, Any]:
        """Calculates regression evaluation metrics."""
        if len(y_true) < 5:
            return {"status": "Evaluation unavailable: insufficient labeled historical records."}

        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        r2 = r2_score(y_true, y_pred)

        return {
            "mae": round(float(mae), 2),
            "rmse": round(float(rmse), 2),
            "r2_score": round(float(r2), 3)
        }
