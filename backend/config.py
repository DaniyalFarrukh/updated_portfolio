from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── Groq ───────────────────────────────────────────────────────────────
    groq_api_key: str = ""
    groq_model: str = "llama3-8b-8192"

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