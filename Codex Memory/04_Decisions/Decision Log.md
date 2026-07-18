# Decision Log

Last updated: 2026-07-18

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

