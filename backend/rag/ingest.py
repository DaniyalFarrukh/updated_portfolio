import os
import logging
from pathlib import Path
from typing import List

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _load_file(path: Path) -> List[Document]:
    ext = path.suffix.lower()
    try:
        if ext == ".pdf":
            loader = PyPDFLoader(str(path))
        elif ext in (".md", ".txt"):
            loader = TextLoader(str(path), encoding="utf-8")
        else:
            logger.warning(f"Skipping unsupported file: {path.name}")
            return []
        docs = loader.load()
        for doc in docs:
            doc.metadata["source"] = path.name
        logger.info(f"  Loaded {len(docs)} section(s) from {path.name}")
        return docs
    except Exception as e:
        logger.error(f"  Failed to load {path.name}: {e}")
        return []


def load_documents() -> List[Document]:
    data_dir = Path(settings.data_dir)
    if not data_dir.exists():
        raise FileNotFoundError(f"Data directory not found: {data_dir}")
    all_docs: List[Document] = []
    for f in data_dir.iterdir():
        if f.is_file():
            all_docs.extend(_load_file(f))
    logger.info(f"Total sections loaded: {len(all_docs)}")
    return all_docs


def chunk_documents(docs: List[Document]) -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_documents(docs)
    logger.info(f"Total chunks: {len(chunks)}")
    return chunks


def ingest() -> List[Document]:
    return chunk_documents(load_documents())