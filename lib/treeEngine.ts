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

/**
 * Localized Visual Bug Parasites attached directly to tree AST nodes
 */
export enum ParasiteType {
  CATERPILLAR = 'CATERPILLAR',       // IndexError / Loop boundary -> branch tip
  FUNGAL_BLIGHT = 'FUNGAL_BLIGHT',   // Unhandled ZeroDivisionError / TypeError -> node junction
  STRANGLER_VINE = 'STRANGLER_VINE', // Infinite loop / execution timeout (>2s) -> central trunk
}

export type ParasiteLocation = 'branch_tip' | 'node_junction' | 'central_trunk';

export interface ParasiteDefinition {
  type: ParasiteType;
  name: string;
  emoji: string;
  location: ParasiteLocation;
  locationLabel: string;
  defaultPrompt: string;
  description: string;
  color: string;
  bg: string;
  border: string;
}

export const PARASITE_DEFINITIONS: Record<ParasiteType, ParasiteDefinition> = {
  [ParasiteType.CATERPILLAR]: {
    type: ParasiteType.CATERPILLAR,
    name: 'Stem Caterpillar',
    emoji: '🐛',
    location: 'branch_tip',
    locationLabel: 'Branch Tip',
    defaultPrompt: 'This leaf is withering because range() tried to access index len(arr). Should this end at len(arr) - 1?',
    description: 'Chewing on branch tip buds due to an IndexError or loop boundary breach.',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.4)',
  },
  [ParasiteType.FUNGAL_BLIGHT]: {
    type: ParasiteType.FUNGAL_BLIGHT,
    name: 'Fungal Blight',
    emoji: '🍄',
    location: 'node_junction',
    locationLabel: 'Node Junction',
    defaultPrompt: 'This node junction is infected because an illegal arithmetic or type operation occurred. Did you verify that the divisor is non-zero before dividing?',
    description: 'Blighting the trunk/branch fork junction due to an unhandled ZeroDivisionError or TypeError.',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.4)',
  },
  [ParasiteType.STRANGLER_VINE]: {
    type: ParasiteType.STRANGLER_VINE,
    name: 'Strangler Vine',
    emoji: '🌿',
    location: 'central_trunk',
    locationLabel: 'Central Trunk',
    defaultPrompt: 'This strangler vine is choking the trunk because loop execution never terminated. Is your loop counter advancing toward the exit condition on every iteration?',
    description: 'Wrapping the central trunk due to an infinite loop or execution timeout exceeding 2s.',
    color: '#84cc16',
    bg: 'rgba(132, 204, 22, 0.15)',
    border: 'rgba(132, 204, 22, 0.4)',
  },
};

export interface TreeState {
  hp: number; // Range: 20 to 100, default: 80
  xp: number; // Cumulative non-negative integer
  activeBugs: BugType[];
  activeParasites?: ParasiteType[];
  selectedParasite?: ParasiteType | null;
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
  activeParasites: [],
  selectedParasite: null,
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
 * Intercepts Python AST parser and execution errors into localized botanical parasites.
 * - IndexError / Loop boundary -> ParasiteType.CATERPILLAR (branch tip)
 * - Unhandled ZeroDivisionError / TypeError -> ParasiteType.FUNGAL_BLIGHT (node junction)
 * - Infinite loop / execution timeout (>2s) -> ParasiteType.STRANGLER_VINE (central trunk)
 */
export function mapExceptionToParasite(
  errorType?: string,
  stderr?: string,
  durationMs?: number
): ParasiteType | null {
  const combined = `${errorType || ''} ${stderr || ''}`.trim();
  const lower = combined.toLowerCase();

  // 1. Infinite loop / execution timeout (>2s)
  if (
    (durationMs !== undefined && durationMs >= 2000) ||
    lower.includes('timeouterror') ||
    lower.includes('time limit exceeded') ||
    lower.includes('infinite loop') ||
    lower.includes('iteration limit') ||
    lower.includes('unbounded while') ||
    lower.includes('timeout')
  ) {
    return ParasiteType.STRANGLER_VINE;
  }

  // 2. IndexError / Loop boundary
  if (
    errorType === 'IndexError' ||
    lower.includes('indexerror') ||
    lower.includes('index out of range') ||
    lower.includes('list index out of range') ||
    lower.includes('string index out of range') ||
    lower.includes('loop boundary') ||
    lower.includes('off-by-one')
  ) {
    return ParasiteType.CATERPILLAR;
  }

  // 3. Unhandled ZeroDivisionError / TypeError
  if (
    errorType === 'ZeroDivisionError' ||
    errorType === 'TypeError' ||
    lower.includes('zerodivisionerror') ||
    lower.includes('division by zero') ||
    lower.includes('typeerror') ||
    lower.includes('unsupported operand type')
  ) {
    return ParasiteType.FUNGAL_BLIGHT;
  }

  return null;
}

/**
 * Returns a single-sentence Socratic diagnostic prompt for a given parasite type.
 * STRICT PEDAGOGICAL RULE: Must ask a probing question guiding reflection rather than revealing the code solution.
 */
export function generateSocraticPrompt(
  parasite: ParasiteType,
  details?: { errorType?: string; stderr?: string; code?: string }
): string {
  const stderrLower = (details?.stderr || '').toLowerCase();
  const code = details?.code || '';

  switch (parasite) {
    case ParasiteType.CATERPILLAR: {
      if (
        stderrLower.includes('list index out of range') ||
        stderrLower.includes('range') ||
        code.includes('range(') ||
        code.includes('len(')
      ) {
        return 'This leaf is withering because range() tried to access index len(arr). Should this end at len(arr) - 1?';
      }
      return 'This branch tip is withering because an index went beyond the collection boundary. What is the maximum valid index for this sequence?';
    }

    case ParasiteType.FUNGAL_BLIGHT: {
      if (details?.errorType === 'ZeroDivisionError' || stderrLower.includes('division by zero')) {
        return 'This node junction is infected because a denominator reached zero. How can you guard the operation to verify the divisor is non-zero before dividing?';
      }
      if (details?.errorType === 'TypeError' || stderrLower.includes('typeerror')) {
        return 'This node junction is blighted because two incompatible types were combined. Are you performing operations on different data types without converting them?';
      }
      return 'This node junction is infected because an illegal arithmetic or type operation occurred. Did you verify that the divisor is non-zero before dividing?';
    }

    case ParasiteType.STRANGLER_VINE: {
      if (code.includes('while')) {
        return 'This strangler vine is choking the trunk because loop execution never terminated. Is your loop counter advancing toward the exit condition on every iteration?';
      }
      return 'This strangler vine is choking the trunk because loop execution never terminated. Is your loop counter advancing toward the exit condition on every iteration?';
    }
  }
}

/**
 * Pure, deterministic transition function that evaluates exercise results:
 * - If success: +20 XP, +10 HP (capped at 100), remove one resolved bug of matching type.
 * - If failure: -15 HP (enforcing a hard floor of 20), append corresponding BugType and ParasiteType.
 */
export function applyExerciseResult(
  currentState: TreeState,
  isSuccess: boolean,
  errorType?: BugType | ParasiteType | string,
  durationMs?: number,
  stderr?: string
): TreeState {
  if (isSuccess) {
    const nextHp = Math.min(MAX_HP, currentState.hp + HP_SUCCESS_HEAL);
    const nextXp = Math.max(0, currentState.xp + XP_SUCCESS_REWARD);
    const nextActiveBugs = [...currentState.activeBugs];
    let nextActiveParasites = currentState.activeParasites ? [...currentState.activeParasites] : [];

    if (errorType !== undefined) {
      const resolved = resolveBugType(errorType as any);
      const targetIndex = nextActiveBugs.indexOf(resolved);
      if (targetIndex !== -1) {
        nextActiveBugs.splice(targetIndex, 1);
      }

      // Check if errorType is a ParasiteType
      if (Object.values(ParasiteType).includes(errorType as ParasiteType)) {
        nextActiveParasites = nextActiveParasites.filter((p) => p !== errorType);
      }
    } else {
      nextActiveParasites = [];
    }

    return {
      hp: nextHp,
      xp: nextXp,
      activeBugs: nextActiveBugs,
      activeParasites: nextActiveParasites,
      selectedParasite: null,
      streakDays: currentState.streakDays,
    };
  } else {
    const nextHp = Math.max(MIN_HP, currentState.hp - HP_FAILURE_DAMAGE);
    const nextXp = currentState.xp;
    const nextActiveBugs = [...currentState.activeBugs];
    const nextActiveParasites = currentState.activeParasites ? [...currentState.activeParasites] : [];
    const bugToAdd = resolveBugType(errorType as any);

    if (!nextActiveBugs.includes(bugToAdd)) {
      nextActiveBugs.push(bugToAdd);
    }

    // Identify corresponding parasite
    const errorStr = typeof errorType === 'string' ? errorType : undefined;
    const parasiteToAdd =
      (errorType && Object.values(ParasiteType).includes(errorType as ParasiteType)
        ? (errorType as ParasiteType)
        : null) || mapExceptionToParasite(errorStr, stderr, durationMs);

    if (parasiteToAdd && !nextActiveParasites.includes(parasiteToAdd)) {
      nextActiveParasites.push(parasiteToAdd);
    }

    return {
      hp: nextHp,
      xp: nextXp,
      activeBugs: nextActiveBugs,
      activeParasites: nextActiveParasites,
      selectedParasite: parasiteToAdd || (nextActiveParasites.length > 0 ? nextActiveParasites[0] : null),
      streakDays: currentState.streakDays,
    };
  }
}

