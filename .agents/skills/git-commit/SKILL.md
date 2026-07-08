---
name: git-commit
description: Use after completing a task when all verifications pass. Covers verification commands, explicit file staging, Conventional Commits format, and no Co-Authored-By trailers.
---

# Skill: git-commit

## When to Use

You have completed a task, all verifications have passed, and you need to commit the changes.

## Steps

1. **Run final verification — all must pass:**

   ```bash
   npm run type-check
   npm test
   npm run lint
   ```

   If any fails, stop and fix the issue before committing.

2. **Check what will be staged:**

   ```bash
   git status
   git diff --stat
   ```

3. **Stage the relevant files.** Be explicit — do not use `git add -A` blindly:

   ```bash
   git add apps/api/src/modules/projects/
   git add apps/api/src/db/migrations/0003_add_project_archive.sql
   # etc.
   ```

   **Never stage:**
   - `.env` files
   - `*.pem` key files
   - `package-lock.json` changes for unrelated packages
   - Build output (`dist/`, `.next/`)

4. **Compose the commit message** using Conventional Commits:

   Format: `<type>(<scope>): <subject>`

   | Type       | Use when                                  |
   | ---------- | ----------------------------------------- |
   | `feat`     | New feature or behavior                   |
   | `fix`      | Bug fix                                   |
   | `refactor` | Code change with no behavior change       |
   | `test`     | Adding or fixing tests                    |
   | `docs`     | Documentation changes only                |
   | `chore`    | Build config, tooling, dependency updates |
   | `perf`     | Performance improvement                   |

   Scope: the module or layer changed (e.g., `auth`, `tasks`, `gantt`, `db`, `ci`)

   Subject rules:
   - Imperative mood: "add", "fix", "refactor" — not "added" or "fixing"
   - **Max 80 characters for the entire first line** (`type(scope): subject [ID]` combined)
   - No period at end
   - Reference task ID when applicable: `[BE-S2-02]`

   **Before writing the commit, count the first line length:**

   ```bash
   echo -n "chore(auth): remove readme artifact and fix ErrorBoundary [FE-AUTH-06]" | wc -c
   # must be ≤ 80
   ```

   The husky hook enforces this and will reject the commit if exceeded — verify before running `git commit`.

5. **Create the commit:**

   ```bash
   git commit -m "feat(projects): add project creation endpoint [BE-S2-02]"
   ```

   For multi-line commits (when the "why" is non-obvious):

   ```bash
   git commit -m "feat(tasks): enforce finish-to-start dependency [BE-S3-03]

   Task B's checkbox is disabled when its prerequisite (Task A) is
   not yet in completed status. Auto-unlock triggers after Task A
   completes, changing Task B from locked to ready."
   ```

   **Do NOT add `Co-Authored-By` trailers.** Commits are authored solely by the developer. No AI attribution lines.

6. **Verify the commit:**

   ```bash
   git log --oneline -3
   ```

7. **Report to the user:** commit hash and message.

## Checklist Before Done

- [ ] `npm run type-check` passed
- [ ] `npm test` passed
- [ ] `npm run lint` passed
- [ ] `npm run fmt` passed
- [ ] No `.env` files staged
- [ ] No `*.pem` key files staged
- [ ] `package-lock.json` changes from unrelated packages not staged
- [ ] Commit message follows Conventional Commits format
- [ ] Scope matches the affected module
- [ ] Subject uses imperative mood
- [ ] Full first line is 80 characters or fewer (verified with `echo -n "..." | wc -c`)
- [ ] Task ID referenced in subject when applicable

## Examples

```bash
# Good
feat(tasks): add dependency enforcement on task completion [BE-S3-03]
fix(auth): handle expired refresh token gracefully
test(projects): add service unit tests for template change [BE-S2-11]
chore(ci): add coverage threshold check to CI workflow
docs(onboarding): update setup steps for Docker dev environment

# Bad
update code
fix bug
WIP
added the task thing
```