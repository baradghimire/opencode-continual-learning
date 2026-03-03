## Learned User Preferences

- Use trial mode for testing plugins to get faster feedback (reduced cadence thresholds)
- Prefer symlinking plugin source files for local development and dogfooding
- TypeScript is the preferred language for OpenCode plugins
- Values clean project metadata and lockfile consistency
- Maintain automated upstream dependency tracking with weekly sync checks

## Learned Workspace Facts

- Project: opencode-continual-learning - OpenCode plugin for automatic AGENTS.md updates
- Plugin triggers learning after configurable turns + minutes (default: 10 turns + 120 min, trial: 3 turns + 15 min)
- Plugin writes bundled SKILL.md to `.opencode/skills/continual-learning/` on initialization
- Plugin persists per-project state to `.opencode/state/continual-learning.json`
- Plugin environment variables control cadence: `CONTINUAL_LEARNING_MIN_TURNS`, `CONTINUAL_LEARNING_MIN_MINUTES`, `CONTINUAL_LEARNING_TRIAL_MODE`
- Upstream dependencies tracked in `.github/UPSTREAM_TRACKING.md` with automated weekly sync checks via GitHub Actions
