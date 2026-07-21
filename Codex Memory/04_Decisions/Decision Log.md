# Decision Log

Last updated: 2026-07-21

## 2026-07-21 - Pause and Consolidate Obsidian Automations

Decision: pause all Obsidian-related scheduled work and consolidate it under one automation named `Obsidian 统一维护`.

Implementation:

- The unified automation remains paused until the user explicitly resumes it.
- It contains both WeChat inbox synchronization and the daily Codex permanent-memory review workflow.
- The former standalone `Obsidian WeChat Inbox Auto Sync` automation was removed after its workflow was merged.
- Non-Obsidian automations were left unchanged.

## 2026-07-20 - Obsidian Information Organization System

Decision: use a lightweight inbox-to-index structure for organizing collected materials in the Obsidian vault.

Structure:

- `资料整理入口.md` as the main dashboard.
- `资料处理看板.md` as the triage board.
- `00_Inbox/` for unsorted material.
- `10_Projects/` for project materials.
- `20_Knowledge/` for reusable knowledge.
- `30_References/` for external articles, PDFs, web clips, and media links.
- `40_Daily/` for daily organization and reviews.
- `90_Templates/` for reusable note templates.

Reason:

- The user collects material from WeChat, web clippers, Codex work, and project files.
- A single inbox plus periodic triage reduces folder sprawl.
- Templates make later AI summarization and GitHub sync more consistent.

## 2026-07-19 - Video-first Product Demonstrations

Decision: use short vertical real-operation videos as the primary promotional format for the Yaoshi Exam product instead of relying on static image posts.

Reason:

- Real interaction footage demonstrates the question count, answering workflow, explanations, mock exams, and reports more credibly than screenshots.
- A 9:16 format can be reused on Xiaohongshu, Douyin, and Xianyu mobile publishing.
- Marketing copy should keep the product positioned as a third-party learning aid and avoid promises of guaranteed results, leaked questions, or official affiliation.

## 2026-07-18 - Obsidian as Codex Permanent Memory

Decision: use the Obsidian vault at `/Users/liyanchun/Documents/New project` as Codex's long-term memory library.

Reason:

- The vault is already installed and synced to GitHub.
- Obsidian provides human-readable Markdown notes.
- GitHub gives version history and cross-device recovery.

Implementation:

- Created `Codex Memory/` with profile, plan, workflow, decision, project summary, and daily review sections.
- Added project and user-level Codex instructions to read the memory library before future tasks.
- Scheduled daily review automation for 01:00 Asia/Shanghai.

## 2026-07-02 - GitHub Sync for Obsidian Vault

Decision: sync the Obsidian vault to a private GitHub repository.

Repository:

`git@github.com:yanchunl711-maker/lilien1025.git`

Reason:

- The vault contains personal records and project materials.
- Private GitHub repository gives safer backup and version history.

Implementation:

- Installed Obsidian.
- Installed `obsidian-git` plugin.
- Created SSH key titled `Mac Obsidian Sync`.
- Pushed initial vault backup to GitHub.
