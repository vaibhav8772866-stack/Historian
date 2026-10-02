from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db import models
from app.schemas.harvey import ChatRequest, ChatResponse, ChatSessionOut, ChatMessageOut
from app.services.harvey_service import HarveyAIService

router = APIRouter(tags=["HARVEY AI Assistant"])

@router.post("/harvey/chat", response_model=ChatResponse)
def chat_with_harvey(
    req: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    POST /api/v1/harvey/chat
    Interact with HARVEY AI Assistant.
    HARVEY uses grounded DB facts & ML predictions to answer user questions about student performance.
    """
    try:
        res = HarveyAIService.process_chat(db, req.message, session_id=req.session_id)
        return res
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "HARVEY_CHAT_ERROR", "message": f"HARVEY processing failed: {str(err)}"}
        )

@router.get("/harvey/conversations", response_model=List[ChatSessionOut])
def get_conversations(db: Session = Depends(get_db)):
    """
    GET /api/v1/harvey/conversations
    Returns list of all active chat sessions with message counts.
    """
    sessions = db.query(models.ChatSession).order_by(models.ChatSession.id.desc()).all()
    results = []
    for s in sessions:
        count = db.query(models.ChatMessage).filter(models.ChatMessage.session_id == s.id).count()
        results.append({
            "id": s.id,
            "session_title": s.session_title or f"Session {s.id}",
            "created_at": s.created_at,
            "message_count": count
        })
    return results

@router.get("/harvey/conversations/{session_id}", response_model=List[ChatMessageOut])
def get_conversation_messages(session_id: int, db: Session = Depends(get_db)):
    """
    GET /api/v1/harvey/conversations/{session_id}
    Returns complete message history for a given chat session.
    """
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SESSION_NOT_FOUND", "message": f"Chat session {session_id} not found."}
        )

    messages = db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.id.asc()).all()
    return messages

@router.delete("/harvey/conversations/{session_id}")
def delete_conversation(session_id: int, db: Session = Depends(get_db)):
    """
    DELETE /api/v1/harvey/conversations/{session_id}
    Deletes a chat session and its history.
    """
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SESSION_NOT_FOUND", "message": f"Chat session {session_id} not found."}
        )

    db.delete(session)
    db.commit()
    return {"success": True, "message": f"Chat session {session_id} deleted."}
