"""
Chat Routes
───────────
POST /api/chat         → streaming SSE response
POST /api/chat/sync    → non-streaming (simpler clients)
POST /api/rebuild      → force rebuild FAISS index (protected)
"""
import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from rag.query import stream_answer, get_answer
from rag.vectordb.store import VectorStore
from config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Request / Response Models ─────────────────────────────────────────────────

class HistoryMessage(BaseModel):
    role: str   # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: List[HistoryMessage] = Field(default_factory=list)

class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = None


# ── Streaming endpoint ────────────────────────────────────────────────────────

@router.post("/chat")
async def chat_stream(req: ChatRequest):
    """
    Server-Sent Events streaming endpoint.
    Frontend reads via EventSource or fetch with ReadableStream.
    """
    history = [m.model_dump() for m in req.history[-10:]]  # cap at last 10 turns

    async def event_generator():
        try:
            async for token in stream_answer(req.message, history):
                # SSE format: "data: <token>\n\n"
                yield f"data: {token}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # disable Nginx buffering
        },
    )


# ── Non-streaming endpoint (simpler) ─────────────────────────────────────────

@router.post("/chat/sync", response_model=ChatResponse)
async def chat_sync(req: ChatRequest):
    """Simple non-streaming endpoint. Returns full response at once."""
    try:
        history = [m.model_dump() for m in req.history[-10:]]
        answer = await get_answer(req.message, history)
        return ChatResponse(response=answer)
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── Admin: rebuild index ──────────────────────────────────────────────────────

@router.post("/rebuild")
async def rebuild_index(x_admin_key: Optional[str] = Header(None)):
    """
    Force-rebuild the FAISS index.
    Protect with X-Admin-Key header in production.
    """
    settings = get_settings()
    admin_key = getattr(settings, "admin_key", None)

    if admin_key and x_admin_key != admin_key:
        raise HTTPException(status_code=403, detail="Invalid admin key")

    try:
        store = VectorStore.get_instance()
        store.rebuild()
        return {"status": "ok", "message": "Index rebuilt successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
