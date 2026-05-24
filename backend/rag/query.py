import logging
from typing import AsyncGenerator, List
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage
from rag.vectordb.store import VectorStore
from rag.prompts import RAG_PROMPT
from config import get_settings

logger = logging.getLogger(__name__)


def _build_llm(streaming: bool = True) -> ChatGroq:
    settings = get_settings()
    return ChatGroq(
        model="llama3-8b-8192",
        api_key=settings.groq_api_key,
        streaming=streaming,
        temperature=0.1,
        max_tokens=512,
    )


def _format_history(history: List[dict]) -> list:
    messages = []
    for msg in history[-4:]:
        if msg["role"] == "user":
            messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            messages.append(AIMessage(content=msg["content"]))
    return messages


def _retrieve_context(question: str) -> tuple[str, List[str]]:
    store = VectorStore.get_instance()
    docs = store.similarity_search(question)
    context_parts = []
    sources = []
    for i, doc in enumerate(docs, 1):
        source = doc.metadata.get("source", "unknown")
        content = doc.page_content[:300]
        context_parts.append(f"[{i}] {content}")
        if source not in sources:
            sources.append(source)
    context = "\n\n".join(context_parts)
    return context, sources


async def stream_answer(question: str, history: List[dict]) -> AsyncGenerator[str, None]:
    logger.info(f"🔍 Query: {question[:80]}...")
    context, sources = _retrieve_context(question)
    lc_history = _format_history(history)
    prompt_value = RAG_PROMPT.format_messages(
        context=context,
        history=lc_history,
        question=question,
    )
    llm = _build_llm(streaming=True)
    async for chunk in llm.astream(prompt_value):
        if chunk.content:
            yield chunk.content


async def get_answer(question: str, history: List[dict]) -> str:
    context, sources = _retrieve_context(question)
    lc_history = _format_history(history)
    prompt_value = RAG_PROMPT.format_messages(
        context=context,
        history=lc_history,
        question=question,
    )
    llm = _build_llm(streaming=False)
    response = await llm.ainvoke(prompt_value)
    return response.content