# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project attempts to adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
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

## [0.1.0]

### Added

- Automatic learning trigger via `session.idle` event hook with configurable cadence (min turns + min minutes)
- `/learn` command for manual learning runs
- Trial mode with reduced thresholds for faster initial feedback, controlled via `CONTINUAL_LEARNING_TRIAL_MODE` env var
- Per-project state persistence at `.opencode/state/continual-learning.json`
- Bundled `continual-learning` SKILL.md written to `.opencode/skills/` on plugin load
- `command.execute.before` hook resets cadence timer when `/learn` is run manually
- Full environment variable configuration for all cadence thresholds

[unreleased]: https://github.com/baradghimire/opencode-continual-learning/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/baradghimire/opencode-continual-learning/releases/tag/v0.1.0
