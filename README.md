# Task Manager with AI

A small Next.js 16 learning project: a task manager where you can create, list, and delete tasks, with a button that uses streaming to generate task descriptions with AI.

> **Status:** in progress. The CRUD scaffold (in-memory store + Server Actions) is in place. The AI streaming feature, Route Handlers, and the `/tasks` page are planned.

## Why this project

Sprint 0 goals — get hands-on with the pieces of the modern Next.js App Router and a real introduction to the Vercel AI SDK, without being yet another generic chat tutorial.

## Stack

- **Framework:** Next.js 16.2.4 (App Router)
- **Runtime:** React 19.2, TypeScript 5
- **Styling:** Tailwind CSS 4
- **Tooling:** ESLint 9
- **AI (planned):** Vercel AI SDK (`ai`) + `@ai-sdk/openai`

## What's implemented today

- In-memory task store at `lib/tasks.ts` (`getTasks`, `getTaskById`, `createTask`, `deleteTask`)
- Server Actions at `app/tasks/actions.ts` (`createTaskAction`, `deleteTaskAction`)
- Base layout and home page (`app/layout.tsx`, `app/page.tsx`)

## Planned

- `/tasks` page as a Server Component with `Suspense` while the list loads
- Route Handlers under `app/api/tasks/**/route.ts`
- AI "Generate description" button — a Client Component that calls a streaming Route Handler (`app/api/tasks/[id]/describe/route.ts`) backed by `streamText` from the AI SDK
- Persistent storage (Supabase or Neon) in a later sprint

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

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
  tasks/
    actions.ts        # Server Actions
lib/
  tasks.ts            # In-memory task store
```

## Contributing / AI agents

This repo uses Next.js 16, which has breaking changes vs. older training data. Before changing anything, read `AGENTS.md` and the relevant guide in `node_modules/next/dist/docs/`.
