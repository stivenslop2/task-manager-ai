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

## AI feature guidance (planned)

The streaming description button is not built yet. When implementing it:

- **Dependencies:** `ai` and `@ai-sdk/openai`.
- **Endpoint:** `app/api/tasks/[id]/describe/route.ts`. Use `streamText` from `ai` with `openai(...)` from `@ai-sdk/openai`, and return the stream with the helper appropriate to the installed AI SDK version.
- **Client:** a Client Component button that consumes the stream (e.g. `useCompletion` or reading the response body directly). Verify the exact API against the installed version via Context7 before writing code.
- **Secrets:** put `OPENAI_API_KEY` in `.env.local`. Ensure `.gitignore` covers `.env*.local` before committing.
- **Privacy:** do not log prompt or response bodies that could contain user task content.

## Before writing code

- **Next.js questions:** read `node_modules/next/dist/docs/` first — this is the source of truth for this version.
- **Library questions** (`ai`, `@ai-sdk/openai`, `react`, `tailwindcss`, etc.): use the Context7 MCP (`resolve-library-id` then `query-docs`). Don't rely on training data.
- **Scope:** keep changes narrow to the Sprint 0 goals above. No speculative abstractions, no unrelated refactors.
