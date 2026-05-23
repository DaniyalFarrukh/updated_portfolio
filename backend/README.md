# 🤖 Portfolio RAG Assistant — Backend

A production-ready RAG (Retrieval-Augmented Generation) API that powers Daniyal's portfolio chatbot.  
Fully online — no local machine dependency after deployment.

---

## Architecture

```
Vercel (Frontend React)
    │
    │  POST /api/chat  (SSE streaming)
    ▼
Railway / Render (FastAPI Backend)
    │
    ├── LangChain RAG Pipeline
    ├── FAISS Vector Store (bundled in repo)
    ├── sentence-transformers (free embeddings, no API key)
    └── Gemini API (Google AI Studio — free tier)
```

---

## Directory Structure

```
backend/
├── app.py                  # FastAPI entry point
├── config.py               # Settings via pydantic-settings
├── build_index.py          # Run once to pre-build FAISS index
├── requirements.txt
├── Procfile                # Railway/Render start command
├── render.yaml             # Render deployment config
├── railway.toml            # Railway deployment config
├── .env.example            # Backend env vars template
├── .env.frontend.example   # Frontend env vars template
│
├── data/                   # ← YOUR KNOWLEDGE BASE (edit these)
│   ├── about.txt
│   ├── resume.md           # Or drop resume.pdf here
│   ├── skills.md
│   ├── projects.md
│   └── contact.txt
│
├── rag/
│   ├── embeddings.py       # HuggingFace sentence-transformers
│   ├── ingest.py           # Load + chunk all files in data/
│   ├── prompts.py          # System prompt + RAG prompt template
│   ├── query.py            # Retrieval + Gemini streaming
│   └── vectordb/
│       ├── store.py        # FAISS singleton (load/build/rebuild)
│       └── faiss_index/    # ← Generated, commit this to Git
│
└── routes/
    ├── chat.py             # POST /api/chat (SSE), /api/chat/sync, /api/rebuild
    └── health.py           # GET /health, GET /
```

---

## Step-by-Step Deployment

### Step 1 — Get a Gemini API Key (free)
1. Go to https://aistudio.google.com/app/apikey
2. Create an API key — free tier includes generous limits

---

### Step 2 — Fill Your Knowledge Base

Edit the files in `data/`:
- `about.txt` — who you are
- `resume.md` — or drop `resume.pdf` directly
- `skills.md` — your tech stack
- `projects.md` — your projects
- `contact.txt` — how to reach you

You can also add:
- GitHub README files (copy/paste as `.md` files)
- Certification files as `.txt`
- Any `.pdf`, `.md`, or `.txt` file is auto-ingested

---

### Step 3 — Build the FAISS Index Locally

```bash
cd backend
pip install -r requirements.txt

# Create .env
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Build the index
python build_index.py
```

This creates `rag/vectordb/faiss_index/`. **Commit this folder to Git.**

```bash
git add rag/vectordb/faiss_index/
git commit -m "Add FAISS index"
git push
```

---

### Step 4A — Deploy to Railway (Recommended)

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select your repo, set root directory to `backend/`
3. Add environment variable:
   ```
   GEMINI_API_KEY = your_key_here
   ```
4. Railway auto-detects `Procfile` and deploys
5. Copy your Railway URL (e.g. `https://your-app.railway.app`)

---

### Step 4B — Deploy to Render (Alternative)

1. Go to https://render.com → New Web Service → Connect GitHub
2. Root directory: `backend/`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Add env var: `GEMINI_API_KEY = your_key_here`
6. The `render.yaml` file configures a persistent disk for the FAISS index

---

### Step 5 — Connect Frontend (Vercel)

In your Vercel project dashboard → Settings → Environment Variables, add:
```
VITE_RAG_API_URL = https://your-app.railway.app
```

Then replace your old `ChatAssistant.tsx` with the new one provided.

Install the two new frontend dependencies:
```bash
npm install react-markdown remark-gfm
```

Redeploy on Vercel (or it auto-deploys on push).

---

### Step 6 — Test It

```bash
# Health check
curl https://your-app.railway.app/health

# Test chat
curl -X POST https://your-app.railway.app/api/chat/sync \
  -H "Content-Type: application/json" \
  -d '{"message": "What projects has Daniyal built?", "history": []}'
```

---

## Updating Your Knowledge Base

When you add/edit files in `data/`:

```bash
# Option A: Rebuild locally and push
python build_index.py
git add rag/vectordb/faiss_index/
git commit -m "Update knowledge base"
git push
# Railway/Render auto-redeploys

# Option B: Trigger rebuild via API (no redeploy needed)
curl -X POST https://your-app.railway.app/api/rebuild \
  -H "X-Admin-Key: your_admin_key"
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | — | Google AI Studio key |
| `GEMINI_MODEL` | No | `gemini-1.5-flash` | Swap to `gemini-1.5-pro` for better quality |
| `EMBEDDING_MODEL` | No | `all-MiniLM-L6-v2` | sentence-transformers model |
| `TOP_K` | No | `5` | Number of chunks retrieved per query |
| `CHUNK_SIZE` | No | `600` | Characters per chunk |
| `CHUNK_OVERLAP` | No | `80` | Overlap between chunks |
| `ADMIN_KEY` | No | — | Protects `/api/rebuild` endpoint |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/` | API info |
| `POST` | `/api/chat` | Streaming SSE chat (production) |
| `POST` | `/api/chat/sync` | Non-streaming chat (testing) |
| `POST` | `/api/rebuild` | Force rebuild FAISS index |
| `GET` | `/docs` | Auto-generated Swagger UI |

---

## Swapping the LLM Provider

In `rag/query.py`, replace `ChatGoogleGenerativeAI` with any LangChain-compatible LLM:

```python
# OpenAI
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini", streaming=True)

# Anthropic
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-3-haiku-20240307", streaming=True)
```

No other changes needed.
