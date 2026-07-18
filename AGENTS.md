# Codex Project Instructions

## Permanent Memory

Before starting any substantial task in this workspace, read:

`/Users/liyanchun/Documents/New project/Codex Memory/00-Start-Here.md`

Then read only the relevant notes under:

- `/Users/liyanchun/Documents/New project/Codex Memory/01_Profile`
- `/Users/liyanchun/Documents/New project/Codex Memory/02_Long_Term_Plans`
- `/Users/liyanchun/Documents/New project/Codex Memory/03_Workflows`
- `/Users/liyanchun/Documents/New project/Codex Memory/04_Decisions`
- `/Users/liyanchun/Documents/New project/Codex Memory/05_Project_Summaries`
- `/Users/liyanchun/Documents/New project/Codex Memory/06_Daily_Reviews`

When durable preferences, decisions, workflows, or project summaries emerge, update the memory library and sync it to GitHub when appropriate.

## Codebase Discovery

<!-- codebase-memory-mcp:start -->
# Codebase Knowledge Graph (codebase-memory-mcp)

This project uses codebase-memory-mcp to maintain a knowledge graph of the codebase.
ALWAYS prefer MCP graph tools over grep/glob/file-search for code discovery.

## Priority Order
1. `search_graph` - find functions, classes, routes, variables by pattern
2. `trace_path` - trace who calls a function or what it calls
3. `get_code_snippet` - read specific function/class source code
4. `query_graph` - run Cypher queries for complex patterns
5. `get_architecture` - high-level project summary

## When to fall back to grep/glob
- Searching for string literals, error messages, config values
- Searching non-code files (Dockerfiles, shell scripts, configs)
- When MCP tools return insufficient results
<!-- codebase-memory-mcp:end -->
