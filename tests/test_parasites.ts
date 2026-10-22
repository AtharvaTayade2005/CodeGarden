/**
 * Code Garden - Phase 4 Visual Bug Parasite & AST Localization Test Suite
 * Tests interception of AST parser / execution errors, mapping to ParasiteType,
 * AST node anatomical localization, and single-sentence Socratic diagnostics.
 */

import assert from 'node:assert';
import {
  ParasiteType,
  mapExceptionToParasite,
  PARASITE_DEFINITIONS,
  generateSocraticPrompt,
  applyExerciseResult,
  INITIAL_STATE,
  TreeState,
  BugType,
} from '../lib/treeEngine';
import { runPythonCode } from '../lib/pythonRunner';

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

async function runAsyncTest(testName: string, testFn: () => Promise<void>): Promise<void> {
  totalCount++;
  try {
    await testFn();
    passedCount++;
    console.log(`  ✓ [PASS] ${testName}`);
  } catch (err) {
    console.error(`  ✗ [FAIL] ${testName}`);
    console.error(err);
    throw err;
  }
}

async function main(): Promise<void> {
  console.log('====================================================');
  console.log('  Running Code Garden Visual Bug Parasite Test Suite');
  console.log('====================================================\n');

  // ---------------------------------------------------------------------------
  // TEST 1: Requirement 1 - Intercept & Categorize Errors into ParasiteType
  // ---------------------------------------------------------------------------
  console.log('Test 1: Error Interception & Categorization');

  runTest('1a. IndexError & loop boundary map to ParasiteType.CATERPILLAR', () => {
    assert.strictEqual(mapExceptionToParasite('IndexError'), ParasiteType.CATERPILLAR);
    assert.strictEqual(
      mapExceptionToParasite(undefined, 'IndexError: list index out of range'),
      ParasiteType.CATERPILLAR
    );
    assert.strictEqual(
      mapExceptionToParasite(undefined, 'Loop boundary index exceeded maximum len(arr)'),
      ParasiteType.CATERPILLAR
    );
    assert.strictEqual(
      mapExceptionToParasite(undefined, 'off-by-one boundary error in sequence slice'),
      ParasiteType.CATERPILLAR
    );
  });

  runTest('1b. Unhandled ZeroDivisionError & TypeError map to ParasiteType.FUNGAL_BLIGHT', () => {
    assert.strictEqual(mapExceptionToParasite('ZeroDivisionError'), ParasiteType.FUNGAL_BLIGHT);
    assert.strictEqual(
      mapExceptionToParasite(undefined, 'ZeroDivisionError: division by zero'),
      ParasiteType.FUNGAL_BLIGHT
    );
    assert.strictEqual(mapExceptionToParasite('TypeError'), ParasiteType.FUNGAL_BLIGHT);
    assert.strictEqual(
      mapExceptionToParasite(undefined, 'TypeError: unsupported operand type(s) for +'),
      ParasiteType.FUNGAL_BLIGHT
    );
  });

  runTest('1c. Infinite loop & execution timeout (>2s) map to ParasiteType.STRANGLER_VINE', () => {
    assert.strictEqual(mapExceptionToParasite('TimeoutError'), ParasiteType.STRANGLER_VINE);
    assert.strictEqual(
      mapExceptionToParasite(undefined, 'Execution exceeded 2000ms limit (Infinite loop)'),
      ParasiteType.STRANGLER_VINE
    );
    // Duration >= 2000ms triggers STRANGLER_VINE
    assert.strictEqual(
      mapExceptionToParasite('RuntimeError', 'Execution took too long', 2100),
      ParasiteType.STRANGLER_VINE
    );
    assert.strictEqual(
      mapExceptionToParasite(undefined, 'unbounded while loop detected'),
      ParasiteType.STRANGLER_VINE
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 2: Requirement 2 - AST Node Anatomical Attachment Points
  // ---------------------------------------------------------------------------
  console.log('\nTest 2: AST Node Anatomical Localization');

  runTest('2a. CATERPILLAR attaches directly to the branch tip', () => {
    const caterpillar = PARASITE_DEFINITIONS[ParasiteType.CATERPILLAR];
    assert.strictEqual(caterpillar.location, 'branch_tip');
    assert.strictEqual(caterpillar.locationLabel, 'Branch Tip');
  });

  runTest('2b. FUNGAL_BLIGHT attaches directly at the node junction', () => {
    const fungal = PARASITE_DEFINITIONS[ParasiteType.FUNGAL_BLIGHT];
    assert.strictEqual(fungal.location, 'node_junction');
    assert.strictEqual(fungal.locationLabel, 'Node Junction');
  });

  runTest('2c. STRANGLER_VINE wraps directly around the central trunk', () => {
    const vine = PARASITE_DEFINITIONS[ParasiteType.STRANGLER_VINE];
    assert.strictEqual(vine.location, 'central_trunk');
    assert.strictEqual(vine.locationLabel, 'Central Trunk');
  });

  // ---------------------------------------------------------------------------
  // TEST 3: Requirement 3 - Single-Sentence Socratic Diagnostic Prompts
  // ---------------------------------------------------------------------------
  console.log('\nTest 3: Single-Sentence Socratic Prompts (Pedagogical Guardrails)');

  runTest('3a. Caterpillar prompt is a single sentence questioning bounds without revealing code', () => {
    const prompt = generateSocraticPrompt(ParasiteType.CATERPILLAR, {
      errorType: 'IndexError',
      stderr: 'IndexError: list index out of range',
      code: 'for i in range(len(arr)): print(arr[i+1])',
    });

    assert.ok(prompt.endsWith('?'), 'Prompt must be a Socratic question ending with ?');
    assert.ok(
      !prompt.includes('\n'),
      'Prompt must be a single concise sentence with no line breaks'
    );
    assert.ok(
      prompt.includes('range()') || prompt.includes('len(arr)'),
      'Prompt should guide student attention to range() or len(arr)'
    );
    assert.ok(
      !prompt.includes('def ') && !prompt.includes('return ') && !prompt.includes('fruits ='),
      'Prompt must never reveal full code solutions'
    );
  });

  runTest('3b. Fungal Blight prompt is a single sentence questioning denominator or types', () => {
    const divPrompt = generateSocraticPrompt(ParasiteType.FUNGAL_BLIGHT, {
      errorType: 'ZeroDivisionError',
      stderr: 'ZeroDivisionError: division by zero',
    });

    assert.ok(divPrompt.endsWith('?'), 'Div prompt must be a Socratic question ending with ?');
    assert.ok(!divPrompt.includes('\n'), 'Div prompt must be a single sentence');

    const typePrompt = generateSocraticPrompt(ParasiteType.FUNGAL_BLIGHT, {
      errorType: 'TypeError',
      stderr: 'TypeError: can only concatenate str (not "int") to str',
    });
    assert.ok(typePrompt.endsWith('?'), 'Type prompt must be a Socratic question ending with ?');
    assert.ok(!typePrompt.includes('\n'), 'Type prompt must be a single sentence');
  });

  runTest('3c. Strangler Vine prompt questions loop advancement and termination', () => {
    const prompt = generateSocraticPrompt(ParasiteType.STRANGLER_VINE, {
      errorType: 'TimeoutError',
      code: 'while True: pass',
    });

    assert.ok(prompt.endsWith('?'), 'Vine prompt must end with a question mark');
    assert.ok(!prompt.includes('\n'), 'Vine prompt must be a single sentence');
    assert.ok(
      prompt.includes('loop counter') || prompt.includes('loop'),
      'Prompt must guide reflection on loop condition'
    );
  });

  // ---------------------------------------------------------------------------
  // TEST 4: Deterministic State Transitions with Parasite Tracking
  // ---------------------------------------------------------------------------
  console.log('\nTest 4: State Engine Parasite Lifecycle');

  runTest('4a. Failure attaches corresponding parasite to activeParasites array', () => {
    let state = INITIAL_STATE;
    state = applyExerciseResult(state, false, 'IndexError', 120, 'list index out of range');

    assert.ok(state.activeParasites, 'activeParasites must be defined');
    assert.ok(
      state.activeParasites.includes(ParasiteType.CATERPILLAR),
      'activeParasites must contain CATERPILLAR'
    );
    assert.strictEqual(state.activeBugs[0], BugType.BOUNDARY_BEETLE, 'Legacy bug must remain intact');
  });

  runTest('4b. Duplicate failures do not duplicate parasite entries', () => {
    let state = INITIAL_STATE;
    state = applyExerciseResult(state, false, 'IndexError');
    state = applyExerciseResult(state, false, 'IndexError');

    assert.strictEqual(
      state.activeParasites?.filter((p) => p === ParasiteType.CATERPILLAR).length,
      1,
      'CATERPILLAR should only appear once'
    );
  });

  runTest('4c. Passing the exercise cures the active parasite and heals HP', () => {
    let state: TreeState = {
      hp: 50,
      xp: 200,
      activeBugs: [BugType.BOUNDARY_BEETLE],
      activeParasites: [ParasiteType.CATERPILLAR],
      streakDays: 2,
    };

    state = applyExerciseResult(state, true);
    assert.strictEqual(state.hp, 60, 'Heals +10 HP');
    assert.deepStrictEqual(state.activeParasites, [], 'Parasites must be cleared on success');
  });

  // ---------------------------------------------------------------------------
  // TEST 5: End-to-End Execution Sandbox Integration
  // ---------------------------------------------------------------------------
  console.log('\nTest 5: Python Sandbox Integration with Parasites');

  await runAsyncTest('5a. IndexError in sandbox sets detectedParasite: CATERPILLAR on branch_tip', async () => {
    const code = 'a = [10, 20]; print(a[5])';
    const result = await runPythonCode(code);

    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.detectedParasite, ParasiteType.CATERPILLAR);
    assert.strictEqual(result.astLocation, 'branch_tip');
    assert.ok(result.socraticPrompt, 'Must include Socratic prompt');
    assert.ok(result.socraticPrompt.endsWith('?'), 'Prompt must end with ?');
  });

  await runAsyncTest('5b. ZeroDivisionError in sandbox sets detectedParasite: FUNGAL_BLIGHT at node_junction', async () => {
    const code = 'print(100 // 0)';
    const result = await runPythonCode(code);

    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.detectedParasite, ParasiteType.FUNGAL_BLIGHT);
    assert.strictEqual(result.astLocation, 'node_junction');
    assert.ok(result.socraticPrompt, 'Must include Socratic prompt');
    assert.ok(result.socraticPrompt.endsWith('?'), 'Prompt must end with ?');
  });

  await runAsyncTest('5c. Timeout/Infinite loop sets detectedParasite: STRANGLER_VINE on central_trunk', async () => {
    const code = 'while True: pass';
    const result = await runPythonCode(code);

    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.detectedParasite, ParasiteType.STRANGLER_VINE);
    assert.strictEqual(result.astLocation, 'central_trunk');
    assert.ok(result.socraticPrompt, 'Must include Socratic prompt');
    assert.ok(result.socraticPrompt.endsWith('?'), 'Prompt must end with ?');
  });

  console.log('\n====================================================');
  console.log(`  ALL ${passedCount}/${totalCount} PARASITE TESTS PASSED!`);
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
