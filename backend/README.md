# Historian Backend

> **Tagline**: "Turn History Into Intelligence."

Historian transforms historical records into explainable predictions and actionable decisions.

---

## 🏛️ System Architecture

```text
PDF / Historical Records
         ↓
Extract & Parse (pypdf)
         ↓
Validate & Clean Data
         ↓
Feature Engineering
         ↓
Scikit-learn Analytics Engine
┌──────────────────────────────┬──────────────────────────────┐
│ Classification (RandomForest) │ Regression (GradientBoost)   │
│ Clustering (KMeans)          │ Anomaly (IsolationForest)    │
└──────────────────────────────┴──────────────────────────────┘
         ↓
Explainability & Recommendation Engine
         ↓
PostgreSQL / SQLite Database
         ↓
HARVEY Conversational Intelligence AI
```

---

## 🛠️ Tech Stack

- **Framework**: FastAPI (Python 3.x)
- **Database**: PostgreSQL / SQLite fallback via SQLAlchemy
- **Data & Math**: Pandas, NumPy
- **Machine Learning**: Scikit-learn (RandomForest, GradientBoosting, KMeans, IsolationForest), Joblib
- **PDF Extraction**: PyPDF

---

## 🚀 Phase 1 Installation & Execution

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Run FastAPI Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Health Verification
Visit `http://localhost:8000/api/v1/health` or `http://localhost:8000/docs` in your browser.
