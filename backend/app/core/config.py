from pydantic_settings import BaseSettings
from typing import List, Union
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Resume-Analyzer"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "ai_resume_analyzer_db"
    
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
