"""
Run this ONCE locally (or in a CI step) to pre-build the FAISS index
before deploying, so the server starts instantly without re-ingesting.

Usage:
    pip install -r requirements.txt
    GEMINI_API_KEY=xxx python build_index.py
"""
import logging
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")

from rag.vectordb.store import VectorStore

if __name__ == "__main__":
    store = VectorStore.get_instance()
    store.rebuild()
    print("\n✅ FAISS index built and saved to rag/vectordb/faiss_index/")
    print("   Commit this folder to Git so Railway/Render uses it directly.")
