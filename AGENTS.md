## Learned User Preferences

- Use `bun` instead of `npm` for package management
- Use trial mode for testing plugins to get faster feedback (reduced cadence thresholds)
- Prefer symlinking plugin source files for local development and dogfooding
- TypeScript is the preferred language for OpenCode plugins
- Values clean project metadata and lockfile consistency
- Maintain automated upstream dependency tracking with weekly sync checks
- Use `/oc` command via GitHub Actions to validate and auto-fix issues

## Learned Workspace Facts

- Project: opencode-continual-learning - OpenCode plugin for automatic AGENTS.md updates
- Plugin triggers learning after configurable turns + minutes (default: 10 turns + 120 min, trial: 3 turns + 15 min)
- Plugin writes bundled SKILL.md to `.opencode/skills/continual-learning/` on initialization
- Plugin persists per-project state to `.opencode/state/continual-learning.json`
- Skill file lives at `skills/continual-learning/SKILL.md` (not repo root) to support `npx skills add --skill continual-learning` without downloading entire repo
- Users should install skill via: `npx skills add https://github.com/baradghimire/opencode-continual-learning --skill continual-learning`
- Plugin environment variables control cadence: `CONTINUAL_LEARNING_MIN_TURNS`, `CONTINUAL_LEARNING_MIN_MINUTES`, `CONTINUAL_LEARNING_TRIAL_MODE`
- Upstream dependencies tracked in `.github/UPSTREAM_TRACKING.md` with automated weekly sync checks via GitHub Actions
- Plugin is actively dogfooded in its own repository
- GitHub Issues enabled after initial setup for better issue tracking workflow
- `/oc` GitHub Action: `opencode.yml` dispatches to `oc-zen-free.yml` (model selection) then `opencode` job; model selection uses `https://opencode.ai/zen/v1/models`, prefers `-free` models, falls back to `opencode/kimi-k2`
- Release pipeline: release-please creates published releases with tags (`include-component-in-tag: false`, tags are `v*`), which triggers `release.yml` (`on: release: published`) for npm publish with `--provenance`
- npm publish uses Node.js/npm (not Bun) because Bun lacks `--provenance` support; `actions/checkout@v6` is the standard GHA version across workflows
