<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.4) has breaking changes — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project overview

Task Manager with AI — a Sprint 0 learning project built on Next.js 16 (App Router). The scope exercises:

- App Router (routes, layouts, dynamic routes)
- Server Components (task list, task detail)
- Route Handlers (`app/api/describe-task/route.ts`)
- Server Actions (`features/tasks/actions.ts`)
- Suspense + Streaming (task list skeleton, AI response stream)
- Client Components (form, delete, AI button)
- Vercel AI SDK streaming via `streamText` + `toUIMessageStreamResponse`

All code, UI strings, and comments are in English.

## Directory layout

```
app/                    Routing + thin page wrappers only
  api/describe-task/    POST — streaming AI endpoint
  tasks/                /tasks list + /tasks/[id] detail
features/
  tasks/                types, store, actions, components
  ai/                   prompts, stream parser, client components
```

- Routes under `app/` import from `@/features/<name>/…`. Do not put feature code directly in `app/`.
- `features/<name>/components/` holds feature-owned components. Shared cross-feature UI would go in a top-level `components/` folder (not created yet — add only when actually needed).

## Conventions

- **Server Components by default.** Add `"use client"` only where interactivity forces it (the form, delete button, and AI button).
- **Data access** goes through `features/tasks/store.ts`. Do not add parallel data layers.
- **Mutations** go through Server Actions in `features/tasks/actions.ts`. Do not call the store directly from Client Components.
- **Route Handlers** live at `app/api/**/route.ts` and are the right place for streaming responses.
- **Suspense** boundaries wrap async UI (task list, streaming AI output).
- **Types** live in `features/<name>/types.ts`. Prefer `interface` for object shapes; export them from the feature root.
- **Styling** uses Tailwind v4 tokens declared in `app/globals.css` (`brand-*`, `surface*`, `ink*`, `border`). Don't hardcode raw hex colors in components.
- **Persistence** is in-memory for now. A real DB arrives in a later sprint — keep the `features/tasks/store.ts` surface stable so the swap is painless.
- **No incidental comments.** Only add a comment when the *why* is non-obvious (invariant, workaround, subtle SDK behavior). Keep comments in English.

## AI feature (implemented)

The streaming "Generate steps with AI" button is wired up end-to-end.

- **Dependencies:** `ai`, `@ai-sdk/openai` (and `@ai-sdk/anthropic`, installed for experimentation).
- **Endpoint:** `app/api/describe-task/route.ts` — `POST` handler. Uses `streamText({ model: openai('gpt-4o-mini'), prompt })` with the prompt built by `features/ai/prompts.ts#buildStepsPrompt`. Returns `result.toUIMessageStreamResponse()`.
- **Client:** `features/ai/components/AiStepsButton.tsx` — Client Component that POSTs `{ title, description }` to the endpoint and consumes the stream via `features/ai/stream.ts#readTextDeltas`, an async iterator that parses `data: {"type":"text-delta", ...}` SSE lines with a newline-buffered reader.
- **Model:** `gpt-4o-mini` by default. To swap providers, change the `model` argument only — do not fork the endpoint.
- **Secrets:** `OPENAI_API_KEY` in `.env.local`. `.env.example` documents the available keys. `.env*.local` is gitignored; `.env.example` is whitelisted.
- **Privacy:** do not log prompt or response bodies that could contain user task content.

When modifying the AI feature, verify the current `ai` / `@ai-sdk/openai` API via Context7 before changing stream helpers — the SDK evolves quickly (`toUIMessageStreamResponse`, `toDataStreamResponse`, `toAIStreamResponse` have swapped in/out across versions). The hand-rolled parser in `features/ai/stream.ts` can be replaced by `useCompletion` / `useChat` from `ai/react` once the installed API is confirmed.

## Before writing code

- **Next.js questions:** read `node_modules/next/dist/docs/` first — this is the source of truth for this version.
- **Library questions** (`ai`, `@ai-sdk/openai`, `react`, `tailwindcss`, etc.): use the Context7 MCP (`resolve-library-id` then `query-docs`). Don't rely on training data.
- **Scope:** keep changes narrow to the Sprint 0 goals above. No speculative abstractions, no unrelated refactors.
