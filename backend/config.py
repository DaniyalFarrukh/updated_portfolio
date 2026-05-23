from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # ── Gemini ─────────────────────────────────────────────────────────────
    gemini_api_key: str
    gemini_model: str = "gemini-1.5-flash"          # swap to gemini-1.5-pro anytime

    # ── Embeddings ─────────────────────────────────────────────────────────
    embedding_model: str = "all-MiniLM-L6-v2"       # fast, free, no API key needed

    # ── RAG ────────────────────────────────────────────────────────────────
    chunk_size: int = 600
    chunk_overlap: int = 80
    top_k: int = 5                                   # retrieved chunks per query

    # ── Paths ──────────────────────────────────────────────────────────────
    data_dir: str = "data"
    faiss_index_path: str = "rag/vectordb/faiss_index"

    class Config:
        env_file = ".env"
        extra="allow"


@lru_cache
def get_settings() -> Settings:
    return Settings()
