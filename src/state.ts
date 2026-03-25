/**
 * Persistent state management for opencode-continual-learning.
 *
 * State is stored per-project at:
 *   <project-directory>/.opencode/state/continual-learning.json
 */

import * as fs from "node:fs"
import * as path from "node:path"

export interface ContinualLearningState {
  version: 1
  /** Timestamp (ms) of the last time learning was triggered */
  lastRunAtMs: number
  /** Number of completed turns since the last learning run */
  turnsSinceLastRun: number
}

const DEFAULT_STATE: ContinualLearningState = {
  version: 1,
  lastRunAtMs: 0,
  turnsSinceLastRun: 0,
}

function statePath(directory: string): string {
  return path.join(directory, ".opencode", "state", "continual-learning.json")
}

export function loadState(directory: string): ContinualLearningState {
  const p = statePath(directory)

  if (!fs.existsSync(p)) {
    return { ...DEFAULT_STATE }
  }

  try {
    const raw = fs.readFileSync(p, "utf-8")
    const parsed = JSON.parse(raw) as Partial<ContinualLearningState>

    if (parsed.version !== 1) {
      return { ...DEFAULT_STATE }
    }

    return {
      version: 1,
      lastRunAtMs:
        typeof parsed.lastRunAtMs === "number" && Number.isFinite(parsed.lastRunAtMs)
          ? parsed.lastRunAtMs
          : 0,
      turnsSinceLastRun:
        typeof parsed.turnsSinceLastRun === "number" &&
        Number.isFinite(parsed.turnsSinceLastRun) &&
        parsed.turnsSinceLastRun >= 0
          ? parsed.turnsSinceLastRun
          : 0,
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(directory: string, state: ContinualLearningState): void {
  const p = statePath(directory)
  const dir = path.dirname(p)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(p, JSON.stringify(state, null, 2) + "\n", "utf-8")
}
