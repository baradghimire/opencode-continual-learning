## Learned User Preferences

- Use `bun` instead of `npm` for package management
- Prefer symlinking plugin source files for local development and dogfooding
- TypeScript is the preferred language for OpenCode plugins
- Values clean project metadata and lockfile consistency
- Use `/oc` command via GitHub Actions to validate and auto-fix issues
- Include GitHub URLs in documentation/references for easier navigation
- Keep implementations simple; don't adopt complex upstream architectures when they don't fit the use case

## Learned Workspace Facts

- Project: opencode-continual-learning - OpenCode plugin for automatic AGENTS.md updates
- Plugin triggers learning after configurable turns + minutes (default: 10 turns + 120 min)
- Plugin writes bundled SKILL.md to `.opencode/skills/continual-learning/` on initialization
- Plugin persists per-project state to `.opencode/state/continual-learning.json`
- Skill file lives at `skills/continual-learning/SKILL.md` (not repo root) to support `npx skills add --skill continual-learning` without downloading entire repo
- Users should install skill via: `npx skills add https://github.com/baradghimire/opencode-continual-learning --skill continual-learning`
- Plugin environment variables control cadence: `CONTINUAL_LEARNING_MIN_TURNS`, `CONTINUAL_LEARNING_MIN_MINUTES`
- Plugin is actively dogfooded in its own repository
- GitHub Issues enabled after initial setup for better issue tracking workflow
- `/oc` GitHub Action: `opencode.yml` dispatches to `oc-zen-free.yml` (model selection) then `opencode` job; model selection uses `https://opencode.ai/zen/v1/models`, prefers `-free` models, falls back to `opencode/kimi-k2`
- Release pipeline: release-please creates published releases with tags (`include-component-in-tag: false`, tags are `v*`), which triggers `release.yml` (`on: release: published`) for npm publish with `--provenance`
- npm publish uses Node.js/npm (not Bun) because Bun lacks `--provenance` support; `actions/checkout@v6` is the standard GHA version across workflows
- cursor/plugins upstream structure: skills now at `continual-learning/skills/continual-learning/SKILL.md`, uses subagent architecture (`agents-memory-updater`) which we intentionally don't adopt for OpenCode
