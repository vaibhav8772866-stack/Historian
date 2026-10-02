from typing import Dict, Any, List

class PredictionExplainer:
    @staticmethod
    def explain_prediction(record: Dict[str, float], risk_level: str, predicted_score: float) -> Dict[str, Any]:
        """
        Computes transparent feature-contribution explanations for model predictions.
        Answers 'WHY?' with human-readable factors and relative impact percentages.
        """
        att = record.get("attendance", 75.0)
        prev = record.get("previous_marks", 70.0)
        ass = record.get("assignment_score", 70.0)
        hrs = record.get("study_hours", 4.0)

        factors = []

        # Benchmark expectations
        att_gap = max(0.0, 85.0 - att)
        prev_gap = max(0.0, 75.0 - prev)
        ass_gap = max(0.0, 75.0 - ass)
        hrs_gap = max(0.0, 5.0 - hrs)

        total_gap = att_gap + prev_gap + ass_gap + (hrs_gap * 10.0)

        if total_gap > 0 and risk_level in ["High", "Medium"]:
            if att_gap > 0:
                impact = round((att_gap / total_gap) * 100.0)
                factors.append({
                    "feature": "attendance",
                    "value": att,
                    "impact": min(45, max(15, impact)),
                    "description": f"Attendance ({att:.1f}%) is below recommended 85% benchmark."
                })
            if hrs_gap > 0:
                impact = round(((hrs_gap * 10.0) / total_gap) * 100.0)
                factors.append({
                    "feature": "study_hours",
                    "value": hrs,
                    "impact": min(40, max(15, impact)),
                    "description": f"Daily study commitment ({hrs:.1f} hrs/day) is below 5 hours/day expectation."
                })
            if ass_gap > 0:
                impact = round((ass_gap / total_gap) * 100.0)
                factors.append({
                    "feature": "assignment_score",
                    "value": ass,
                    "impact": min(35, max(10, impact)),
                    "description": f"Assignment performance ({ass:.1f}%) indicates weak concept mastery."
                })
            if prev_gap > 0:
                impact = round((prev_gap / total_gap) * 100.0)
                factors.append({
                    "feature": "previous_marks",
                    "value": prev,
                    "impact": min(35, max(10, impact)),
                    "description": f"Previous academic foundation ({prev:.1f}%) trails cohort average."
                })
        else:
            # Low Risk / High Performing Student Explanations
            factors.append({
                "feature": "attendance",
                "value": att,
                "impact": 40,
                "description": f"Strong consistent attendance ({att:.1f}%) provides solid learning coverage."
            })
            factors.append({
                "feature": "study_hours",
                "value": hrs,
                "impact": 35,
                "description": f"High study discipline ({hrs:.1f} hrs/day) supports strong retention."
            })
            factors.append({
                "feature": "assignment_score",
                "value": ass,
                "impact": 25,
                "description": f"Solid assignment performance ({ass:.1f}%) reflects topic readiness."
            })

        # Normalize impacts to sum to 100
        sum_impacts = sum(f["impact"] for f in factors)
        if sum_impacts > 0:
            for f in factors:
                f["impact"] = int(round((f["impact"] / sum_impacts) * 100))

        # Sort factors by impact descending
        factors.sort(key=lambda x: x["impact"], reverse=True)

        return {
            "risk_level": risk_level,
            "predicted_score": predicted_score,
            "primary_reason": factors[0]["description"] if factors else "Standard performance trajectory.",
            "factors": factors
        }
