# Codex Operating Workflow

Last updated: 2026-07-18

## Before Each Task

1. Read `Codex Memory/00-Start-Here.md`.
2. Read the most relevant profile, plan, workflow, decision, and project summary notes.
3. Check the current repository state before editing or syncing.
4. Keep changes scoped to the user's request.
5. Preserve unrelated user changes.

## During Each Task

- Write durable lessons into the memory library only when they will help future work.
- Keep task scratch notes out of long-term memory unless they become decisions or reusable workflows.
- If a task changes a project materially, update its project summary.

## End Of Task

1. Summarize what changed.
2. Note any blockers or user action required.
3. If memory files changed, commit and push them when appropriate.
4. If GitHub sync fails because of credentials, explain the exact next step.

## Obsidian Git Workflow

Inside Obsidian, use:

- `Git: Create backup` to commit and push changes.
- `Git: Pull` before editing from another machine.
- `Git: View source control` to inspect pending changes.

Recommended plugin settings:

- Pull before push: enabled
- Push after commit: enabled
- Auto backup interval: user may choose 10-30 minutes

## Obsidian Information Organization Workflow

Use the root note `资料整理入口.md` as the main dashboard for collected materials.

Default collection and triage flow:

1. Put unsorted material into `临时收集/`, `微信公众号文章/`, `00_Inbox/`, or `Codex Memory/00_Inbox/`.
2. Review new material from `40_Daily/今日整理.md` or `资料处理看板.md`.
3. Move project material to `10_Projects/`.
4. Move reusable knowledge to `20_Knowledge/`.
5. Move external references, PDFs, web clips, videos, and articles to `30_References/`.
6. Keep daily notes and review notes in `40_Daily/`.
7. Store templates in `90_Templates/`.
8. Write durable preferences, workflows, plans, decisions, and project summaries into `Codex Memory/`.

When Codex helps organize new Obsidian material, prefer this structure unless the user gives a more specific destination.
