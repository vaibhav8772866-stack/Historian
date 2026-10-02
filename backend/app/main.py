import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, Base
from app.api import (
    health, 
    upload, 
    analysis, 
    dashboard, 
    students, 
    predictions, 
    anomalies, 
    clusters, 
    recommendations, 
    harvey,
    employee
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("historian")

# Initialize DB tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"{settings.PROJECT_NAME} API — {settings.TAGLINE}",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup CORS Middleware
origins = settings.CORS_ORIGINS
if isinstance(origins, str):
    origins = [origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API Routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(analysis.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(predictions.router, prefix=settings.API_V1_STR)
app.include_router(anomalies.router, prefix=settings.API_V1_STR)
app.include_router(clusters.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(harvey.router, prefix=settings.API_V1_STR)
app.include_router(employee.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API Engine",
        "tagline": settings.TAGLINE,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
