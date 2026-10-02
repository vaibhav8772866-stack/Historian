import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Historian"
    TAGLINE: str = "Turn History Into Intelligence."
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database: Supports SQLite for local dev & PostgreSQL for production
    DATABASE_URL: str = "sqlite:///./historian.db"

    # CORS Configuration
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # LLM / HARVEY AI Assistant Credentials
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gemini-1.5-flash"

    # SMTP / Enterprise Email Configuration
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "noreply@historian.ai"
    EMAILS_FROM_NAME: str = "Historian AI"

    # Uploads & Model Artifact Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")
    MODEL_DIR: str = os.path.join(BASE_DIR, "models", "saved_models")
    REPORTS_DIR: str = os.path.join(BASE_DIR, "reports")
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.MODEL_DIR, exist_ok=True)
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
