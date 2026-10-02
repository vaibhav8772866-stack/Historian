import pandas as pd
import numpy as np
from typing import Tuple, List, Dict, Any

class DataCleanerService:
    @staticmethod
    def clean_and_validate(df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str], List[str], float]:
        """
        Cleans and validates student historical record dataframe.
        Returns (cleaned_df, warnings, errors, quality_score).
        """
        warnings = []
        errors = []
        df_clean = df.copy()

        initial_count = len(df_clean)
        if initial_count == 0:
            return df_clean, warnings, ["DataFrame is empty."], 0.0

        # 1. Clean string fields
        df_clean["student_id"] = df_clean["student_id"].astype(str).str.strip()
        df_clean["name"] = df_clean["name"].astype(str).str.strip()

        # 2. Remove duplicates by student_id
        dup_count = df_clean.duplicated(subset=["student_id"]).sum()
        if dup_count > 0:
            warnings.append(f"Removed {dup_count} duplicate student_id records.")
            df_clean = df_clean.drop_duplicates(subset=["student_id"], keep="last")

        # 3. Numeric Conversions
        numeric_cols = {
            "attendance": (0.0, 100.0),
            "previous_marks": (0.0, 100.0),
            "assignment_score": (0.0, 100.0),
            "study_hours": (0.0, 24.0),
            "exam_score": (0.0, 100.0)
        }

        invalid_rows_to_drop = set()

        for col, (min_val, max_val) in numeric_cols.items():
            # Convert to numeric, coercion to NaN
            df_clean[col] = pd.to_numeric(df_clean[col], errors="coerce")

            # Check for NaNs
            nan_mask = df_clean[col].isna()
            if nan_mask.any():
                nan_ids = df_clean.loc[nan_mask, "student_id"].tolist()
                warnings.append(f"Column '{col}' contained missing or non-numeric values for students: {nan_ids[:5]}. Imputed with column median.")
                # Impute NaN with median or mean
                median_val = df_clean[col].median()
                if pd.isna(median_val):
                    median_val = (min_val + max_val) / 2.0
                df_clean[col] = df_clean[col].fillna(median_val)

            # Range validation
            out_of_bounds = (df_clean[col] < min_val) | (df_clean[col] > max_val)
            if out_of_bounds.any():
                invalid_ids = df_clean.loc[out_of_bounds, "student_id"].tolist()
                warnings.append(f"Value out of bounds for '{col}' (range {min_val}-{max_val}) for students: {invalid_ids[:5]}. Clipped values.")
                df_clean[col] = df_clean[col].clip(lower=min_val, upper=max_val)

        # 4. Optional metadata fields
        if "class_name" not in df_clean.columns:
            df_clean["class_name"] = "Class A"
        else:
            df_clean["class_name"] = df_clean["class_name"].fillna("Class A")

        if "semester" not in df_clean.columns:
            df_clean["semester"] = "Semester 1"
        else:
            df_clean["semester"] = df_clean["semester"].fillna("Semester 1")

        # 5. Data Quality Score calculation
        quality_score = 100.0
        if dup_count > 0:
            quality_score -= min(20.0, dup_count * 2.0)
        if len(warnings) > 0:
            quality_score -= min(15.0, len(warnings) * 3.0)

        quality_score = max(0.0, min(100.0, round(quality_score, 1)))

        return df_clean, warnings, errors, quality_score
