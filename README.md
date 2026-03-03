# opencode-continual-learning

Automatically and incrementally keeps `AGENTS.md` up to date by mining the current session's conversation for high-signal learnings.

## Features

- **Automatic learning**: after a configurable number of completed turns and elapsed time, the plugin silently injects a prompt that tells the AI to run the `continual-learning` skill and update `AGENTS.md`
- **`/learn` command**: manually trigger a learning pass at any time
- **`AGENTS.md`-aware updates**: the AI reads existing entries and updates them in place rather than appending blindly, keeping the file clean and deduplicated
- **Noise-resistant**: only high-signal, reusable information is written—recurring preferences and durable workspace facts only; one-off instructions and transient details are excluded
- **Configurable cadence**: tune the trigger thresholds via environment variables; trial mode for faster initial feedback
- **Bundled skill**: a `continual-learning` SKILL.md is written to `.opencode/skills/` in your project on first load, providing the AI with detailed extraction and merge instructions

## Requirements

- [OpenCode](https://opencode.ai/) v1.2.15 or later

## Installation

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
  "plugin": ["opencode-continual-learning@0.1.1"]
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

This file is automatically updated when the plugin version changes. You can customize it per-project after installation—the plugin will not overwrite a file that already matches the current version marker.

## Contributing

```bash
git clone https://github.com/baradghimire/opencode-continual-learning
cd opencode-continual-learning
npm install
```

Symlink the plugin to your OpenCode config for local development:

```bash
mkdir -p ~/.config/opencode/plugins
ln -sf "$(pwd)/src/plugin.ts" ~/.config/opencode/plugins/continual-learning.ts
```

Run the type checker:

```bash
npm run typecheck
```

## Attribution

This plugin is inspired by and draws directly from:

- **[cursor/plugins — continual-learning](https://github.com/cursor/plugins)**: the original plugin concept, cadence logic, SKILL.md workflow, and `AGENTS.md` output contract. The trigger cadence, trial mode, and inclusion/exclusion rules are adapted from Cursor's implementation.

- **Josh Thomas' original OpenCode handoff plugin**: this repository was forked from Josh Thomas' work and adapted for continual learning. It informed the OpenCode plugin architecture usage, patterns for `@opencode-ai/plugin` and `@opencode-ai/sdk`, and the command/event hook structure used here.

## License

opencode-continual-learning is licensed under the MIT license. See the [`LICENSE`](LICENSE) file for more information.

---

opencode-continual-learning is not built by, or affiliated with, the OpenCode team.

OpenCode is ©2025 Anomaly.
