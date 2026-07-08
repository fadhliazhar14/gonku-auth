# AI Agent Instructions — Gonku Auth

> **CRITICAL**: These rules are NON-NEGOTIABLE. Context compaction does not exempt you.
> Re-read this file if context was truncated. Run `npm run build:web && npm run test` before completing ANY task.

## Skills

> **CRITICAL:** If project skills are not resolvable via the tool's built-in skill resolver, `Read` the skill file directly and execute its steps. Never invoke a project skill by name.

### Skill Directory — Route by Tool

| Tool                                   | Read skills from                   |
| -------------------------------------- | ---------------------------------- |
| **Claude Code** (this tool)            | `.claude/skills/<name>/SKILL.md`   |
| **OpenCode**                           | `.opencode/skills/<name>/SKILL.md` |
| **Antigravity / `.agents`-compatible** | `.agents/skills/<name>/SKILL.md`   |

See `.claude/skills/skills-index/SKILL.md` for the canonical index and routing rules.

### Skill Reference

| Skill                        | When to Use                                                                 |
| ---------------------------- | --------------------------------------------------------------------------- |
| `add-api-endpoint`           | Creating any new REST route in `apps/api`                                   |
| `add-frontend-feature`       | Creating a new page or feature section in `apps/web`                        |
| `add-drizzle-migration`      | Adding or changing a database table/column                                  |
| `add-shared-schema`          | Adding Zod schemas or types to `packages/shared`                            |
| `add-unit-test`              | Writing tests for service, repository, or presenter code                    |
| `implement-rbac-middleware`  | Implementing or modifying auth, RBAC                                        |
| `generate-report`            | Implementing XLSX export or the portfolio timeline JSON endpoint            |
| `add-node-executor`          | Adding a new node type to the Workflow Builder canvas                       |
| `add-e2e-test`               | Writing Playwright end-to-end tests                                         |
| `refactor-large-file`        | Splitting a file that exceeds 250 lines                                     |
| `debug-workflow`             | Troubleshooting workflow template save/render issues                        |
| `codebase-navigation`        | Finding code, tracing requests, understanding structure                     |
| `git-commit`                 | Committing after a task is complete and verified                            |
| `developer-pre-pr-checklist` | Self-review before opening a PR — run verification commands and checklist   |
| `stop-slop`                  | Remove AI generic before writing content, useful in writing comments/review |

## Project Overview

**Tatanan** is a monorepo Project Management Tool (PMT) for internal PT. Perkasa Pilar Utama.

| Layer    | Tech                               |
| -------- | ---------------------------------- |
| Runtime  | Node.js                            |
| Language | JavaScript                         |
| Backend  | Hono + Drizzle ORM + PostgreSQL    |
| Frontend | React + Tailwind CSS (MVP pattern) |
| Testing  | Jest / Vitest (TDD)                |

**Repository layout:**

```
apps/api/    — Hono backend
apps/web/    — React frontend
packages/shared/ — Zod schemas and shared types
docs/        — Architecture, specs, standards, guides
```

## Architecture Laws

### File Size Limits

- **MAX 300 lines per file** — split at 250 lines proactively
- **Monolithic = FAILURE** — one file doing multiple things is a bug
- When a file exceeds the limit, create `<name>-impl/` directory with submodules

### Module Structure Pattern

```
src/modules/feature/
  feature.router.js       ← Route definitions + middleware binding
  feature.handler.js      ← HTTP in/out, Zod validation, calls service
  feature.service.js      ← Business logic (no HTTP context)
  feature.repository.js   ← All DB queries via Drizzle
  feature.schema.js       ← Zod schemas
  feature.test.js         ← Unit tests (AAA pattern)
```

### AI Agent Warning Header (REQUIRED in every index.js)

```javascript
/**
 * <Module Name>
 *
 * AI AGENTS: This module is split into submodules:
 * - <file>.js: <description>
 * Do NOT create monolithic files. Follow the pattern.
 */
```

## Node Runtime (NOT Bun)

| Use                               | Don't Use                                   |
| --------------------------------- | ------------------------------------------- |
| `node <file>`                     | `bun`, `ts-node`                            |
| `npm run test`                    | `bun test`                                  |
| `npm install`                     | `bun install`, `yarn`, `pnpm`               |
| `npm run <script>`                | `bun run <script>`                          |
| `fs.promises`                     | `Bun.file()`                                |
| `drizzle-orm/postgres-js` or `pg` | `drizzle-orm/bun-sql` + `Bun.SQL`           |

## Verification Commands (RUN BEFORE COMPLETING TASK)

```bash
npm run build:web    # Frontend build — MUST PASS
npm run test         # All tests — MUST PASS
```

## Code Discovery Protocol

Before writing ANY code:

1. `grep -r "pattern" apps/api/src/` or `apps/web/src/` — find existing implementations
2. Read 3-5 similar files — match patterns exactly
3. Check `apps/api/src/lib/` for utilities — do not reinvent
4. Check schemas in `apps/api/src/modules/*/<feature>.schema.js` and `packages/shared/src/` — reuse, do not duplicate

## Naming Conventions

| Element          | Pattern               | Example                 |
| ---------------- | --------------------- | ----------------------- |
| Files            | kebab-case            | `project.service.js`    |
| Functions        | camelCase, verb-first | `createProject()`       |
| Constants        | SCREAMING_SNAKE       | `MAX_FILE_SIZE_MB`      |
| Directories      | kebab-case            | `workflow-templates/`   |
| Zod schemas      | camelCase + `Schema`  | `createProjectSchema`   |
| DB table objects | camelCase, plural     | `projects`, `auditLogs` |

## Code Safety Rules

- **No `any`** — since we are using JavaScript, ensure proper validation with Zod.
- **Zod schemas are the source of truth** for data validation.

## Error Handling Pattern

```javascript
// GOOD — specific, propagates context
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

// BAD — generic, loses context
catch (err) { console.log(err); }
```

Never throw raw `Error` from service layer. Use domain error classes from `lib/errors.js`.

## Testing Pattern

```javascript
import { test, expect, describe, beforeEach } from "vitest"; // or jest

describe("projectService.create", () => {
  beforeEach(() => {
    /* reset state */
  });

  test("generates a unique site code on creation", async () => {
    // Arrange
    const input = { dealId: "uuid", name: "Site ABC", projectType: "greenfield_mdu" };

    // Act
    const project = await projectService.create(input, "user-uuid");

    // Assert
    expect(project.siteCode).toMatch(/^[A-Z]+-\d{4}-\d{3}$/);
  });
});
```

Tests must:

- Follow Arrange-Act-Assert (AAA)
- Cover happy path AND all error conditions
- Be isolated — no shared mutable state between `it` blocks

## RBAC Enforcement

Every new route must have the correct `rbac` middleware applied. Refer to the Permission Matrix in `docs/technical-specs/0.technical-index.md` Section 6.3. Key rule:

> IT Admin manages the system (users, audit, templates, archive). IT Admin does NOT participate in project operations (assign tasks, complete tasks, upload documents, generate reports).

## Task Status State Machine

Tasks follow strict status transitions. Enforce them in `tasks.service.js`. Invalid transitions must return `422 INVALID_TRANSITION`. Do not write code that skips or reverses transitions. The full diagram is in `docs/technical-specs/0.technical-index.md` Section 5.3.

## Database Rules

- Schema changes go through Drizzle migrations only. Never alter the DB manually.
- All multi-table operations must use `db.transaction()`.
- All tables need `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` and `created_at`.
- Mutable tables also need `updated_at`.
- Audit log writes must be atomic with the originating write (same transaction).

### Migration Serialization (CRITICAL — 4 backend devs)

Migrations must be serialized through PRs to prevent sequential number collisions:

1. Write the schema change in `apps/api/src/db/schema/`.
2. Open the PR with **only the schema change** — do NOT run DB generation yet.
3. After rebasing on latest `main`, run `npm run db:generate` as the final step before the PR is ready for review.
4. The next PR that touches the schema must wait until this one is merged before generating its migration.

**Never run `npm run db:generate` at the start of a branch.** Run it after rebasing on `main`, immediately before the PR is marked ready. Two PRs generating migrations in parallel will produce conflicting `000N_*.sql` files that break the migration chain.

## Git Operations

### Automation Rule

AFTER COMPLETING A TASK:

1. Run verification (`npm run build:web && npm run test`)
2. If successful, automatically load the `git-commit` skill
3. Perform the commit without waiting for user prompt
4. Report the commit hash and message to the user

### Commit Style

**Never add `Co-Authored-By` trailers.** Commits are authored solely by the developer.

Format: `<type>(<scope>): <subject>`

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`

```bash
# Good
feat(tasks): add finish-to-start dependency enforcement
fix(auth): handle expired refresh token gracefully
test(projects): add service unit tests for template change

# Bad
update code / fix bug / wip
```

## ABSOLUTE PROHIBITIONS

| Violation                     | Why It's Wrong                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `// TODO`, `// FIXME`         | Ship complete code — **one narrow exception:** deferred Drizzle FK references to tables that do not yet exist in `main` (cross-task DB dependency). See rule below. |
| `// simplified for now`       | No partial implementations                                                                                                                                          |
| Magic numbers/strings         | Use named constants                                                                                                                                                 |
| `catch(e) { console.log(e) }` | Handle errors properly                                                                                                                                              |
| Duplicating functions         | Search first, reuse                                                                                                                                                 |
| Files > 300 lines             | Split into submodules                                                                                                                                               |
| Dead code                     | Delete it                                                                                                                                                           |
| `bun`                         | This is a Node/npm project                                                                                                                                          |
| Raw `process.env` in app code | Use `lib/config.js` (exception: `drizzle.config.js` must use `process.env`)                                                                                         |
| Direct DB writes in handlers  | Use repository layer                                                                                                                                                |
| Business logic in handlers    | Use service layer                                                                                                                                                   |

### Deferred FK Exception (the only permitted TODO)

A `// TODO` is permitted **only** when all three conditions hold:

1. **DB schema file only** — the comment is on a Drizzle column definition that needs a `.references()` FK to a table that has not yet been merged into `main`.
2. **Exact format** — the comment must name the blocking task:
   ```javascript
   // TODO: add .references(() => projects.id) — blocked on DB-01
   ```
3. **PR description documents it** — the PR body must list each deferred FK and which task unblocks it.

The TODO must be removed in the same PR that merges the referenced table — never carry it forward after the dependency is resolved.

All other TODOs and FIXMEs remain absolutely prohibited.

## Context Recovery Checklist

If context was compacted, verify:

- [ ] Read this file completely
- [ ] Read `docs/technical-specs/0.technical-index.md` Section 5.3 (state machine) and 6.3 (RBAC matrix)
- [ ] Run `npm run build:web` after changes
- [ ] Check file line counts — split if > 250

## Quick Reference

```bash
# Development (run from repo root)
npm run dev:api          # Start API server (localhost:3000)
npm run dev:web          # Start frontend (localhost:5173)

# Database
npm run db:generate      # Generate migration from schema diff
npm run db:migrate       # Apply pending migrations
npm run db:seed          # Seed dev data (first time only)
npm run db:studio        # Drizzle Studio (dev only)

# Quality
npm run test                 # Run all tests
npm run lint                 # Lint check
npm run lint:fix             # Auto-fix lint

# Docker (dev)
docker compose up db -d  # Start DB only (only service in dev compose)
docker compose logs api -f
```

<!-- code-review-graph MCP tools -->

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

If the tool is not available, install through this commands:

1. npm i -g code-review-graph
2. code-review-graph install
3. code-review-graph build

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool                        | Use when                                               |
| --------------------------- | ------------------------------------------------------ |
| `detect_changes`            | Reviewing code changes — gives risk-scored analysis    |
| `get_review_context`        | Need source snippets for review — token-efficient      |
| `get_impact_radius`         | Understanding blast radius of a change                 |
| `get_affected_flows`        | Finding which execution paths are impacted             |
| `query_graph`               | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes`     | Finding functions/classes by name or keyword           |
| `get_architecture_overview` | Understanding high-level codebase structure            |
| `refactor_tool`             | Planning renames, finding dead code                    |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
