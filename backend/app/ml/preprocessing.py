import os
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from app.core.config import settings

FEATURE_COLUMNS = ["attendance", "previous_marks", "assignment_score", "study_hours"]

class MLPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.is_fitted = False
        self.scaler_path = os.path.join(settings.MODEL_DIR, "scaler.joblib")
        self.load_scaler()

    def fit_transform(self, df: pd.DataFrame) -> np.ndarray:
        """Fits scaler on feature columns and transforms data."""
        X = df[FEATURE_COLUMNS].copy()
        X_scaled = self.scaler.fit_transform(X)
        self.is_fitted = True
        self.save_scaler()
        return X_scaled

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        """Transforms feature columns using fitted scaler."""
        X = df[FEATURE_COLUMNS].copy()
        if not self.is_fitted:
            return self.fit_transform(df)
        return self.scaler.transform(X)

    def save_scaler(self):
        joblib.dump(self.scaler, self.scaler_path)

    def load_scaler(self):
        if os.path.exists(self.scaler_path):
            try:
                self.scaler = joblib.load(self.scaler_path)
                self.is_fitted = True
            except Exception:
                self.is_fitted = False
