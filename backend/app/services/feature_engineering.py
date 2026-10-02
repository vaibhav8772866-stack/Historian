import pandas as pd
import numpy as np

class FeatureEngineeringService:
    @staticmethod
    def generate_features(df: pd.DataFrame) -> pd.DataFrame:
        """
        Creates deterministic, explainable derived features for Machine Learning models.
        """
        df_feat = df.copy()

        # 1. Overall Performance Average (0 - 100)
        df_feat["performance_average"] = (
            df_feat["previous_marks"] * 0.3 + 
            df_feat["assignment_score"] * 0.3 + 
            df_feat["exam_score"] * 0.4
        ).round(2)

        # 2. Attendance Risk Flag (1.0 if attendance < 75%, else 0.0)
        df_feat["attendance_risk"] = (df_feat["attendance"] < 75.0).astype(float)

        # 3. Study Consistency Ratio (0.0 to 1.0+)
        df_feat["study_consistency"] = (df_feat["study_hours"] / 8.0).clip(0.0, 1.5).round(2)

        # 4. Assignment Strength (0.0 to 1.0)
        df_feat["assignment_strength"] = (df_feat["assignment_score"] / 100.0).round(2)

        # 5. Academic Trend (Positive = Improving, Negative = Declining)
        df_feat["academic_trend"] = (df_feat["exam_score"] - df_feat["previous_marks"]).round(2)

        return df_feat
