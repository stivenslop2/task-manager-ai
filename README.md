# Task Manager with AI

A small Next.js 16 project built as a Sprint 0 learning exercise: a clean, white-and-orange task manager where you can create, list, open, and delete tasks, plus a button that streams AI-generated steps to help you complete each one.

## Feature tour

- **Home** — branded landing with a single call-to-action into the app.
- **`/tasks`** — Server Component list with a Server Actions form for creation, client-side deletion, and Suspense-backed loading skeletons.
- **`/tasks/[id]`** — task detail page with an **AI "Generate steps"** button that streams tokens from a Route Handler.
- **Streaming API** — `POST /api/describe-task` uses the Vercel AI SDK (`streamText` + `openai('gpt-4o-mini')`) and is consumed on the client with an async-iterator SSE parser.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js **16.2.4** (App Router, Turbopack) |
| Runtime | React 19.2, TypeScript 5 |
| Styling | Tailwind CSS 4 with `@theme` tokens — white surface + orange brand |
| AI | Vercel AI SDK (`ai`) with `@ai-sdk/openai` (Anthropic also installed) |
| Tooling | ESLint 9 |

## Getting started

```bash
npm install
cp .env.example .env.local      # then fill in OPENAI_API_KEY
npm run dev
```

Open http://localhost:3000.

The AI button requires `OPENAI_API_KEY` in `.env.local`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the project |

## Project layout

```
app/
  layout.tsx                        # Root layout (metadata, font, theme body)
  page.tsx                          # Home hero
  globals.css                       # Tailwind v4 @theme tokens (brand + ink)
  api/
    describe-task/route.ts          # POST — streaming AI endpoint
  tasks/
    layout.tsx                      # Branded header shell for the app
    page.tsx                        # /tasks — Server Component list
    loading.tsx                     # Re-exports the shared skeleton
    [id]/page.tsx                   # /tasks/[id]

features/
  tasks/
    types.ts                        # Task + TaskFormState interfaces
    store.ts                        # In-memory data layer (CRUD)
    actions.ts                      # Server Actions (create, delete)
    components/
      TaskForm.tsx
      TaskList.tsx
      TaskItem.tsx
      TaskStatusBadge.tsx
      DeleteTaskButton.tsx
      TasksSkeleton.tsx
  ai/
    prompts.ts                      # Prompt builder
    stream.ts                       # SSE text-delta async iterator
    components/
      AiStepsButton.tsx             # Streaming client button
```

### Why `features/`?

Co-locating types, data access, Server Actions, and components per feature keeps the `app/` directory focused on routing. Routes import from `@/features/<name>/…` and stay thin.

## Theme

Single canonical look — no dark-mode toggle. Palette is declared in `app/globals.css` via Tailwind v4's `@theme`:

- `brand-50 … brand-900` (orange, primary actions, accents)
- `surface`, `surface-muted` (whites)
- `ink`, `ink-muted` (warm near-blacks)
- `border`

Use `bg-brand-500`, `text-brand-600`, `text-ink`, etc. directly in components.

## Environment variables

See `.env.example`.

| Name | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | ✅ | Used by `POST /api/describe-task` |
| `ANTHROPIC_API_KEY` | optional | Only if you swap the provider to `@ai-sdk/anthropic` |

## Conventions

- Server Components by default; `"use client"` only where needed (forms, AI button, delete button).
- Data access through `features/tasks/store.ts`; mutations through Server Actions in `features/tasks/actions.ts`.
- Streaming responses belong in Route Handlers (`app/api/**/route.ts`).
- English everywhere — code, UI strings, comments.

See `AGENTS.md` for the contributor / AI-agent guide (including the Next.js 16 breaking-changes warning and AI SDK conventions).

## Roadmap

- Persistent storage (Supabase or Neon) replacing the in-memory store
- Task edit flow and completion toggle
- Replace the hand-rolled stream reader with `useCompletion` / `useChat` from the AI SDK once the installed API surface is confirmed
