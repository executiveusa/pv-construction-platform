# Skills Directory

This folder contains category-level skill metadata to support lazy-loading and agent-aware workflows.
Agents should read only the relevant category files instead of a single large registry.

## Categories

- `ai-automation.md` — autonomous developer agents, token-efficient generation, workflow orchestration.
- `token-optimization.md` — token savings, prompt compression, LLM context efficiency.
- `frontend.md` — landing page building, UI automation, design systems, browser tools.
- `backend.md` — data, API orchestration, database tooling, MCP integration.
- `testing.md` — E2E automation, unit/integration coverage, quality guardrails.
- `deployment.md` — deployment workflows, edge / cloud-managed releases, MSP integration.
- `directory.md` — multitenant directory management, landing page marketplace, client listings.

## Notes

- The root `SKILLS.md` remains the master index and now points to this folder for finer-grained load.
- `skills/llm.txt` contains an agent-readable summary of this skills folder.
- `external-tools/` contains the locally cloned `jcodemunch-mcp` and `rtk` repos for token-efficient development.
