from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@router.get("/")
async def root():
    return {"message": "Daniyal's Portfolio RAG API", "docs": "/docs"}
