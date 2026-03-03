# TODO - Issues from PR Reviews

This file tracks bugs and improvements identified in PR reviews. Since GitHub Issues are disabled on this repo, we use this file instead.

---

## 🐛 P1 Bugs (High Priority)

### 1. Persist cadence state only after prompt injection succeeds
**From:** PR #1 review by chatgpt-codex-connector  
**Priority:** P1 (High)  

**Problem:**  
The auto-trigger path updates `lastRunAtMs` and resets `turnsSinceLastRun` before calling `client.session.prompt`, but the `catch` block only clears `pendingLearning`. If `session.prompt` fails (transient API failure or session no longer valid), the persisted state still records a successful run, so auto-learning is suppressed until the full turns/minutes threshold elapses again.

**Impact:**  
Update is effectively skipped for hours when transient failures occur.

**Solution:**  
Move state persistence to after successful prompt injection, or add rollback on failure.

**Status:** 🔴 Open

---

### 2. Read tracked commit values from correct markdown range in workflow
**From:** PR #3 review by chatgpt-codex-connector  
**Priority:** P1 (High)  

**Problem:**  
The workflow parser always falls back to `unknown` because `grep -A2 "cursor/plugins"` only captures the heading plus two following lines, while `Commit Tracked` appears later in `.github/UPSTREAM_TRACKING.md`. Same issue for `opencode-handoff`.

**Impact:**  
`cursor_changed`/`handoff_changed` evaluate true on every scheduled run, causing the workflow to repeatedly create/update upstream-sync issues even when upstreams have not changed.

**Solution:**  
Fix the grep pattern to capture the correct lines or use a different parsing approach (e.g., `sed` or `yq` if structured as YAML frontmatter).

**File:** `.github/workflows/upstream-sync.yml`  
**Status:** 🔴 Open

---

## 🐛 P2 Bugs (Medium Priority)

### 3. Normalize tracked release text before version comparison in workflow
**From:** PR #3 review by chatgpt-codex-connector  
**Priority:** P2 (Medium)  
**Good First Issue:** Yes

**Problem:**  
The release comparison assumes `Version Tracked` is a bare tag, but the tracking file stores it as `0.5.0 (latest release)`, so string equality with GitHub's `tag_name` (e.g., `0.5.0`) can never succeed.

**Impact:**  
`handoff_changed` becomes sticky and causes recurring false-positive maintenance issues even when the release has not changed.

**Solution:**  
Strip annotations from the tracked version string before comparison, or store clean version strings in UPSTREAM_TRACKING.md.

**File:** `.github/workflows/upstream-sync.yml`  
**Status:** 🔴 Open

---

## ✅ Completed

### ~~4. Prevent duplicate auto-runs across concurrent sessions~~
**From:** PR #2 review by chatgpt-codex-connector  
**Priority:** P2 (Medium)  

**Problem:**  
When cadence gates pass, state is persisted without updating `lastRunAtMs`/`turnsSinceLastRun`, so the project still looks overdue until the later `session.idle`. In a multi-session project, another session can hit `session.idle` during that window and independently pass the same gates, causing back-to-back duplicate learning injections.

**Solution:**  
✅ **FIXED** by @codex in commit `d15bab7` - Introduced project-wide persisted in-flight guard (`learningInFlightSessionId` + `learningInFlightStartedAtMs`) in state.

**Status:** ✅ **Resolved in PR #2**

---

## Legend

- 🔴 **Open** - Not yet addressed
- 🟡 **In Progress** - Being worked on
- ✅ **Resolved** - Fixed and merged

---

*Last updated: 2026-03-03*
