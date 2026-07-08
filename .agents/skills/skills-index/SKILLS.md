---
title: Skill Index — Gonku Auth
name: skills-index
description: A directory of project skills for Gonku Auth codebase. Each skill file contains step-by-step instructions for completing a specific type of task, such as adding an API endpoint or writing a unit test.
type: skills-index
routing:
  claude-code: .claude/skills/
  opencode: .opencode/skills/
  agents: .agents/skills/
---

# Skill Index — Gonku Auth

Skills are stored in tool-specific directories. **Read the skill file for your current tool before starting its associated task.**

## Skill Directory Routing

| Tool                                        | Skill directory     | Detection                                                  |
| ------------------------------------------- | ------------------- | ---------------------------------------------------------- |
| Claude Code (CLI / IDE extension)           | `.claude/skills/`   | Running inside `claude` CLI or VS Code/JetBrains extension |
| OpenCode                                    | `.opencode/skills/` | Running inside the `opencode` environment                  |
| Antigravity / any `.agents`-compatible tool | `.agents/skills/`   | Running inside a tool that reads `.agents/`                |

Always `Read` the skill file directly — do **not** invoke a project skill by name through the tool's skill resolver, as project skills are not globally registered.

## Skills

| Skill                        | When to Use                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `add-frontend-feature`       | Creating a new page or feature section in `apps/web`                                   |
| `implement-rbac-middleware`  | Implementing or modifying auth middleware, RBAC guards                                 |
| `refactor-large-file`        | Splitting a file that exceeds 250 lines into submodules                                |
| `git-commit`                 | Committing after a task is complete and all verifications pass                         |

## How to Add a New Skill

1. Create the skill file in **all three directories** with the appropriate frontmatter for each:
   - `.claude/skills/<skill-name>.md` — use Claude Code frontmatter (`name`, `description`)
   - `.opencode/skills/<skill-name>.md` — use OpenCode frontmatter (`name`, `description`, `license`, `compatibility: opencode`, `metadata`)
   - `.agents/skills/<skill-name>.md` — use the format required by the `.agents`-compatible tool
2. Structure the body with: **When to Use**, **Steps**, **Checklist Before Done**, and an **Example** where helpful
3. Add an entry to this file's Skills table
4. Add an entry to the Skills table in `AGENTS.md`
