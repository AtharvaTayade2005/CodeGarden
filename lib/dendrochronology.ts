/**
 * Code Garden - Dendrochronology & Telemetry State Engine
 * Records the student's authentic problem-solving trajectory over time
 * into concentric annual tree growth rings (wood cross-sections).
 */

import { TreeState, BugType } from './treeEngine';

export type TelemetryState = 'idle' | 'burst' | 'stuck' | 'recovered';

export type RingClassification =
  | 'clear_growth'       // Wide vibrant green ring (clean pass / independent recovery)
  | 'drought_thrashing'  // Thin dark ring with nodes/knots (consecutive failed AST passes < 45s)
  | 'burst_exploration'  // Warm amber growth ring (rapid typing / structural exploration)
  | 'idle_pause'         // Weathered baseline ring (thinking / paused)
  | 'hint_scaffold';     // Indigo growth ring (assisted recovery)

export interface KeystrokeTelemetryPoint {
  timestamp: number;
  deltaLength: number;
  errorCount: number;
  state: TelemetryState;
  // Replay & Dendrochronology metadata
  codeSnapshot: string;
  treeState: TreeState;
  ringType: RingClassification;
  label: string;
  detail: string;
  nodeCount?: number; // Knots/nodes in wood caused by exceptions
  diffSummary?: string;
}

export interface StateMachineContext {
  lastFailureTime: number | null;
  consecutiveFailures: number;
  hadBugBeforeRun: boolean;
  hintsUsedForCurrentBug: number;
  lastKeystrokeTime: number;
  totalErrorsEncountered: number;
}

export const INITIAL_TELEMETRY_CONTEXT: StateMachineContext = {
  lastFailureTime: null,
  consecutiveFailures: 0,
  hadBugBeforeRun: false,
  hintsUsedForCurrentBug: 0,
  lastKeystrokeTime: Date.now(),
  totalErrorsEncountered: 0,
};

/**
 * Evaluates execution results against the dendrochronology state machine rules:
 * 1. If consecutive failed AST compiler passes happen within < 45 seconds, mark slice as "drought/thrashing" ('stuck').
 * 2. If code passes without hints after a bug, mark slice as "clear growth" ('recovered').
 */
export function evaluateExecutionEvent(
  passed: boolean,
  code: string,
  currentTreeState: TreeState,
  ctx: StateMachineContext,
  previousCode: string
): { telemetryPoint: KeystrokeTelemetryPoint; updatedContext: StateMachineContext } {
  const now = Date.now();
  const deltaLength = code.length - previousCode.length;

  if (!passed) {
    // Failure branch
    const consecutive = ctx.consecutiveFailures + 1;
    const isUnder45Sec = ctx.lastFailureTime !== null && (now - ctx.lastFailureTime) < 45000;
    const isDrought = consecutive >= 2 && isUnder45Sec;
    const totalErrors = ctx.totalErrorsEncountered + 1;

    const point: KeystrokeTelemetryPoint = {
      timestamp: now,
      deltaLength,
      errorCount: totalErrors,
      state: 'stuck',
      codeSnapshot: code,
      treeState: { ...currentTreeState },
      ringType: 'drought_thrashing',
      label: isDrought
        ? 'Drought / Thrashing Ring'
        : 'Compiler Exception Knot',
      detail: isDrought
        ? `Consecutive failed passes within ${Math.round((now - (ctx.lastFailureTime || now)) / 1000)}s (<45s threshold)`
        : 'AST compilation / runtime assertion failed',
      nodeCount: Math.min(6, consecutive),
      diffSummary: deltaLength >= 0 ? `+${deltaLength} chars` : `${deltaLength} chars`,
    };

    const updatedContext: StateMachineContext = {
      ...ctx,
      lastFailureTime: now,
      consecutiveFailures: consecutive,
      hadBugBeforeRun: true,
      totalErrorsEncountered: totalErrors,
    };

    return { telemetryPoint: point, updatedContext };
  } else {
    // Passed branch
    let ringType: RingClassification = 'clear_growth';
    let label = 'Flourishing Growth Ring';
    let detail = 'Clean test pass on all assertions';

    if (ctx.hadBugBeforeRun) {
      if (ctx.hintsUsedForCurrentBug === 0) {
        // Requirement: "If code passes without hints after a bug, mark the slice as 'clear growth'"
        ringType = 'clear_growth';
        label = 'Clear Growth Ring';
        detail = 'Recovered from bug independently without AI hints (+20 XP, +10 HP)';
      } else {
        ringType = 'hint_scaffold';
        label = 'Scaffolded Growth Ring';
        detail = `Resolved with ${ctx.hintsUsedForCurrentBug} AI hint level(s)`;
      }
    }

    const point: KeystrokeTelemetryPoint = {
      timestamp: now,
      deltaLength,
      errorCount: ctx.totalErrorsEncountered,
      state: 'recovered',
      codeSnapshot: code,
      treeState: { ...currentTreeState },
      ringType,
      label,
      detail,
      nodeCount: 0,
      diffSummary: deltaLength >= 0 ? `+${deltaLength} chars` : `${deltaLength} chars`,
    };

    const updatedContext: StateMachineContext = {
      ...ctx,
      lastFailureTime: null,
      consecutiveFailures: 0,
      hadBugBeforeRun: false,
      hintsUsedForCurrentBug: 0,
    };

    return { telemetryPoint: point, updatedContext };
  }
}

/**
 * Creates a keystroke telemetry point during code editing (burst or idle).
 */
export function createKeystrokePoint(
  code: string,
  previousCode: string,
  treeState: TreeState,
  ctx: StateMachineContext
): { telemetryPoint: KeystrokeTelemetryPoint; updatedContext: StateMachineContext } {
  const now = Date.now();
  const deltaLength = code.length - previousCode.length;
  const timeSinceLastKey = now - ctx.lastKeystrokeTime;
  const isBurst = timeSinceLastKey < 4000 && Math.abs(deltaLength) > 0;

  const state: TelemetryState = isBurst ? 'burst' : 'idle';
  const ringType: RingClassification = isBurst ? 'burst_exploration' : 'idle_pause';

  const point: KeystrokeTelemetryPoint = {
    timestamp: now,
    deltaLength,
    errorCount: ctx.totalErrorsEncountered,
    state,
    codeSnapshot: code,
    treeState: { ...treeState },
    ringType,
    label: isBurst ? 'Active Typing Burst' : 'Reflective Pause',
    detail: isBurst
      ? `Exploration editing (${Math.abs(deltaLength)} chars modified)`
      : `Cognitive synthesis pause (${Math.round(timeSinceLastKey / 1000)}s)`,
    nodeCount: 0,
    diffSummary: deltaLength >= 0 ? `+${deltaLength} chars` : `${deltaLength} chars`,
  };

  const updatedContext: StateMachineContext = {
    ...ctx,
    lastKeystrokeTime: now,
  };

  return { telemetryPoint: point, updatedContext };
}

/**
 * Generates initial baseline telemetry rings so the dendrochronology
 * cross-section displays immediately with realistic learning history.
 */
export function generateInitialTelemetryRings(starterCode: string, initialState: TreeState): KeystrokeTelemetryPoint[] {
  const now = Date.now();
  return [
    {
      timestamp: now - 180000,
      deltaLength: 0,
      errorCount: 0,
      state: 'idle',
      codeSnapshot: starterCode,
      treeState: { ...initialState, hp: 80, xp: 0, activeBugs: [] },
      ringType: 'idle_pause',
      label: 'Tree Pith (Pith Core)',
      detail: 'Lab module initialized from MU Syllabus',
      nodeCount: 0,
      diffSummary: 'Initial state',
    },
    {
      timestamp: now - 120000,
      deltaLength: 18,
      errorCount: 0,
      state: 'burst',
      codeSnapshot: starterCode + '\n# Initial draft pass',
      treeState: { ...initialState, hp: 80, xp: 0, activeBugs: [] },
      ringType: 'burst_exploration',
      label: 'Spring Wood (Exploration)',
      detail: 'Student began writing structural code (+18 chars)',
      nodeCount: 0,
      diffSummary: '+18 chars',
    },
    {
      timestamp: now - 75000,
      deltaLength: 5,
      errorCount: 1,
      state: 'stuck',
      codeSnapshot: starterCode + '\n# Syntax exploration\nfor i in range(n):',
      treeState: { ...initialState, hp: 65, xp: 0, activeBugs: [BugType.STRUCTURE_CATERPILLAR] },
      ringType: 'drought_thrashing',
      label: 'Dry Season Ring (Indentation Knot)',
      detail: 'Encountered structure caterpillar syntax error (-15 HP)',
      nodeCount: 2,
      diffSummary: '+5 chars (Error)',
    },
    {
      timestamp: now - 45000,
      deltaLength: -2,
      errorCount: 2,
      state: 'stuck',
      codeSnapshot: starterCode + '\nfor i in range(1, n):',
      treeState: { ...initialState, hp: 50, xp: 0, activeBugs: [BugType.BOUNDARY_BEETLE] },
      ringType: 'drought_thrashing',
      label: 'Drought Ring (Thrashing)',
      detail: 'Repeated failed run within 30s (<45s threshold) - off-by-one boundary',
      nodeCount: 3,
      diffSummary: '-2 chars (Thrash)',
    },
    {
      timestamp: now - 10000,
      deltaLength: 8,
      errorCount: 2,
      state: 'recovered',
      codeSnapshot: starterCode + '\nfor i in range(1, n + 1):\n    total += i',
      treeState: { ...initialState, hp: 70, xp: 20, activeBugs: [] },
      ringType: 'clear_growth',
      label: 'Clear Growth Ring (Recovery)',
      detail: 'Clean pass without hints! Boundary healed (+20 XP, +10 HP healed)',
      nodeCount: 0,
      diffSummary: '+8 chars (Solved)',
    },
  ];
}
