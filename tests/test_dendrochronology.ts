/**
 * Code Garden - Dendrochronology State Machine Test Suite
 * Tests telemetry event logging, consecutive failure drought detection (<45s),
 * clear growth classification, and tree ring generation.
 */

import assert from 'node:assert';
import {
  evaluateExecutionEvent,
  createKeystrokePoint,
  generateInitialTelemetryRings,
  INITIAL_TELEMETRY_CONTEXT,
  StateMachineContext,
} from '../lib/dendrochronology';
import { INITIAL_STATE, BugType } from '../lib/treeEngine';

console.log('====================================================');
console.log('  Running Code Garden Dendrochronology Test Suite');
console.log('====================================================\n');

let passedCount = 0;
let totalCount = 0;

function runTest(testName: string, testFn: () => void) {
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

// -----------------------------------------------------------------------------
// TEST 1: Baseline Rings Initialization
// -----------------------------------------------------------------------------
console.log('Test 1: Initial Tree Ring Cross-Section Data Model');
runTest('generateInitialTelemetryRings creates valid concentric rings', () => {
  const starter = 'a = int(input())\nb = int(input())';
  const rings = generateInitialTelemetryRings(starter, INITIAL_STATE);

  assert.ok(rings.length >= 4, 'Should initialize with realistic learning trajectory rings');
  rings.forEach((r, idx) => {
    assert.strictEqual(typeof r.timestamp, 'number');
    assert.strictEqual(typeof r.deltaLength, 'number');
    assert.strictEqual(typeof r.errorCount, 'number');
    assert.ok(['idle', 'burst', 'stuck', 'recovered'].includes(r.state));
    assert.ok(r.codeSnapshot.length > 0, `Ring ${idx} has code snapshot`);
    assert.ok(r.treeState && typeof r.treeState.hp === 'number');
  });
});

// -----------------------------------------------------------------------------
// TEST 2: Drought / Thrashing State Machine (< 45s threshold)
// -----------------------------------------------------------------------------
console.log('\nTest 2: Drought / Thrashing State Detection');
runTest('Flags drought/thrashing when consecutive failures happen within < 45 seconds', () => {
  let ctx: StateMachineContext = { ...INITIAL_TELEMETRY_CONTEXT };
  const baseCode = 'for i in range(n):';

  // 1st failure: sets lastFailureTime
  const res1 = evaluateExecutionEvent(false, baseCode, INITIAL_STATE, ctx, baseCode);
  assert.strictEqual(res1.telemetryPoint.state, 'stuck');
  assert.strictEqual(res1.updatedContext.consecutiveFailures, 1);

  // 2nd failure 10 seconds later (< 45 seconds)
  ctx = res1.updatedContext;
  ctx.lastFailureTime = Date.now() - 10000; // 10 seconds ago

  const res2 = evaluateExecutionEvent(false, baseCode, INITIAL_STATE, ctx, baseCode);
  assert.strictEqual(res2.telemetryPoint.state, 'stuck');
  assert.strictEqual(res2.telemetryPoint.ringType, 'drought_thrashing');
  assert.ok(res2.telemetryPoint.label.includes('Drought / Thrashing'));
  assert.ok((res2.telemetryPoint.nodeCount || 0) >= 2, 'Should create nodes/knots in wood ring');
});

// -----------------------------------------------------------------------------
// TEST 3: Clear Growth State Machine (Recovered without hints)
// -----------------------------------------------------------------------------
console.log('\nTest 3: Clear Growth State Detection');
runTest('Marks slice as "clear growth" when student resolves bug without AI hints', () => {
  // Context where student had an active bug, but used 0 hints
  const ctxWithBugNoHints: StateMachineContext = {
    ...INITIAL_TELEMETRY_CONTEXT,
    hadBugBeforeRun: true,
    hintsUsedForCurrentBug: 0,
    totalErrorsEncountered: 2,
  };

  const solvedCode = 'a, b = b, a\nprint(f"{a} {b}")';
  const res = evaluateExecutionEvent(
    true,
    solvedCode,
    { ...INITIAL_STATE, hp: 85, xp: 40 },
    ctxWithBugNoHints,
    'a = temp'
  );

  assert.strictEqual(res.telemetryPoint.state, 'recovered');
  assert.strictEqual(res.telemetryPoint.ringType, 'clear_growth');
  assert.ok(res.telemetryPoint.label.includes('Clear Growth'));
  assert.strictEqual(res.updatedContext.hadBugBeforeRun, false);
  assert.strictEqual(res.updatedContext.consecutiveFailures, 0);
});

// -----------------------------------------------------------------------------
// TEST 4: Scaffolded Growth (Recovered with hints)
// -----------------------------------------------------------------------------
console.log('\nTest 4: Hint-Scaffolded Growth Classification');
runTest('Distinguishes hint-scaffolded recovery from independent clear growth', () => {
  const ctxWithBugAndHints: StateMachineContext = {
    ...INITIAL_TELEMETRY_CONTEXT,
    hadBugBeforeRun: true,
    hintsUsedForCurrentBug: 2, // Used 2 hints
    totalErrorsEncountered: 3,
  };

  const solvedCode = 'a, b = b, a\nprint(f"{a} {b}")';
  const res = evaluateExecutionEvent(
    true,
    solvedCode,
    { ...INITIAL_STATE, hp: 85, xp: 40 },
    ctxWithBugAndHints,
    'a = temp'
  );

  assert.strictEqual(res.telemetryPoint.state, 'recovered');
  assert.strictEqual(res.telemetryPoint.ringType, 'hint_scaffold');
  assert.ok(res.telemetryPoint.label.includes('Scaffolded Growth'));
});

// -----------------------------------------------------------------------------
// TEST 5: Keystroke Burst vs Idle Classification
// -----------------------------------------------------------------------------
console.log('\nTest 5: Keystroke Burst and Reflective Pause Tracking');
runTest('Accurately flags burst exploration vs reflective pause', () => {
  const ctxRecentKey: StateMachineContext = {
    ...INITIAL_TELEMETRY_CONTEXT,
    lastKeystrokeTime: Date.now() - 1000, // typed 1s ago
  };

  const burstRes = createKeystrokePoint('def foo(): pass', 'def foo():', INITIAL_STATE, ctxRecentKey);
  assert.strictEqual(burstRes.telemetryPoint.state, 'burst');
  assert.strictEqual(burstRes.telemetryPoint.ringType, 'burst_exploration');

  const ctxOldKey: StateMachineContext = {
    ...INITIAL_TELEMETRY_CONTEXT,
    lastKeystrokeTime: Date.now() - 15000, // 15s ago
  };

  const idleRes = createKeystrokePoint('same code', 'same code', INITIAL_STATE, ctxOldKey);
  assert.strictEqual(idleRes.telemetryPoint.state, 'idle');
  assert.strictEqual(idleRes.telemetryPoint.ringType, 'idle_pause');
});

console.log('\n====================================================');
console.log(`  ALL ${passedCount}/${totalCount} DENDROCHRONOLOGY TESTS PASSED!`);
console.log('====================================================\n');
