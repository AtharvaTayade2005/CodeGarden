/**
 * Code Garden - Deterministic State Engine
 * Core domain model and state transitions for the gamified Python learning platform.
 */

export enum TreeStage {
  SEED = 'SEED',
  SPROUT = 'SPROUT',
  SAPLING = 'SAPLING',
  FLOURISHING_TREE = 'FLOURISHING_TREE',
}

export enum BugType {
  BOUNDARY_BEETLE = 'BOUNDARY_BEETLE',
  STRUCTURE_CATERPILLAR = 'STRUCTURE_CATERPILLAR',
  SCOPE_SLUG = 'SCOPE_SLUG',
  LOOP_WEED = 'LOOP_WEED',
}

export interface TreeState {
  hp: number; // Range: 20 to 100, default: 80
  xp: number; // Cumulative non-negative integer
  activeBugs: BugType[];
  streakDays: number;
}

export type GardenState = TreeState;

export const MIN_HP = 20;
export const MAX_HP = 100;
export const DEFAULT_HP = 80;
export const XP_SUCCESS_REWARD = 20;
export const HP_SUCCESS_HEAL = 10;
export const HP_FAILURE_DAMAGE = 15;

export const INITIAL_STATE: Readonly<TreeState> = Object.freeze({
  hp: DEFAULT_HP,
  xp: 0,
  activeBugs: [],
  streakDays: 0,
});

/**
 * Returns the tree growth stage corresponding to cumulative XP.
 * - SEED: 0 - 99 XP
 * - SPROUT: 100 - 299 XP
 * - SAPLING: 300 - 699 XP
 * - FLOURISHING_TREE: 700+ XP
 */
export function getTreeStage(xp: number): TreeStage {
  if (xp >= 700) {
    return TreeStage.FLOURISHING_TREE;
  }
  if (xp >= 300) {
    return TreeStage.SAPLING;
  }
  if (xp >= 100) {
    return TreeStage.SPROUT;
  }
  return TreeStage.SEED;
}

/**
 * Maps standard Python exceptions or runtime error descriptions to their corresponding BugType.
 * Defaults to STRUCTURE_CATERPILLAR for unrecognized exceptions.
 */
export function mapExceptionToBug(exceptionName: string): BugType {
  const normalized = (exceptionName || '').trim();

  // Exact matching against standard exception names
  switch (normalized) {
    case 'IndexError':
    case 'ZeroDivisionError':
    case 'OverflowError':
      return BugType.BOUNDARY_BEETLE;

    case 'SyntaxError':
    case 'IndentationError':
    case 'TabError':
      return BugType.STRUCTURE_CATERPILLAR;

    case 'NameError':
    case 'UnboundLocalError':
    case 'AttributeError':
      return BugType.SCOPE_SLUG;

    case 'TimeoutError':
    case 'Infinite Loop':
    case 'Iteration limit exceeded':
    case 'IterationLimitExceeded':
    case 'TimeLimitExceeded':
      return BugType.LOOP_WEED;
  }

  // Case-insensitive fallback checks for variations or descriptive messages
  const lower = normalized.toLowerCase();
  if (lower.includes('indexerror') || lower.includes('zerodivisionerror') || lower.includes('overflowerror')) {
    return BugType.BOUNDARY_BEETLE;
  }
  if (lower.includes('syntaxerror') || lower.includes('indentationerror') || lower.includes('taberror')) {
    return BugType.STRUCTURE_CATERPILLAR;
  }
  if (lower.includes('nameerror') || lower.includes('unboundlocalerror') || lower.includes('attributeerror')) {
    return BugType.SCOPE_SLUG;
  }
  if (
    lower.includes('timeout') ||
    lower.includes('infinite loop') ||
    lower.includes('iteration limit')
  ) {
    return BugType.LOOP_WEED;
  }

  return BugType.STRUCTURE_CATERPILLAR;
}

/**
 * Resolves a bug input (which could be a BugType enum value or an exception name string)
 * into a typed BugType.
 */
function resolveBugType(errorType?: BugType | string): BugType {
  if (!errorType) {
    return BugType.STRUCTURE_CATERPILLAR;
  }
  if (Object.values(BugType).includes(errorType as BugType)) {
    return errorType as BugType;
  }
  return mapExceptionToBug(errorType);
}

/**
 * Pure, deterministic transition function that evaluates exercise results:
 * - If success: +20 XP, +10 HP (capped at 100), remove one resolved bug of matching type.
 * - If failure: -15 HP (enforcing a hard floor of 20), append corresponding BugType if not already present.
 */
export function applyExerciseResult(
  currentState: TreeState,
  isSuccess: boolean,
  errorType?: BugType | string
): TreeState {
  if (isSuccess) {
    const nextHp = Math.min(MAX_HP, currentState.hp + HP_SUCCESS_HEAL);
    const nextXp = Math.max(0, currentState.xp + XP_SUCCESS_REWARD);
    const nextActiveBugs = [...currentState.activeBugs];

    if (errorType !== undefined) {
      const resolved = resolveBugType(errorType);
      const targetIndex = nextActiveBugs.indexOf(resolved);
      if (targetIndex !== -1) {
        nextActiveBugs.splice(targetIndex, 1);
      }
    }

    return {
      hp: nextHp,
      xp: nextXp,
      activeBugs: nextActiveBugs,
      streakDays: currentState.streakDays,
    };
  } else {
    const nextHp = Math.max(MIN_HP, currentState.hp - HP_FAILURE_DAMAGE);
    const nextXp = currentState.xp;
    const nextActiveBugs = [...currentState.activeBugs];
    const bugToAdd = resolveBugType(errorType);

    if (!nextActiveBugs.includes(bugToAdd)) {
      nextActiveBugs.push(bugToAdd);
    }

    return {
      hp: nextHp,
      xp: nextXp,
      activeBugs: nextActiveBugs,
      streakDays: currentState.streakDays,
    };
  }
}
