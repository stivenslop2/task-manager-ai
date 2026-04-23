<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.4) has breaking changes — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project overview

Task Manager AI — a portfolio project that demonstrates production patterns for LLM features on Next.js 16 (App Router):

- Streaming text via `streamText` + `toUIMessageStreamResponse`
- Tool-calling agents with `stepCountIs` step caps
- Structured outputs with `generateText` + `Output.object` + Zod schemas
- Retrieval-augmented search with Supabase `pgvector` and OpenAI embeddings
- Server Components, Server Actions, Route Handlers, Suspense streaming

All code, UI strings, and comments are in English.

## Directory layout

```
app/                    Routing + thin page wrappers only
  api/
    describe-task/      POST — streaming text
    classify-task/      POST — structured output
    analyze-tasks/      GET  — structured output (also callable from server modules)
    chat/               POST — tool-calling agent
  tasks/                /tasks list + /tasks/[id] + /tasks/analysis
features/
  tasks/                types, Supabase store, Server Actions, components
  ai/                   analysis (structured), prompts, stream reader, client components
  chat/                 chat UI
lib/
  supabase.ts           Supabase client (single instance)
  embeddings.ts         OpenAI embedding helpers
```

- Routes under `app/` import from `@/features/<name>/…`. Do not put feature code directly in `app/`.
- `features/<name>/components/` holds feature-owned components. Shared cross-feature UI goes in a top-level `components/` folder.

## Conventions

- **Server Components by default.** Add `"use client"` only where interactivity forces it (forms, chat, delete, AI button).
- **Data access** goes through `features/tasks/store.ts`. Do not call Supabase directly from route handlers or components.
- **Mutations** go through Server Actions in `features/tasks/actions.ts`. Do not call the store directly from Client Components.
- **Route Handlers** live at `app/api/**/route.ts` and are the right place for streaming and external-facing JSON endpoints.
- **Structured-output logic** lives in `features/ai/*.ts` as plain server functions, so it can be called from both route handlers and Server Components without HTTP round-trips.
- **Suspense** boundaries wrap async UI (task list, analysis, streaming AI output).
- **Types** live in `features/<name>/types.ts`. Prefer `interface` for object shapes; export them from the feature root.
- **Styling** uses Tailwind v4 tokens declared in `app/globals.css` (`brand-*`, `surface*`, `ink*`, `border`). Don't hardcode raw hex colors.
- **No incidental comments.** Only add a comment when the *why* is non-obvious (invariant, workaround, subtle SDK behavior). Keep comments in English.

## AI features (implemented)

- **Streaming steps** — `POST /api/describe-task` uses `streamText({ model: openai('gpt-4o-mini'), prompt })` with the prompt built by `features/ai/prompts.ts#buildStepsPrompt`. Client consumes the stream via `features/ai/stream.ts#readTextDeltas`, an async iterator that parses `data: {"type":"text-delta", ...}` SSE lines with a newline-buffered reader.
- **Classification** — `POST /api/classify-task` uses `generateText` + `Output.object` with a Zod schema returning category / difficulty / estimatedMinutes / tags / suggestedDeadline.
- **Analysis** — `features/ai/analysis.ts#analyzeTasks` returns a structured `TaskAnalysis`. The Server Component at `/tasks/analysis` calls it directly; `GET /api/analyze-tasks` wraps it for external callers.
- **Chat agent** — `POST /api/chat` exposes tools `searchTasks`, `getTasks`, `getTaskById`, `createTask`, `getTasksSummary`. `stepCountIs(5)` caps the agent loop. Consumed by `features/chat/components/Chat.tsx` via `useChat` + `DefaultChatTransport`.
- **RAG** — `createTask` embeds `title + description` into a 1536-dim vector stored in `tm_tasks.embedding`. `searchSimilarTasks` calls the Postgres function `match_tm_tasks` (cosine similarity).
- **Secrets** — `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` in `.env.local`. `.env.example` documents them. `.env*.local` is gitignored.
- **Privacy** — do not log prompt or response bodies that could contain user task content.

When modifying AI code, verify the current `ai` / `@ai-sdk/openai` API via Context7 before changing stream helpers — the SDK evolves quickly (`toUIMessageStreamResponse`, `toDataStreamResponse`, `toAIStreamResponse` have swapped in/out across versions).

## Before writing code

- **Next.js questions:** read `node_modules/next/dist/docs/` first — this is the source of truth for this version.
- **Library questions** (`ai`, `@ai-sdk/openai`, `react`, `tailwindcss`, `@supabase/supabase-js`, etc.): use the Context7 MCP (`resolve-library-id` then `query-docs`). Don't rely on training data.
- **Scope:** keep changes narrow and aligned with the project's portfolio goals. No speculative abstractions, no unrelated refactors.
