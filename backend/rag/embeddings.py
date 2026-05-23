"""
Embeddings — uses sentence-transformers (free, runs on CPU, no API key).
Singleton so the model loads once per process.
"""
from functools import lru_cache
from langchain_community.embeddings import HuggingFaceEmbeddings
from config import get_settings


@lru_cache(maxsize=1)
def get_embeddings() -> HuggingFaceEmbeddings:
    settings = get_settings()
    return HuggingFaceEmbeddings(
        model_name=settings.embedding_model,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )
