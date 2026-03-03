# TODO - Issues from PR Reviews

**Note:** GitHub Issues are now enabled on this repository. All issues are tracked at https://github.com/baradghimire/opencode-continual-learning/issues

This file is kept for historical reference but is no longer the primary issue tracker.

---

## ✅ All Issues Resolved

### Issue #4 - Persist cadence state only after prompt injection succeeds
**Status:** ✅ **Closed**  
**Resolution:** Fixed in PR #2 - Cadence state handling was updated to properly manage state persistence relative to prompt injection timing.

### Issue #5 - Read tracked commit values from correct markdown range in workflow  
**Status:** ✅ **Closed**  
**Resolution:** Fixed in PR #8 - Workflow now uses proper awk-based section parsing to correctly extract tracked commit values from UPSTREAM_TRACKING.md.

### Issue #6 - Normalize tracked release text before version comparison in workflow
**Status:** ✅ **Closed**  
**Resolution:** Fixed in PR #7/#8 - Version comparison now normalizes the tracked version string by stripping annotations like "(latest release)" before comparison.

### ~~4. Prevent duplicate auto-runs across concurrent sessions~~
**Status:** ✅ **Resolved in PR #2**  
**Resolution:** Introduced project-wide persisted in-flight guard (`learningInFlightSessionId` + `learningInFlightStartedAtMs`) in state.

---

*All issues are now tracked in GitHub Issues. This file is for historical reference only.*
