from fastapi import APIRouter
from app.api.v1.endpoints import resume, assistant

api_router = APIRouter()

@api_router.get("/health", tags=["Health Check"])
async def health_check():
    return {
        "status": "healthy",
        "service": "AI-Resume-Analyzer API",
        "version": "1.0.0"
    }

api_router.include_router(resume.router, prefix="/resume", tags=["Resume Analysis"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["AI Assistant"])

