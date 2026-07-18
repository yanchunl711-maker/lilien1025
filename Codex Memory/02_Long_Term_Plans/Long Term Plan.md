# Long Term Plan

Last updated: 2026-07-18

## Codex Permanent Memory

Goal: use Obsidian as Codex's cross-project permanent memory library.

The memory library should preserve:

- long-term planning
- user preferences
- recurring workflows
- project decisions
- project summaries
- daily reviews
- durable lessons from Codex conversations

## Operating Principle

At the start of future tasks, Codex should first read the memory index in:

`/Users/liyanchun/Documents/New project/Codex Memory/00-Start-Here.md`

Then it should load only the relevant memory notes for the current request.

## Daily Review Plan

Every day at 01:00 Asia/Shanghai, run a Codex review task that:

- collects accessible project activity and Codex context from the day
- extracts durable preferences, plans, decisions, workflows, blockers, and project updates
- appends a dated daily review note under `Codex Memory/06_Daily_Reviews`
- updates long-term memory files when information is durable
- syncs the vault to GitHub

Limitation: Codex can only summarize records it can access from the current workspace, connected apps, local files, and available thread context. Private conversations outside accessible Codex storage or browser sessions may require the user to provide or export them.

