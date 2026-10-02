import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.cluster import KMeans
from app.core.config import settings
from app.ml.preprocessing import FEATURE_COLUMNS, MLPreprocessor

CLUSTER_NAMES = [
    "High Performers",
    "Consistent Learners",
    "Improving",
    "Needs Attention"
]

class StudentClustererModel:
    def __init__(self, n_clusters: int = 4):
        self.n_clusters = n_clusters
        self.model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        self.model_path = os.path.join(settings.MODEL_DIR, "cluster_model.joblib")
        self.cluster_map_path = os.path.join(settings.MODEL_DIR, "cluster_map.joblib")
        self.cluster_name_map = {}
        self.is_trained = False
        self.load_model()

    def train(self, df: pd.DataFrame, preprocessor: MLPreprocessor) -> Dict[str, Any]:
        """Fits KMeans model and computes dynamic cluster names from centroids."""
        X_scaled = preprocessor.transform(df)
        labels = self.model.fit_predict(X_scaled)
        
        # Calculate cluster centroids in unscaled feature space to assign canonical names
        df_temp = df.copy()
        df_temp["cluster_raw"] = labels
        
        centroids = df_temp.groupby("cluster_raw")[FEATURE_COLUMNS].mean()

        # Score clusters based on composite performance rank
        cluster_scores = {}
        for cid in range(self.n_clusters):
            if cid in centroids.index:
                row = centroids.loc[cid]
                score = (row["previous_marks"] * 0.35 + 
                         row["assignment_score"] * 0.25 + 
                         row["attendance"] * 0.25 + 
                         row["study_hours"] * 3.0)
                cluster_scores[cid] = score
            else:
                cluster_scores[cid] = 0.0

        # Sort cluster IDs by score descending
        sorted_cids = sorted(cluster_scores.keys(), key=lambda c: cluster_scores[c], reverse=True)
        
        # Map sorted clusters to canonical names
        self.cluster_name_map = {}
        for rank, cid in enumerate(sorted_cids):
            if rank < len(CLUSTER_NAMES):
                self.cluster_name_map[cid] = CLUSTER_NAMES[rank]
            else:
                self.cluster_name_map[cid] = f"Cluster {cid + 1}"

        self.is_trained = True
        self.save_model()

        return {"status": "trained", "cluster_names": self.cluster_name_map}

    def predict_single(self, record: Dict[str, float], preprocessor: MLPreprocessor) -> Dict[str, Any]:
        """Assigns cluster ID and cluster name for a single record."""
        df_single = pd.DataFrame([record])
        X_scaled = preprocessor.transform(df_single)

        if not self.is_trained:
            # Rule-based fallback if model not trained yet
            score = record.get("previous_marks", 50.0) * 0.4 + record.get("attendance", 50.0) * 0.4 + record.get("study_hours", 2.0) * 4.0
            if score >= 80.0:
                cid, name = 0, "High Performers"
            elif score >= 65.0:
                cid, name = 1, "Consistent Learners"
            elif score >= 50.0:
                cid, name = 2, "Improving"
            else:
                cid, name = 3, "Needs Attention"
            return {"cluster_id": cid, "cluster_name": name}

        raw_cid = int(self.model.predict(X_scaled)[0])
        cluster_name = self.cluster_name_map.get(raw_cid, CLUSTER_NAMES[raw_cid % len(CLUSTER_NAMES)])
        return {"cluster_id": raw_cid, "cluster_name": cluster_name}

    def save_model(self):
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.cluster_name_map, self.cluster_map_path)

    def load_model(self):
        if os.path.exists(self.model_path) and os.path.exists(self.cluster_map_path):
            try:
                self.model = joblib.load(self.model_path)
                self.cluster_name_map = joblib.load(self.cluster_map_path)
                self.is_trained = True
            except Exception:
                self.is_trained = False
