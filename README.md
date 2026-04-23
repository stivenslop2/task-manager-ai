# Task Manager AI

A production-style task manager that showcases the patterns I reach for when building LLM features: streaming text, tool-calling agents, structured outputs, and retrieval-augmented search over user data.

Built on Next.js 16 (App Router) with the Vercel AI SDK v6, Supabase + `pgvector`, and Tailwind v4.

> **Portfolio project** — Julian Lopez · AI Engineer

---

## AI techniques demonstrated

| Technique | What it does here | Where to look |
| --- | --- | --- |
| **Streaming text generation** | Token-by-token "Generate steps" button on the task detail page. Uses `streamText` + `toUIMessageStreamResponse` and a hand-rolled SSE reader to demonstrate both sides of the wire. | `app/api/describe-task/route.ts`, `features/ai/stream.ts`, `features/ai/components/AiStepsButton.tsx` |
| **Tool calling (agentic chat)** | Multi-step chat assistant that searches, reads, creates, and summarizes tasks. `stepCountIs(5)` caps the agent loop. | `app/api/chat/route.ts`, `features/chat/components/Chat.tsx` |
| **Structured outputs with Zod** | Two endpoints return schema-validated JSON: task classification (category/difficulty/tags/deadline) and a full task-list analysis (priority task + recommendations + score). | `app/api/classify-task/route.ts`, `features/ai/analysis.ts` |
| **RAG with pgvector** | Semantic search over tasks. On insert, the title+description is embedded with `text-embedding-3-small` (1536-dim) and stored alongside the row; the chat agent's `searchTasks` tool calls a Postgres function (`match_tm_tasks`) that ranks by cosine similarity. | `lib/embeddings.ts`, `features/tasks/store.ts`, `app/api/chat/route.ts` |

---

## Stack

| Area | Choice |
| --- | --- |
| Framework | **Next.js 16.2** (App Router, Turbopack, Server Actions, Route Handlers, Suspense streaming) |
| Runtime | React 19, TypeScript 5 |
| AI | Vercel AI SDK `ai` v6 + `@ai-sdk/openai` (`@ai-sdk/anthropic` installed as a drop-in alternative) |
| Persistence | Supabase Postgres + `pgvector` extension |
| Styling | Tailwind CSS 4 with `@theme` tokens (white surface + orange brand) |
| Tooling | ESLint 9 |

---

## Architecture

```
             ┌───────────────────────────────┐
  Client ──► │  Server Component / Client    │ ──► Server Action ──► features/tasks/store.ts
             │  (app/ routes, features/)     │
             └──────────────┬────────────────┘
                            │ streams / JSON
                            ▼
                   Route Handlers (app/api/*)
                            │
                            ▼
                   Vercel AI SDK (streamText,
                   generateText + Output.object,
                   embed, tools)
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
         OpenAI API              Supabase Postgres
      (gpt-4o-mini,              (tm_tasks +
       text-embedding-3-small)    pgvector +
                                  match_tm_tasks RPC)
```

All data access flows through `features/tasks/store.ts`. Routes never touch Supabase directly.

---

## Setup

### 1. Install

```bash
npm install
cp .env.example .env.local
# Fill in OPENAI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY
npm run dev
```

Then open http://localhost:3000.

### 2. Supabase schema

Enable the `vector` extension, create the tasks table, and create the similarity-search RPC:

```sql
-- Enable pgvector (once per project)
create extension if not exists vector;

-- Tasks table
create table tm_tasks (
  id           bigserial primary key,
  title        text not null,
  description  text not null default '',
  completed    boolean not null default false,
  embedding    vector(1536),
  created_at   timestamptz not null default now()
);

-- Approximate-nearest-neighbor index for cosine distance
create index on tm_tasks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Semantic search function used by the chat agent's `searchTasks` tool
create or replace function match_tm_tasks (
  query_embedding vector(1536),
  match_threshold float,
  match_count     int
)
returns table (
  id          bigint,
  title       text,
  description text,
  completed   boolean,
  created_at  timestamptz,
  similarity  float
)
language sql stable
as $$
  select
    id, title, description, completed, created_at,
    1 - (embedding <=> query_embedding) as similarity
  from tm_tasks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the project |

---

## Project layout

```
app/
  layout.tsx, globals.css
  page.tsx                          # Home (feature grid)
  api/
    describe-task/route.ts          # POST — streaming text
    classify-task/route.ts          # POST — structured output (classification)
    analyze-tasks/route.ts          # GET  — structured output (analysis)
    chat/route.ts                   # POST — tool-calling chat agent
  tasks/
    page.tsx, loading.tsx, [id]/page.tsx
    analysis/page.tsx               # Server Component consuming analyzeTasks()

features/
  tasks/
    store.ts                        # Supabase data layer + semantic search
    actions.ts                      # Server Actions (create, delete)
    types.ts
    components/*
  ai/
    analysis.ts                     # Structured-output analysis (reused by route + page)
    prompts.ts                      # Prompt builders
    stream.ts                       # SSE text-delta async iterator
    components/AiStepsButton.tsx
  chat/
    components/Chat.tsx

lib/
  supabase.ts                       # Supabase client
  embeddings.ts                     # OpenAI embedding helpers
```

Routes under `app/` are thin wrappers; feature logic lives in `features/<name>/`.

---

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | ✅ | Chat, classification, analysis, embeddings, streaming steps |
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `ANTHROPIC_API_KEY` | optional | Only if you swap the provider to `@ai-sdk/anthropic` |

---

## License

MIT
