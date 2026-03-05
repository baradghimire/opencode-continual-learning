# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project attempts to adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
## [0.1.5](https://github.com/baradghimire/opencode-continual-learning/compare/v0.1.4...v0.1.5) (2026-03-05)


### Bug Fixes

* qualify /oc free model ids with owner ([25df497](https://github.com/baradghimire/opencode-continual-learning/commit/25df497beecddec4a378c597601b615f795ab8a7))

## [${version}]
### Added - for new features
### Changed - for changes in existing functionality
### Deprecated - for soon-to-be removed features
### Removed - for now removed features
### Fixed - for any bug fixes
### Security - in case of vulnerabilities
[${version}]: https://github.com/baradghimire/opencode-continual-learning/releases/tag/v${version}
-->

## [Unreleased]

## [0.1.4]

### Changed

- Validate npm trusted publishing configuration with a CI-driven release cut

## [0.1.3]

### Fixed

- Stop forcing an empty `NODE_AUTH_TOKEN` in release workflow so npm trusted publishing can use GitHub OIDC

## [0.1.2]

### Fixed

- Use npm trusted publishing flow in release workflow with `npm publish --provenance`
- Normalize npm repository metadata to canonical `git+https` URL format

## [0.1.1]

### Fixed

- Refresh `bun.lock` to keep CI release installs deterministic with `bun install --frozen-lockfile`

## [0.1.0]

### Added

- Automatic learning trigger via `session.idle` event hook with configurable cadence (min turns + min minutes)
- `/learn` command for manual learning runs
- Trial mode with reduced thresholds for faster initial feedback, controlled via `CONTINUAL_LEARNING_TRIAL_MODE` env var
- Per-project state persistence at `.opencode/state/continual-learning.json`
- Bundled `continual-learning` SKILL.md written to `.opencode/skills/` on plugin load
- `command.execute.before` hook resets cadence timer when `/learn` is run manually
- Full environment variable configuration for all cadence thresholds

[unreleased]: https://github.com/baradghimire/opencode-continual-learning/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/baradghimire/opencode-continual-learning/releases/tag/v0.1.4
[0.1.3]: https://github.com/baradghimire/opencode-continual-learning/releases/tag/v0.1.3
[0.1.2]: https://github.com/baradghimire/opencode-continual-learning/releases/tag/v0.1.2
[0.1.1]: https://github.com/baradghimire/opencode-continual-learning/releases/tag/v0.1.1
[0.1.0]: https://github.com/baradghimire/opencode-continual-learning/releases/tag/v0.1.0
