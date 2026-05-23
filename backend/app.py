"""
Daniyal's RAG Portfolio Assistant — FastAPI Backend
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router
from routes.health import router as health_router
from rag.vectordb.store import VectorStore

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Boot: build/load FAISS index once on startup."""
    logger.info("⚙  Loading vector store...")
    store = VectorStore.get_instance()
    store.load_or_build()
    logger.info("✅ Vector store ready.")
    yield
    logger.info("🔻 Shutting down.")


app = FastAPI(
    title="Portfolio RAG API",
    description="RAG-powered AI assistant for Daniyal's portfolio",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://updated-portfolio-smoky-chi.vercel.app",
        "http://localhost:3000",  # local dev
        "http://localhost:5173",  # Vite dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health_router)
app.include_router(chat_router, prefix="/api")
