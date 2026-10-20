/**
 * Code Garden - Test Runner for Phase 1 Engine
 * Executes deterministic state engine tests using Node's built-in assert module.
 */

import assert from 'node:assert';
import {
  INITIAL_STATE,
  TreeStage,
  BugType,
  applyExerciseResult,
  getTreeStage,
  mapExceptionToBug,
  TreeState,
} from '../lib/treeEngine';
import { initialExercises } from '../lib/curriculumData';

let passedCount = 0;
let totalCount = 0;

function runTest(testName: string, testFn: () => void): void {
  totalCount++;
  try {
    testFn();
    passedCount++;
    console.log(`  ✓ [PASS] ${testName}`);
  } catch (err) {
    console.error(`  ✗ [FAIL] ${testName}`);
    console.error(err);
    throw err;
  }
}

console.log('====================================================');
console.log('  Running Code Garden Phase 1 Engine Test Suite');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: HP Decay & Hard Floor
// -----------------------------------------------------------------------------
console.log('Test 1: HP Floor and Degradation Enforcement');

runTest('Initial state starts at 80 HP, 0 XP, with no active bugs', () => {
  assert.strictEqual(INITIAL_STATE.hp, 80);
  assert.strictEqual(INITIAL_STATE.xp, 0);
  assert.deepStrictEqual(INITIAL_STATE.activeBugs, []);
});

runTest('5 consecutive failures decrement HP from 80 down to exactly 20 (hard floor)', () => {
  let state: TreeState = INITIAL_STATE;
  const expectedHPs = [65, 50, 35, 20, 20];

  for (let i = 0; i < 5; i++) {
    const prevState = state;
    state = applyExerciseResult(state, false, 'IndexError');

    // Immutability check
    assert.notStrictEqual(state, prevState, 'applyExerciseResult must return a new state object');
    assert.strictEqual(
      state.hp,
      expectedHPs[i],
      `Failure ${i + 1} expected HP ${expectedHPs[i]}, received ${state.hp}`
    );
  }

  assert.strictEqual(state.hp, 20, 'HP must be exactly 20 after 5 consecutive failures');
});

runTest('HP never drops below 20 on subsequent failures (6th, 7th, 8th failures)', () => {
  let state: TreeState = {
    hp: 20,
    xp: 40,
    activeBugs: [],
    streakDays: 1,
  };

  for (let i = 1; i <= 3; i++) {
    state = applyExerciseResult(state, false, 'ZeroDivisionError');
    assert.strictEqual(state.hp, 20, `HP dropped below 20 on extra failure #${i}`);
  }
});

// -----------------------------------------------------------------------------
// TEST 2: Stage Transitions and XP Accumulation
// -----------------------------------------------------------------------------
console.log('\nTest 2: XP Accumulation and Tree Stage Transitions (across 99 -> 100 XP)');

runTest('Verify stage boundaries for getTreeStage', () => {
  // SEED: 0 - 99 XP
  assert.strictEqual(getTreeStage(0), TreeStage.SEED);
  assert.strictEqual(getTreeStage(50), TreeStage.SEED);
  assert.strictEqual(getTreeStage(99), TreeStage.SEED);

  // SPROUT: 100 - 299 XP
  assert.strictEqual(getTreeStage(100), TreeStage.SPROUT);
  assert.strictEqual(getTreeStage(200), TreeStage.SPROUT);
  assert.strictEqual(getTreeStage(299), TreeStage.SPROUT);

  // SAPLING: 300 - 699 XP
  assert.strictEqual(getTreeStage(300), TreeStage.SAPLING);
  assert.strictEqual(getTreeStage(500), TreeStage.SAPLING);
  assert.strictEqual(getTreeStage(699), TreeStage.SAPLING);

  // FLOURISHING_TREE: 700+ XP
  assert.strictEqual(getTreeStage(700), TreeStage.FLOURISHING_TREE);
  assert.strictEqual(getTreeStage(1200), TreeStage.FLOURISHING_TREE);
});

runTest('Passing an exercise transitions XP and updates stages across 99 -> 100 XP', () => {
  // Starting at 80 XP (SEED stage)
  const seedState: TreeState = {
    hp: 70,
    xp: 80,
    activeBugs: [],
    streakDays: 2,
  };

  assert.strictEqual(getTreeStage(seedState.xp), TreeStage.SEED);

  // Success grants +20 XP, moving from 80 -> 100 XP
  const sproutState = applyExerciseResult(seedState, true);
  assert.strictEqual(sproutState.xp, 100);
  assert.strictEqual(getTreeStage(sproutState.xp), TreeStage.SPROUT);
  assert.strictEqual(sproutState.hp, 80); // Heals +10 HP

  // Testing exact 99 XP boundary state
  const boundaryState: TreeState = {
    hp: 50,
    xp: 99,
    activeBugs: [],
    streakDays: 3,
  };
  assert.strictEqual(getTreeStage(boundaryState.xp), TreeStage.SEED);
  const postBoundary = applyExerciseResult(boundaryState, true);
  assert.strictEqual(postBoundary.xp, 119);
  assert.strictEqual(getTreeStage(postBoundary.xp), TreeStage.SPROUT);
});

// -----------------------------------------------------------------------------
// TEST 3: Exception to Bug Type Mappings
// -----------------------------------------------------------------------------
console.log('\nTest 3: Verify all 4 Botanical Parasite (Bug) Mappings');

runTest('1. BOUNDARY_BEETLE maps IndexError, ZeroDivisionError, OverflowError', () => {
  assert.strictEqual(mapExceptionToBug('IndexError'), BugType.BOUNDARY_BEETLE);
  assert.strictEqual(mapExceptionToBug('ZeroDivisionError'), BugType.BOUNDARY_BEETLE);
  assert.strictEqual(mapExceptionToBug('OverflowError'), BugType.BOUNDARY_BEETLE);
});

runTest('2. STRUCTURE_CATERPILLAR maps SyntaxError, IndentationError, TabError, and defaults', () => {
  assert.strictEqual(mapExceptionToBug('SyntaxError'), BugType.STRUCTURE_CATERPILLAR);
  assert.strictEqual(mapExceptionToBug('IndentationError'), BugType.STRUCTURE_CATERPILLAR);
  assert.strictEqual(mapExceptionToBug('TabError'), BugType.STRUCTURE_CATERPILLAR);
  // Default fallback
  assert.strictEqual(mapExceptionToBug('UnknownCustomError'), BugType.STRUCTURE_CATERPILLAR);
  assert.strictEqual(mapExceptionToBug(''), BugType.STRUCTURE_CATERPILLAR);
});

runTest('3. SCOPE_SLUG maps NameError, UnboundLocalError, AttributeError', () => {
  assert.strictEqual(mapExceptionToBug('NameError'), BugType.SCOPE_SLUG);
  assert.strictEqual(mapExceptionToBug('UnboundLocalError'), BugType.SCOPE_SLUG);
  assert.strictEqual(mapExceptionToBug('AttributeError'), BugType.SCOPE_SLUG);
});

runTest('4. LOOP_WEED maps TimeoutError, Infinite Loop, Iteration limit exceeded', () => {
  assert.strictEqual(mapExceptionToBug('TimeoutError'), BugType.LOOP_WEED);
  assert.strictEqual(mapExceptionToBug('Infinite Loop'), BugType.LOOP_WEED);
  assert.strictEqual(mapExceptionToBug('Iteration limit exceeded'), BugType.LOOP_WEED);
  assert.strictEqual(mapExceptionToBug('IterationLimitExceeded'), BugType.LOOP_WEED);
  assert.strictEqual(mapExceptionToBug('TimeLimitExceeded'), BugType.LOOP_WEED);
});

// -----------------------------------------------------------------------------
// TEST 4: Bug Addition, De-duplication, and Resolution Lifecycle
// -----------------------------------------------------------------------------
console.log('\nTest 4: Parasite Lifecycle and HP Clamping');

runTest('Bugs are appended on failure without duplicates, and removed on resolution', () => {
  let state = INITIAL_STATE;

  // Failure with IndexError adds BOUNDARY_BEETLE
  state = applyExerciseResult(state, false, 'IndexError');
  assert.deepStrictEqual(state.activeBugs, [BugType.BOUNDARY_BEETLE]);

  // Duplicate failure of same bug type does not duplicate entry
  state = applyExerciseResult(state, false, 'ZeroDivisionError'); // Also BOUNDARY_BEETLE
  assert.deepStrictEqual(state.activeBugs, [BugType.BOUNDARY_BEETLE]);

  // Failure with NameError adds SCOPE_SLUG
  state = applyExerciseResult(state, false, 'NameError');
  assert.deepStrictEqual(state.activeBugs, [BugType.BOUNDARY_BEETLE, BugType.SCOPE_SLUG]);

  // Success resolving BOUNDARY_BEETLE removes it
  state = applyExerciseResult(state, true, BugType.BOUNDARY_BEETLE);
  assert.deepStrictEqual(state.activeBugs, [BugType.SCOPE_SLUG]);

  // Success resolving with exception name string 'AttributeError' (which maps to SCOPE_SLUG)
  state = applyExerciseResult(state, true, 'AttributeError');
  assert.deepStrictEqual(state.activeBugs, []);
});

runTest('HP heals on success and is capped at 100', () => {
  let state: TreeState = {
    hp: 95,
    xp: 40,
    activeBugs: [],
    streakDays: 1,
  };

  state = applyExerciseResult(state, true);
  assert.strictEqual(state.hp, 100, 'HP capped at 100 when healing from 95');

  state = applyExerciseResult(state, true);
  assert.strictEqual(state.hp, 100, 'HP remains at 100 on further success');
});

// -----------------------------------------------------------------------------
// TEST 5: Curriculum Data Validation
// -----------------------------------------------------------------------------
console.log('\nTest 5: Curriculum Seed Exercises Integrity');

runTest('Verify all 5 required seed exercises exist with 3 scaffolding hints and test cases', () => {
  assert.strictEqual(initialExercises.length, 5, 'Must have exactly 5 initial exercises');

  const expectedTitles = [
    'Variable Swap & Print',
    'Pass-Fail Boundary',
    'Accumulator Loop',
    'Safe Divider Guard',
    'List Index Traversal',
  ];

  initialExercises.forEach((ex, idx) => {
    assert.strictEqual(ex.title, expectedTitles[idx]);
    assert.ok(ex.id && ex.id.length > 0, `Exercise ${idx} has valid id`);
    assert.ok(ex.concept && ex.concept.length > 0, `Exercise ${idx} has valid concept`);
    assert.ok(ex.starterCode && ex.starterCode.length > 0, `Exercise ${idx} has starterCode`);
    assert.ok(Array.isArray(ex.testCases) && ex.testCases.length >= 3, `Exercise ${idx} has at least 3 test cases`);
    assert.strictEqual(ex.scaffoldingHints.length, 3, `Exercise ${idx} must have 3 scaffolding hint tiers`);

    // Verify test case schema
    ex.testCases.forEach((tc) => {
      assert.strictEqual(typeof tc.input, 'string');
      assert.strictEqual(typeof tc.expectedOutput, 'string');
      assert.strictEqual(typeof tc.isHidden, 'boolean');
    });
  });
});

console.log('\n====================================================');
console.log(`  ALL ${passedCount}/${totalCount} TESTS PASSED SUCCESSFULLY!`);
console.log('====================================================\n');
