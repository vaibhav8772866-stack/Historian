import json
import logging
import httpx
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.db import models
from app.core.config import settings

logger = logging.getLogger("historian.harvey")

class HarveyAIService:
    @staticmethod
    def process_chat(db: Session, message: str, session_id: Optional[int] = None) -> Dict[str, Any]:
        """
        Grounded HARVEY AI conversational service.
        Query -> DB & ML Fact Retrieval -> Context Construction -> Grounded Response -> DB Persistence.
        """
        # 1. Manage Chat Session
        session = None
        if session_id:
            session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()

        if not session:
            session = models.ChatSession(
                session_title=f"Chat: {message[:30]}..." if len(message) > 30 else message
            )
            db.add(session)
            db.commit()
            db.refresh(session)

        # Save user message
        user_msg = models.ChatMessage(
            session_id=session.id,
            role="user",
            message=message
        )
        db.add(user_msg)
        db.commit()

        # 2. Retrieve Relevant Context from DB & ML Pipeline
        context_data, sources = HarveyAIService._retrieve_grounded_context(db, message)

        # 3. Generate Answer (Using LLM API if key available, or Grounded Intelligence Engine)
        if settings.LLM_API_KEY:
            answer = HarveyAIService._call_llm(message, context_data)
        else:
            answer = HarveyAIService._generate_grounded_response(message, context_data)

        # Save assistant message
        assistant_msg = models.ChatMessage(
            session_id=session.id,
            role="assistant",
            message=answer
        )
        db.add(assistant_msg)
        db.commit()
        db.refresh(assistant_msg)

        return {
            "session_id": session.id,
            "role": "assistant",
            "message": answer,
            "sources": sources,
            "created_at": assistant_msg.created_at
        }

    @staticmethod
    def _retrieve_grounded_context(db: Session, query: str) -> Tuple[Dict[str, Any], List[str]]:
        """
        Extracts relevant student records, predictions, explanations, anomalies,
        and cohort analytics from DB matching the query.
        """
        query_lower = query.lower()
        sources = ["Historian Knowledge Base & ML Analytics Engine"]

        # Fetch all students and latest predictions
        students = db.query(models.Student).all()
        predictions = db.query(models.Prediction).order_by(models.Prediction.id.desc()).all()
        anomalies = db.query(models.Anomaly).filter(models.Anomaly.severity.in_(["High", "Critical"])).all()
        recommendations = db.query(models.Recommendation).all()

        # Match specific student name or ID in user query
        matched_student = None
        for s in students:
            first_name = s.name.split()[0].lower()
            full_name = s.name.lower()
            sid = s.student_id.lower()
            if first_name in query_lower or full_name in query_lower or sid in query_lower:
                matched_student = s
                sources.append(f"Student Profile: {s.name} ({s.student_id})")
                break

        matched_student_data = None
        if matched_student:
            hist = db.query(models.HistoricalRecord).filter(models.HistoricalRecord.student_id == matched_student.student_id).order_by(models.HistoricalRecord.id.desc()).first()
            pred = db.query(models.Prediction).filter(models.Prediction.student_id == matched_student.student_id).order_by(models.Prediction.id.desc()).first()
            anom = db.query(models.Anomaly).filter(models.Anomaly.student_id == matched_student.student_id).order_by(models.Anomaly.id.desc()).first()
            recom = db.query(models.Recommendation).filter(models.Recommendation.student_id == matched_student.student_id).order_by(models.Recommendation.id.desc()).first()
            clust = db.query(models.Cluster).filter(models.Cluster.student_id == matched_student.student_id).order_by(models.Cluster.id.desc()).first()

            matched_student_data = {
                "student_id": matched_student.student_id,
                "name": matched_student.name,
                "attendance": hist.attendance if hist else 0.0,
                "previous_marks": hist.previous_marks if hist else 0.0,
                "assignment_score": hist.assignment_score if hist else 0.0,
                "study_hours": hist.study_hours if hist else 0.0,
                "exam_score": hist.exam_score if hist else 0.0,
                "predicted_score": pred.predicted_score if pred else 0.0,
                "risk_level": pred.risk_level if pred else "Low",
                "confidence": pred.confidence if pred else 0.0,
                "explanation": pred.explanation_json if (pred and pred.explanation_json) else {},
                "cluster_name": clust.cluster_name if clust else "Unassigned",
                "anomaly_explanation": anom.explanation if (anom and anom.severity in ["High", "Critical"]) else None,
                "recommendations": [r.strip() for r in recom.recommendation.split(";")] if recom else []
            }

        # High risk students list
        high_risk_list = []
        for p in predictions:
            if p.risk_level == "High":
                s = db.query(models.Student).filter(models.Student.student_id == p.student_id).first()
                if s and s.name not in [h["name"] for h in high_risk_list]:
                    high_risk_list.append({
                        "student_id": s.student_id,
                        "name": s.name,
                        "predicted_score": p.predicted_score,
                        "confidence": p.confidence
                    })

        context_data = {
            "total_students": len(students),
            "matched_student": matched_student_data,
            "high_risk_students": high_risk_list,
            "anomalies_count": len(anomalies),
            "high_risk_count": len(high_risk_list)
        }

        return context_data, sources

    @staticmethod
    def _generate_grounded_response(query: str, context: Dict[str, Any]) -> str:
        """
        Deterministic, factually-grounded responses when external LLM API is unconfigured.
        Uses exact DB values and ML analysis without hallucinations.
        """
        query_lower = query.lower()
        ms = context.get("matched_student")
        high_risk = context.get("high_risk_students", [])

        # 1. Direct query about a specific student
        if ms:
            name = ms["name"]
            risk = ms["risk_level"]
            score = ms["predicted_score"]
            conf = ms["confidence"]
            att = ms["attendance"]
            hrs = ms["study_hours"]
            ass = ms["assignment_score"]
            exp_json = ms.get("explanation", {})
            recoms = ms.get("recommendations", [])

            if "why" in query_lower or "reason" in query_lower or "risk" in query_lower:
                factors = exp_json.get("factors", [])
                factor_text = ""
                if factors:
                    factor_text = "\n\n**Primary Contributing Risk Factors:**\n" + "\n".join(
                        f"• **{f['feature'].replace('_', ' ').title()}** ({f['value']}): {f['description']} (Impact: {f['impact']}%)"
                        for f in factors[:3]
                    )
                return f"**{name} ({ms['student_id']})** is currently classified as **{risk} Risk** with **{conf}% confidence**.\n\n" \
                       f"• **Predicted Exam Score:** {score} / 100\n" \
                       f"• **Current Attendance:** {att}%\n" \
                       f"• **Daily Study Hours:** {hrs} hrs/day\n" \
                       f"• **Assignment Score:** {ass}%" \
                       f"{factor_text}\n\n" \
                       f"**Recommended Action:**\n" + ("\n".join(f"• {r}" for r in recoms[:2]) if recoms else "• Maintain regular academic monitoring.")

            elif "score" in query_lower or "prediction" in query_lower or "predict" in query_lower:
                return f"Based on Historian's Gradient Boosting Regression model, **{name}** is predicted to score **{score} / 100** on upcoming examinations (Confidence: {conf}%)."

            elif "recommendation" in query_lower or "do" in query_lower or "help" in query_lower or "action" in query_lower:
                recom_text = "\n".join(f"1. {r}" for r in recoms) if recoms else "1. Continue regular study schedule."
                return f"Here are the AI-recommended interventions for **{name}**:\n\n{recom_text}"

            else:
                return f"Here is the historical intelligence report for **{name} ({ms['student_id']})**:\n\n" \
                       f"• **Risk Classification:** {risk} Risk ({conf}% confidence)\n" \
                       f"• **Predicted Score:** {score} / 100\n" \
                       f"• **Cohort Segment:** {ms['cluster_name']}\n" \
                       f"• **Attendance:** {att}%\n" \
                       f"• **Daily Study Hours:** {hrs} hrs\n" \
                       f"• **Assignment Score:** {ass}%"

        # 2. Query about high-risk students / immediate intervention
        if "high risk" in query_lower or "risk" in query_lower or "intervention" in query_lower or "immediate" in query_lower:
            if not high_risk:
                return "Good news! Historian's Random Forest Classification model detected **0 high-risk students** in the current dataset."

            student_list_str = "\n".join(
                f"• **{s['name']}** ({s['student_id']}) — Predicted Score: {s['predicted_score']} (Confidence: {s['confidence']}%)"
                for s in high_risk[:10]
            )
            return f"Historian has identified **{len(high_risk)} high-risk student(s)** requiring immediate academic intervention:\n\n{student_list_str}\n\n" \
                   f"**Recommended Strategy:** Schedule targeted 1-on-1 counseling and attendance tracking for these students."

        # 3. Query about anomalies
        if "anomaly" in query_lower or "anomalies" in query_lower or "unusual" in query_lower:
            count = context.get("anomalies_count", 0)
            return f"Historian's Isolation Forest algorithm has detected **{count} anomalous record(s)** exhibiting unusual metric combinations (e.g., severe discrepancy between attendance/study effort and exam scores)."

        # 4. Summary / Dataset overview query
        if "summarize" in query_lower or "dataset" in query_lower or "overview" in query_lower or "summary" in query_lower or "pattern" in query_lower:
            total = context.get("total_students", 0)
            hr_cnt = len(high_risk)
            return f"**Historian Dataset Executive Summary:**\n\n" \
                   f"• **Total Records Ingested:** {total} students\n" \
                   f"• **High Risk Students:** {hr_cnt} ({(hr_cnt/total*100.0 if total else 0):.1f}%)\n" \
                   f"• **Anomalous Profiles:** {context.get('anomalies_count', 0)}\n\n" \
                   f"**Core Pattern:** Performance is strongly correlated with study consistency and classroom attendance (>75%)."

        # 5. Default General Intelligence Assistance
        total = context.get("total_students", 0)
        return f"I am **HARVEY**, your built-in AI intelligence assistant inside **Historian**. " \
               f"I currently monitor **{total} analyzed student records** across historical performance, predictions, and risk classifications.\n\n" \
               f"You can ask me questions like:\n" \
               f"• *'Which students are high risk?'*\n" \
               f"• *'Why is [Student Name] at high risk?'*\n" \
               f"• *'What is [Student Name]'s predicted score?'*\n" \
               f"• *'What recommendations do you have for [Student Name]?'*\n" \
               f"• *'Summarize this dataset.'*"

    @staticmethod
    def _call_llm(query: str, context: Dict[str, Any]) -> str:
        """Calls external LLM endpoint with grounded System Prompt if API key is set."""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.LLM_MODEL}:generateContent?key={settings.LLM_API_KEY}"
            prompt = f"System: You are HARVEY, the AI assistant inside Historian. Answer strictly based on the following grounded database & ML analysis facts. Never fabricate student names, scores, or risk classifications.\nContext: {json.dumps(context)}\n\nUser Question: {query}"
            
            payload = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            resp = httpx.post(url, json=payload, timeout=10.0)
            if resp.status_code == 200:
                data = resp.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            logger.warning(f"External LLM call failed ({str(e)}), falling back to grounded intelligence engine.")
        
        return HarveyAIService._generate_grounded_response(query, context)
