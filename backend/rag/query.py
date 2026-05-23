"""
RAG Query Engine
────────────────
Retrieves top-k chunks from FAISS, injects them into the prompt,
then streams the Gemini response token-by-token.
"""
import logging
from typing import AsyncGenerator, List

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage

from rag.vectordb.store import VectorStore
from rag.prompts import RAG_PROMPT
from config import get_settings

logger = logging.getLogger(__name__)


def _build_llm(streaming: bool = True) -> ChatGoogleGenerativeAI:
    settings = get_settings()
    return ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        google_api_key=settings.gemini_api_key,
        streaming=streaming,
        temperature=0.2,          # low temp = factual, grounded answers
        convert_system_message_to_human=True,  # Gemini requirement
    )


def _format_history(history: List[dict]) -> list:
    """Convert frontend history [{role, content}] → LangChain message objects."""
    messages = []
    for msg in history:
        if msg["role"] == "user":
            messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            messages.append(AIMessage(content=msg["content"]))
    return messages


def _retrieve_context(question: str) -> tuple[str, List[str]]:
    """Run similarity search and format context string + source list."""
    store = VectorStore.get_instance()
    docs = store.similarity_search(question)

    context_parts = []
    sources = []
    for i, doc in enumerate(docs, 1):
        source = doc.metadata.get("source", "unknown")
        context_parts.append(f"[{i}] (source: {source})\n{doc.page_content}")
        if source not in sources:
            sources.append(source)

    context = "\n\n---\n\n".join(context_parts)
    return context, sources


async def stream_answer(question: str, history: List[dict]) -> AsyncGenerator[str, None]:
    """
    Full RAG pipeline with streaming.
    Yields text tokens as they arrive from Gemini.
    """
    logger.info(f"🔍 Query: {question[:80]}...")

    # 1. Retrieve
    context, sources = _retrieve_context(question)
    logger.info(f"📚 Retrieved context from: {sources}")

    # 2. Build prompt
    lc_history = _format_history(history)
    prompt_value = RAG_PROMPT.format_messages(
        context=context,
        history=lc_history,
        question=question,
    )

    # 3. Stream from Gemini
    llm = _build_llm(streaming=True)
    async for chunk in llm.astream(prompt_value):
        if chunk.content:
            yield chunk.content

    # 4. Yield sources as a trailing metadata token
    if sources:
        sources_md = "\n\n---\n*Sources: " + ", ".join(f"`{s}`" for s in sources) + "*"
        yield sources_md


async def get_answer(question: str, history: List[dict]) -> str:
    """Non-streaming version — returns full answer string."""
    context, sources = _retrieve_context(question)
    lc_history = _format_history(history)
    prompt_value = RAG_PROMPT.format_messages(
        context=context,
        history=lc_history,
        question=question,
    )
    llm = _build_llm(streaming=False)
    response = await llm.ainvoke(prompt_value)
    answer = response.content
    if sources:
        answer += "\n\n---\n*Sources: " + ", ".join(f"`{s}`" for s in sources) + "*"
    return answer
