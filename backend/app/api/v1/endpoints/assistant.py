from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.services.assistant_service import AssistantService

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    suggested_followups: List[str]
    timestamp: str

@router.post("/chat", response_model=ChatResponse, summary="Chat with AI Resume Assistant")
async def chat_with_assistant(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    
    try:
        result = AssistantService.generate_response(request.message, request.context)
        return {
            "response": result["response"],
            "suggested_followups": result.get("suggested_followups", []),
            "timestamp": datetime.now().strftime("%H:%M:%S")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant processing error: {str(e)}")
