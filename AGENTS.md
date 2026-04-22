<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project overview

Task Manager with AI — a Sprint 0 learning project built on Next.js 16 (App Router). The scope exercises:

- App Router (routes, layouts, dynamic routes)
- Server Components (listing tasks)
- Route Handlers (tasks API under `app/api/**/route.ts`)
- Server Actions (creating and deleting tasks)
- Suspense + Streaming (task list and AI response)
- Client Components (form, AI button)
- A streaming AI "generate description" feature powered by the Vercel AI SDK

All user-facing prose and identifiers are in English.

## Conventions

- **Server Components by default.** Add `"use client"` only where interactivity forces it (forms with local state, the AI button).
- **Data access** goes through `lib/tasks.ts`. Do not add parallel data layers.
- **Mutations** go through Server Actions in `app/tasks/actions.ts`. Do not call the store directly from Client Components.
- **Route Handlers** live at `app/api/**/route.ts` and are the right place for streaming responses (the AI endpoint).
- **Suspense** boundaries wrap async UI — the task list and the AI streaming output.
- **Persistence** is in-memory for now. A real DB (Supabase or Neon) arrives in a later sprint; keep the `lib/tasks.ts` surface stable so the swap is painless.

## AI feature (implemented)

The streaming "generate steps" button is wired up. Current shape:

- **Dependencies:** `ai`, `@ai-sdk/openai` (also `@ai-sdk/anthropic` installed for experimentation).
- **Endpoint:** `app/api/describe-task/route.ts` — `POST` handler that calls `streamText({ model: openai('gpt-4o-mini'), prompt })` and returns `result.toUIMessageStreamResponse()`.
- **Client:** `app/tasks/[id]/AIDescriptionButton.tsx` — a Client Component that POSTs `{ title, description }` and reads the response body directly, parsing `data: {"type":"text-delta", ...}` lines token-by-token into local state.
- **Model:** `gpt-4o-mini` by default. If swapping providers, use `@ai-sdk/anthropic` and adjust the `model` argument; do not fork the endpoint.
- **Secrets:** `OPENAI_API_KEY` in `.env.local`. Never commit `.env*.local`.
- **Privacy:** do not log prompt or response bodies that could contain user task content.

When modifying the AI feature, verify the current `ai` / `@ai-sdk/openai` API via Context7 before changing stream helpers — the SDK evolves quickly (`toUIMessageStreamResponse`, `toDataStreamResponse`, `toAIStreamResponse` have swapped in/out across versions). The hand-rolled stream reader in `AIDescriptionButton` can be replaced by `useCompletion` / `useChat` from `ai/react` once the installed API is confirmed.

## Before writing code

- **Next.js questions:** read `node_modules/next/dist/docs/` first — this is the source of truth for this version.
- **Library questions** (`ai`, `@ai-sdk/openai`, `react`, `tailwindcss`, etc.): use the Context7 MCP (`resolve-library-id` then `query-docs`). Don't rely on training data.
- **Scope:** keep changes narrow to the Sprint 0 goals above. No speculative abstractions, no unrelated refactors.
