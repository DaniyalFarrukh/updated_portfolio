"""
FAISS Vector Store
──────────────────
• On first run: ingests data/, builds FAISS index, saves to disk.
• On subsequent runs: loads saved index (fast).
• Singleton pattern — one instance per process.
"""
import os
import logging
from pathlib import Path
from typing import List, Optional

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

from rag.embeddings import get_embeddings
from rag.ingest import ingest
from config import get_settings

logger = logging.getLogger(__name__)


class VectorStore:
    _instance: Optional["VectorStore"] = None
    _db: Optional[FAISS] = None

    def __init__(self):
        self.settings = get_settings()
        self.index_path = Path(self.settings.faiss_index_path)

    @classmethod
    def get_instance(cls) -> "VectorStore":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_or_build(self):
        """Load existing index or build fresh from data/."""
        embeddings = get_embeddings()

        if self.index_path.exists():
            logger.info(f"📦 Loading FAISS index from {self.index_path}")
            self._db = FAISS.load_local(
                str(self.index_path),
                embeddings,
                allow_dangerous_deserialization=True,
            )
            logger.info("✅ FAISS index loaded from disk.")
        else:
            logger.info("🔨 Building FAISS index from scratch...")
            chunks = ingest()
            if not chunks:
                raise RuntimeError("No documents found in data/ — add your content files.")
            self._db = FAISS.from_documents(chunks, embeddings)
            self.index_path.mkdir(parents=True, exist_ok=True)
            self._db.save_local(str(self.index_path))
            logger.info(f"💾 FAISS index saved to {self.index_path}")

    def similarity_search(self, query: str, k: Optional[int] = None) -> List[Document]:
        if self._db is None:
            raise RuntimeError("Vector store not initialised. Call load_or_build() first.")
        k = k or self.settings.top_k
        return self._db.similarity_search(query, k=k)

    def rebuild(self):
        """Force rebuild — call this after updating data/."""
        import shutil
        if self.index_path.exists():
            shutil.rmtree(self.index_path)
        self._db = None
        self.load_or_build()
