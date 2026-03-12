/**
 * opencode-continual-learning
 *
 * Automatically and incrementally keeps AGENTS.md up to date by mining the
 * current session's conversation for high-signal learnings.
 *
 * Inspired by:
 *   - cursor/plugins continual-learning (https://github.com/cursor/plugins)
 *   - Josh Thomas' original OpenCode handoff plugin
 */

import type { Plugin } from "@opencode-ai/plugin"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"
import { loadState, saveState } from "./state"

// ---------------------------------------------------------------------------
// Cadence constants & helpers
// ---------------------------------------------------------------------------

const DEFAULT_MIN_TURNS = 10
const DEFAULT_MIN_MINUTES = 120
const TRIAL_MIN_TURNS = 3
const TRIAL_MIN_MINUTES = 15
const TRIAL_DURATION_MINUTES = 24 * 60

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false
  const v = value.trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes" || v === "on"
}

interface CadenceConfig {
  minTurns: number
  minMinutes: number
  trialMode: boolean
  trialMinTurns: number
  trialMinMinutes: number
  trialDurationMinutes: number
}

function getCadenceConfig(): CadenceConfig {
  return {
    minTurns: parsePositiveInt(process.env["CONTINUAL_LEARNING_MIN_TURNS"], DEFAULT_MIN_TURNS),
    minMinutes: parsePositiveInt(process.env["CONTINUAL_LEARNING_MIN_MINUTES"], DEFAULT_MIN_MINUTES),
    trialMode: parseBoolean(process.env["CONTINUAL_LEARNING_TRIAL_MODE"]),
    trialMinTurns: parsePositiveInt(process.env["CONTINUAL_LEARNING_TRIAL_MIN_TURNS"], TRIAL_MIN_TURNS),
    trialMinMinutes: parsePositiveInt(process.env["CONTINUAL_LEARNING_TRIAL_MIN_MINUTES"], TRIAL_MIN_MINUTES),
    trialDurationMinutes: parsePositiveInt(process.env["CONTINUAL_LEARNING_TRIAL_DURATION_MINUTES"], TRIAL_DURATION_MINUTES),
  }
}

// ---------------------------------------------------------------------------
// Canonical skill file (bundled at repo/package root, written to project on init)
// ---------------------------------------------------------------------------

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const ROOT_SKILL_PATH = path.join(PACKAGE_ROOT, "SKILL.md")

function loadBundledSkillContent(): string {
  return fs.readFileSync(ROOT_SKILL_PATH, "utf-8").replace(/\r\n/g, "\n")
}

/**
 * Write the SKILL.md to the project's .opencode/skills directory.
 * Only writes if the file is missing.
 */
function ensureSkill(directory: string): void {
  const skillDir = path.join(directory, ".opencode", "skills", "continual-learning")
  const skillPath = path.join(skillDir, "SKILL.md")
  if (fs.existsSync(skillPath)) return

  const bundledSkill = loadBundledSkillContent()

  fs.mkdirSync(skillDir, { recursive: true })
  fs.writeFileSync(skillPath, bundledSkill, "utf-8")
}

// ---------------------------------------------------------------------------
// Prompt templates
// ---------------------------------------------------------------------------

/**
 * Prompt injected automatically when the cadence threshold is reached.
 * Instructs the AI to invoke the continual-learning skill.
 */
const AUTO_FOLLOWUP_PROMPT =
  "Run the `continual-learning` skill now. Review this session's conversation to extract high-signal learnings. " +
  "First read existing `AGENTS.md` and update matching entries in place—do not only append. " +
  'Write only to "## Learned User Preferences" and "## Learned Workspace Facts" sections with plain bullet points only—no metadata annotations. ' +
  "Maximum 12 bullets per section. " +
  "If no meaningful updates exist, respond exactly: No high-signal memory updates."

/**
 * Template for the /learn command (manual trigger, identical intent but
 * without an internal marker so it reads naturally as a user message).
 */
const LEARN_COMMAND_TEMPLATE =
  "Run the `continual-learning` skill now. Review this session's conversation to extract high-signal learnings. " +
  "First read existing `AGENTS.md` and update matching entries in place—do not only append. " +
  'Write only to "## Learned User Preferences" and "## Learned Workspace Facts" sections with plain bullet points only—no metadata annotations. ' +
  "Maximum 12 bullets per section. " +
  "If no meaningful updates exist, respond exactly: No high-signal memory updates."

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export const ContinualLearningPlugin: Plugin = async (ctx) => {
  const { client, directory } = ctx

  // Track sessions where we just injected a learning prompt so we skip
  // counting their next session.idle (the AI's response to our trigger).
  const pendingLearning = new Set<string>()

  // Ensure the skill definition exists in this project (non-fatal on failure)
  try {
    ensureSkill(directory)
  } catch {
    // Skill creation failure should not block the plugin
  }

  return {
    // Register the /learn command for manual triggering
    config: async (config) => {
      config.command = config.command ?? {}
      config.command["learn"] = {
        description: "Mine this session for learnings and update AGENTS.md",
        template: LEARN_COMMAND_TEMPLATE,
      }
    },

    // Core logic: count turns and trigger learning when the cadence is met
    event: async ({ event }) => {
      if (event.type === "command.executed") {
        if (event.properties.name === "learn") {
          pendingLearning.add(event.properties.sessionID)
        }
        return
      }

      if (event.type !== "session.idle") return

      const sessionId = event.properties.sessionID
      if (!sessionId) return

      // Skip the idle that follows our own injected learning prompt
      if (pendingLearning.has(sessionId)) {
        pendingLearning.delete(sessionId)

        try {
          const state = loadState(directory)
          state.lastRunAtMs = Date.now()
          state.turnsSinceLastRun = 0
          saveState(directory, state)
        } catch {
          // Non-fatal
        }

        return
      }

      const state = loadState(directory)
      const config = getCadenceConfig()
      const now = Date.now()

      // Start the trial timer on the first counted turn (if trial mode is on)
      if (config.trialMode && state.trialStartedAtMs === null) {
        state.trialStartedAtMs = now
      }

      // Determine effective thresholds
      const inTrial =
        config.trialMode &&
        state.trialStartedAtMs !== null &&
        now - state.trialStartedAtMs < config.trialDurationMinutes * 60_000

      const effectiveMinTurns = inTrial ? config.trialMinTurns : config.minTurns
      const effectiveMinMinutes = inTrial ? config.trialMinMinutes : config.minMinutes

      const turnsSinceLastRun = state.turnsSinceLastRun + 1
      const minutesSinceLastRun =
        state.lastRunAtMs > 0
          ? Math.floor((now - state.lastRunAtMs) / 60_000)
          : Infinity

      state.turnsSinceLastRun = turnsSinceLastRun

      // Check cadence gates
      if (turnsSinceLastRun < effectiveMinTurns || minutesSinceLastRun < effectiveMinMinutes) {
        saveState(directory, state)
        return
      }

      // All gates passed — trigger learning (only mark cadence run complete
      // after the session.idle event that follows this injected prompt).
      saveState(directory, state)

      pendingLearning.add(sessionId)

      try {
        await client.session.prompt({
          path: { id: sessionId },
          body: {
            parts: [{ type: "text", text: AUTO_FOLLOWUP_PROMPT }],
          },
        })
      } catch {
        // If injection fails, remove from pendingLearning so the counter
        // resumes normally on the next turn
        pendingLearning.delete(sessionId)
      }
    },
  }
}
