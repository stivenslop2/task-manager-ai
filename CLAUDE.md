@AGENTS.md

## Tool usage for this project

- **Next.js 16** questions: read `node_modules/next/dist/docs/` first. The installed version has breaking changes vs. older training data.
- **Library docs** (`ai`, `@ai-sdk/openai`, `react`, `tailwindcss`, and anything else): use the Context7 MCP — call `resolve-library-id`, then `query-docs`. Prefer this over web search and training data.
- **Feature placement:** new task logic goes under `features/tasks/`; new AI logic goes under `features/ai/`. Keep `app/` focused on routing.
- **Scope:** keep changes aligned with the Sprint 0 goals listed in `AGENTS.md`. Avoid speculative abstractions and unrelated refactors.
