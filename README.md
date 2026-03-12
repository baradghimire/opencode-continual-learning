# opencode-continual-learning

Automatically and incrementally keeps `AGENTS.md` up to date by mining the current session's conversation for high-signal learnings.

## Features

- **Automatic learning**: after a configurable number of completed turns and elapsed time, the plugin silently injects a prompt that tells the AI to run the `continual-learning` skill and update `AGENTS.md`
- **`/learn` command**: manually trigger a learning pass at any time
- **`AGENTS.md`-aware updates**: the AI reads existing entries and updates them in place rather than appending blindly, keeping the file clean and deduplicated
- **Noise-resistant**: only high-signal, reusable information is written—recurring preferences and durable workspace facts only; one-off instructions and transient details are excluded
- **Configurable cadence**: tune the trigger thresholds via environment variables; trial mode for faster initial feedback
- **Standalone skill + plugin automation**: the canonical `SKILL.md` lives at the repo root for `npx skills` installs, and the plugin mirrors it into `.opencode/skills/` on first load for OpenCode

## Requirements

- [OpenCode](https://opencode.ai/) v1.2.15 or later

## Installation

### Standalone skill (`npx skills`)

Install the reusable skill into any supported agent:

```bash
npx skills add baradghimire/opencode-continual-learning
```

### OpenCode plugin (automation)

Add to your OpenCode config (`~/.config/opencode/opencode.json`):

```json
{
  "plugin": ["opencode-continual-learning"]
}
```

Restart OpenCode and you're ready to go.

Optionally, pin to a specific version for stability:

```json
{
  "plugin": ["opencode-continual-learning@0.4.1"]
}
```

## Usage

### Automatic

The plugin runs silently in the background. After the cadence threshold is met (default: 10 completed turns **and** 120 minutes since the last run), it injects a prompt that asks the AI to invoke the `continual-learning` skill. The AI reads `AGENTS.md`, mines the session conversation, and writes back only:

- `## Learned User Preferences` — recurring corrections and stated preferences
- `## Learned Workspace Facts` — durable facts about the project (patterns, conventions, tech choices)

### Manual

Run `/learn` at any point to trigger a learning pass immediately:

```
/learn
```

The cadence timer is reset after a manual run so the auto-trigger backs off.

## What gets written to AGENTS.md

The AI only stores items that meet all of these criteria:

| Criterion | Example |
|---|---|
| Actionable in future sessions | "Always use `pnpm` instead of `npm`" |
| Stable across sessions | "The API layer lives in `packages/api/src/`" |
| Repeated or stated as a broad rule | User has corrected the same thing multiple times |
| Non-sensitive | No credentials, personal data |

Items that are **never** stored: secrets, one-off task instructions, transient details (branch names, commit hashes, temporary error messages).

## Configuration

### Cadence (environment variables)

| Variable | Default | Description |
|---|---|---|
| `CONTINUAL_LEARNING_MIN_TURNS` | `10` | Minimum completed turns before triggering |
| `CONTINUAL_LEARNING_MIN_MINUTES` | `120` | Minimum minutes since last run |
| `CONTINUAL_LEARNING_TRIAL_MODE` | `false` | Enable reduced thresholds for initial testing |
| `CONTINUAL_LEARNING_TRIAL_MIN_TURNS` | `3` | Min turns in trial mode |
| `CONTINUAL_LEARNING_TRIAL_MIN_MINUTES` | `15` | Min minutes in trial mode |
| `CONTINUAL_LEARNING_TRIAL_DURATION_MINUTES` | `1440` | How long trial mode lasts (minutes) |

Set `CONTINUAL_LEARNING_TRIAL_MODE=1` for quicker feedback when first setting up the plugin.

### State file

Per-project cadence state is stored at:

```
<project>/.opencode/state/continual-learning.json
```

Delete this file to reset the turn counter and timer.

### Skill file

The plugin writes a `SKILL.md` to:

```
<project>/.opencode/skills/continual-learning/SKILL.md
```

This copy comes from the canonical repo-root `SKILL.md`. The plugin writes it on first load if it does not already exist, and then leaves your project copy alone.

## Contributing

```bash
git clone https://github.com/baradghimire/opencode-continual-learning
cd opencode-continual-learning
bun install
```

Symlink the plugin to your OpenCode config for local development:

```bash
mkdir -p ~/.config/opencode/plugins
ln -sf "$(pwd)/src/plugin.ts" ~/.config/opencode/plugins/continual-learning.ts
```

Run the type checker:

```bash
bun run typecheck
```

## Releasing

This repository uses an automated release flow with minimal manual steps.

### Workflow Overview

| File | Trigger | Purpose |
|------|---------|---------|
| `ci.yml` | PRs + pushes to `main` | Type checking and validation |
| `release-please.yml` | Push to `main` | Opens release PR with version bump and changelog |
| `release.yml` | `release.published` | Publishes to npm with provenance |

### Step-by-Step

1. **Open a feature branch** from `main`
2. **Make changes**, commit with [Conventional Commits](https://www.conventionalcommits.org/)
3. **Push and open a PR** — `ci` workflow runs typecheck
4. **Merge to `main`** — requires PR review (direct pushes blocked by ruleset)
5. **`release-please` creates/updates a Release PR** — includes version bump and changelog
6. **Review and merge the Release PR** — creates a `v*` tag and a published GitHub Release
7. **`release` workflow runs automatically** — builds, attests, uploads tarball, and publishes to npm with provenance

### Direct pushes to `main` are blocked

The repository has a ruleset enforcing PR-based changes with required review. All changes must go through pull requests.

### GitHub Actions Details

- **`ci`**: Validates TypeScript on every PR and push to `main`
- **`release-please`**: Uses [googleapis/release-please-action](https://github.com/googleapis/release-please-action) to manage releases. Parses Conventional Commits to determine semver bumps.
- **`release`**: Publishes to npm with `--provenance` flag. Uses Bun for dependencies, npm for publish (npm provenance not yet available in Bun).
- **`oc-zen-free`**: Reusable workflow that selects free OpenCode models first, falling back to `opencode/kimi-k2`.
- **`upstream-sync`**: Weekly check for upstream dependency updates from cursor/plugins and opencode-handoff.

### Required Secret for Full Release Automation

Set a repository secret named `RELEASE_PLEASE_TOKEN` (PAT or GitHub App token with repo/workflow permissions).

Using the default `GITHUB_TOKEN` can prevent downstream PR-triggered workflows from firing on release-please-created PRs.

### Manual Release Trigger

You can manually trigger release-please from the GitHub Actions UI if needed:

1. Go to **Actions** → **release-please** → **Run workflow**
2. Select branch `main` and run

## Attribution

This plugin is inspired by and draws directly from:

- **[cursor/plugins — continual-learning](https://github.com/cursor/plugins)**: the original plugin concept, cadence logic, SKILL.md workflow, and `AGENTS.md` output contract. The trigger cadence, trial mode, and inclusion/exclusion rules are adapted from Cursor's implementation.

- **Josh Thomas' original OpenCode handoff plugin**: this repository was forked from Josh Thomas' work and adapted for continual learning. It informed the OpenCode plugin architecture usage, patterns for `@opencode-ai/plugin` and `@opencode-ai/sdk`, and the command/event hook structure used here.

## License

opencode-continual-learning is licensed under the MIT license. See the [`LICENSE`](LICENSE) file for more information.

---

opencode-continual-learning is not built by, or affiliated with, the OpenCode team.

OpenCode is ©2025 Anomaly.
