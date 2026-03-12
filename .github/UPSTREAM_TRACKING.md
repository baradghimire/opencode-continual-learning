# Upstream Dependency Tracking

This document tracks the two upstream projects this plugin is built upon.

---

## cursor/plugins

**Repository:** https://github.com/cursor/plugins  
**What it provides:** Core continual-learning concept, SKILL.md format, AGENTS.md contract, cadence logic

### Current Status
- **Last Sync Date:** 2026-03-09
- **Commit Tracked:** `e2a9918` (main)
- **Key Files Monitored:**
  - `continual-learning/skills/continual-learning/SKILL.md` - Upstream skill definition and workflow instructions
  - `SKILL.md` - Canonical standalone skill source for this repository
  - `continual-learning/.cursor-plugin/plugin.json` - Plugin manifest format
  - `README.md` - Conceptual changes to cadence/rules

### Sync Checklist
- [ ] Review SKILL.md for workflow changes
- [ ] Check for new cadence threshold defaults
- [ ] Verify AGENTS.md section names unchanged
- [ ] Verify the bundled project skill is created when missing

### Sync Frequency
**Quarterly** or whenever significant commits are detected

---

## joshuadavidthomas/opencode-handoff

**Repository:** https://github.com/joshuadavidthomas/opencode-handoff  
**What it provides:** OpenCode plugin architecture, SDK patterns, hook examples

### Current Status
- **Last Sync Date:** 2026-03-03
- **Version Tracked:** 0.5.0 (latest release)
- **Key Files Monitored:**
  - `src/plugin.ts` - Plugin patterns and hook usage
  - `package.json` - @opencode-ai/* dependency versions
  - `tsconfig.json` - TypeScript configuration
  - `CHANGELOG.md` - Breaking changes and API updates

### Sync Checklist
- [ ] Check @opencode-ai/plugin and @opencode-ai/sdk versions
- [ ] Review new hook patterns in plugin.ts
- [ ] Verify TypeScript config compatibility
- [ ] Run full test suite: typecheck + manual opencode testing

### Sync Frequency
**Monthly** or on new releases

---

## Quick Sync Commands

```bash
# Check cursor/plugins latest
curl -s https://api.github.com/repos/cursor/plugins/commits/main | jq -r '.sha'

# Check opencode-handoff latest release
curl -s https://api.github.com/repos/joshuadavidthomas/opencode-handoff/releases/latest | jq -r '.tag_name'

# Compare SKILL.md
curl -s https://raw.githubusercontent.com/cursor/plugins/main/continual-learning/SKILL.md > /tmp/cursor-skill.md
diff -u SKILL.md /tmp/cursor-skill.md
```

## Manual Sync Workflow

1. **Detection:** GitHub Action creates issue when upstream changes detected
2. **Review:** Maintainer reviews changes for relevance
3. **Update:** Create PR with necessary changes
4. **Test:** Run full test suite before merging
5. **Document:** Update this tracking file with new sync date
