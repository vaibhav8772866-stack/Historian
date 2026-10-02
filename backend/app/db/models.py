from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    created_at = Column(DateTime, default=datetime.utcnow)

    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    class_name = Column(String(100), nullable=True)
    semester = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    historical_records = relationship("HistoricalRecord", back_populates="student", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="student", cascade="all, delete-orphan")
    anomalies = relationship("Anomaly", back_populates="student", cascade="all, delete-orphan")
    clusters = relationship("Cluster", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="student", cascade="all, delete-orphan")


class HistoricalRecord(Base):
    __tablename__ = "historical_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(100), ForeignKey("students.student_id", ondelete="CASCADE"), index=True, nullable=False)
    attendance = Column(Float, nullable=False)        # 0 - 100
    previous_marks = Column(Float, nullable=False)    # 0 - 100
    assignment_score = Column(Float, nullable=False)  # 0 - 100
    study_hours = Column(Float, nullable=False)       # 0 - 24
    exam_score = Column(Float, nullable=False)        # 0 - 100
    record_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="historical_records")


class AnalysisRun(Base):
    __tablename__ = "analysis_runs"

    id = Column(Integer, primary_key=True, index=True)
    dataset_name = Column(String(255), nullable=False)
    records_count = Column(Integer, default=0)
    status = Column(String(50), default="pending")    # pending, completed, failed
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    model_version = Column(String(50), default="1.0.0")

    predictions = relationship("Prediction", back_populates="analysis_run", cascade="all, delete-orphan")
    anomalies = relationship("Anomaly", back_populates="analysis_run", cascade="all, delete-orphan")
    clusters = relationship("Cluster", back_populates="analysis_run", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="analysis_run", cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(100), ForeignKey("students.student_id", ondelete="CASCADE"), index=True, nullable=False)
    analysis_run_id = Column(Integer, ForeignKey("analysis_runs.id", ondelete="CASCADE"), index=True, nullable=False)
    predicted_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)   # Low, Medium, High
    confidence = Column(Float, nullable=False)        # Percentage (0 - 100)
    explanation_json = Column(JSON, nullable=True)     # Feature contribution breakdown
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="predictions")
    analysis_run = relationship("AnalysisRun", back_populates="predictions")


class Anomaly(Base):
    __tablename__ = "anomalies"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(100), ForeignKey("students.student_id", ondelete="CASCADE"), index=True, nullable=False)
    analysis_run_id = Column(Integer, ForeignKey("analysis_runs.id", ondelete="CASCADE"), index=True, nullable=False)
    anomaly_score = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False)     # Low, Medium, High, Critical
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="anomalies")
    analysis_run = relationship("AnalysisRun", back_populates="anomalies")


class Cluster(Base):
    __tablename__ = "clusters"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(100), ForeignKey("students.student_id", ondelete="CASCADE"), index=True, nullable=False)
    analysis_run_id = Column(Integer, ForeignKey("analysis_runs.id", ondelete="CASCADE"), index=True, nullable=False)
    cluster_id = Column(Integer, nullable=False)
    cluster_name = Column(String(100), nullable=False) # High Performers, Consistent Learners, Improving, Needs Attention

    student = relationship("Student", back_populates="clusters")
    analysis_run = relationship("AnalysisRun", back_populates="clusters")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(100), ForeignKey("students.student_id", ondelete="CASCADE"), index=True, nullable=False)
    analysis_run_id = Column(Integer, ForeignKey("analysis_runs.id", ondelete="CASCADE"), index=True, nullable=False)
    priority = Column(String(20), nullable=False)     # High, Medium, Low
    recommendation = Column(Text, nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="recommendations")
    analysis_run = relationship("AnalysisRun", back_populates="recommendations")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    session_title = Column(String(255), default="HARVEY Chat Session")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id", ondelete="CASCADE"), index=True, nullable=False)
    role = Column(String(20), nullable=False)          # user, assistant
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")
