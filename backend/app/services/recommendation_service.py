from typing import Dict, Any, List

class RecommendationService:
    @staticmethod
    def generate_recommendations(record: Dict[str, float], risk_level: str, predicted_score: float) -> Dict[str, Any]:
        """
        Generates targeted, actionable recommendations based on actual detected student vulnerabilities.
        """
        att = record.get("attendance", 75.0)
        prev = record.get("previous_marks", 70.0)
        ass = record.get("assignment_score", 70.0)
        hrs = record.get("study_hours", 4.0)

        action_list = []
        reasons = []

        # Attendance check
        if att < 75.0:
            action_list.append("Increase attendance above 75% to ensure full classroom learning coverage.")
            reasons.append(f"Attendance is currently low ({att:.1f}%).")

        # Study hours check
        if hrs < 3.0:
            action_list.append("Increase study consistency to 3–4 hours/day with structured revision schedules.")
            reasons.append(f"Study hours are insufficient ({hrs:.1f} hrs/day).")

        # Assignment check
        if ass < 65.0:
            action_list.append("Focus on weak assignment topics and request targeted TA support for problem sets.")
            reasons.append(f"Assignment score is weak ({ass:.1f}%).")

        # Previous foundation check
        if prev < 60.0:
            action_list.append("Enroll in prerequisite refresher sessions for fundamental subject concepts.")
            reasons.append(f"Previous academic baseline is below standard ({prev:.1f}%).")

        # High risk check
        if risk_level == "High":
            action_list.append("Schedule immediate academic advisor intervention and 1-on-1 tutoring sessions.")
            reasons.append("Student is classified as HIGH RISK for course failure.")

        # Default high-performer recommendation if no issues detected
        if not action_list:
            action_list.append("Maintain current study regimen and participate in peer-mentorship / advanced problem solving.")
            reasons.append("Student demonstrates strong, consistent academic performance across all metrics.")
            priority = "Low"
        elif risk_level == "High" or att < 65.0:
            priority = "High"
        elif risk_level == "Medium" or att < 75.0:
            priority = "Medium"
        else:
            priority = "Low"

        return {
            "priority": priority,
            "recommendations": action_list,
            "reason": " ".join(reasons)
        }
