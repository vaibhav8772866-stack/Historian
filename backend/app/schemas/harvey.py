from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User question or query for HARVEY AI")
    session_id: Optional[int] = Field(None, description="Optional existing chat session ID")

class ChatResponse(BaseModel):
    session_id: int
    role: str = "assistant"
    message: str
    sources: List[str] = []
    created_at: datetime

class ChatMessageOut(BaseModel):
    id: int
    session_id: int
    role: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionOut(BaseModel):
    id: int
    session_title: str
    created_at: datetime
    message_count: int = 0

    class Config:
        from_attributes = True
