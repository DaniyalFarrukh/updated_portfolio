from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # ── Gemini ─────────────────────────────────────────────────────────────
    gemini_api_key: str
    gemini_model: str = "gemini-2.0-flash-lite"

    # ── Embeddings ─────────────────────────────────────────────────────────
    embedding_model: str = "all-MiniLM-L6-v2"

    # ── RAG ────────────────────────────────────────────────────────────────
    chunk_size: int = 600
    chunk_overlap: int = 80
    top_k: int = 2

    # ── Paths ──────────────────────────────────────────────────────────────
    data_dir: str = "data"
    faiss_index_path: str = "rag/vectordb/faiss_index"

    class Config:
        env_file = ".env"
        extra = "allow"


@lru_cache
def get_settings() -> Settings:
    return Settings()