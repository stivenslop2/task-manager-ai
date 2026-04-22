# Task Manager with AI

A small Next.js 16 learning project: a task manager where you can create, list, and delete tasks, plus a button that streams AI-generated steps to complete each task.

> **Status:** working end-to-end. CRUD scaffold + streaming AI button are wired up against an in-memory store. Persistent storage is the next sprint.

## Why this project

Sprint 0 goals — get hands-on with the pieces of the modern Next.js App Router and a real introduction to the Vercel AI SDK, without being yet another generic chat tutorial.

## Stack

- **Framework:** Next.js 16.2.4 (App Router)
- **Runtime:** React 19.2, TypeScript 5
- **Styling:** Tailwind CSS 4
- **Tooling:** ESLint 9
- **AI:** Vercel AI SDK (`ai`) with `@ai-sdk/openai` (and `@ai-sdk/anthropic` also installed)

## What's implemented

- In-memory task store at `lib/tasks.ts` (`getTasks`, `getTaskById`, `createTask`, `deleteTask`)
- Server Actions at `app/tasks/actions.ts` (`createTaskAction`, `deleteTaskAction`)
- `/tasks` Server Component page with Suspense-backed loading UI
- `/tasks/[id]` dynamic task detail page (Server Component)
- Streaming Route Handler at `app/api/describe-task/route.ts` using `streamText` + `openai('gpt-4o-mini')`, returned with `toUIMessageStreamResponse()`
- Client Component `AIDescriptionButton` that POSTs to the endpoint and renders the streamed deltas token-by-token

## Planned

- Persistent storage (Supabase or Neon) replacing `lib/tasks.ts`
- Task edit flow and completion toggle
- Optional: replace the hand-rolled stream reader with `useCompletion` / `useChat` from the AI SDK

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in OPENAI_API_KEY
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
  layout.tsx
  page.tsx
  globals.css
  api/
    describe-task/
      route.ts              # POST — streaming AI endpoint
  tasks/
    actions.ts              # Server Actions (create, delete)
    layout.tsx
    loading.tsx             # Suspense fallback for the list
    page.tsx                # /tasks — Server Component
    TaskForm.tsx            # Client Component
    TaskList.tsx
    DeleteTaskButton.tsx    # Client Component
    [id]/
      page.tsx              # /tasks/[id]
      AIDescriptionButton.tsx  # Client Component — streams from /api/describe-task
lib/
  tasks.ts                  # In-memory task store
```

## Contributing / AI agents

This repo uses Next.js 16, which has breaking changes vs. older training data. Before changing anything, read `AGENTS.md` and the relevant guide in `node_modules/next/dist/docs/`.
