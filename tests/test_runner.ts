/**
 * Code Garden - Phase 2 Python AST & Sandbox Runner Test Suite
 * Tests Python execution, timeout enforcement, exception traceback parsing, and security blocking.
 */

import assert from 'node:assert';
import { runPythonCode, inspectCodeSafety } from '../lib/pythonRunner';
import { BugType } from '../lib/treeEngine';

let passedCount = 0;
let totalCount = 0;

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
  console.log('  Running Code Garden Phase 2 Runner Test Suite');
  console.log('====================================================\n');

  // ---------------------------------------------------------------------------
  // Test A: Valid addition code
  // ---------------------------------------------------------------------------
  console.log('Test A: Valid Addition Code');
  await runAsyncTest(
    'Run valid addition code print(int(input()) + 5) with input 10 -> passes with output 15',
    async () => {
      const code = 'print(int(input()) + 5)';
      const result = await runPythonCode(code, [
        {
          input: '10',
          expectedOutput: '15',
          isHidden: false,
        },
      ]);

      assert.strictEqual(result.passed, true, 'Execution must pass');
      assert.strictEqual(result.stdout.trim(), '15', 'Output must equal 15');
      assert.strictEqual(result.errorType, undefined, 'No errorType should be present');
      assert.strictEqual(result.detectedBug, undefined, 'No detectedBug should be present');
      assert.strictEqual(result.stderr, '', 'Stderr must be empty');
      assert.ok(result.executionTimeMs >= 0, 'Execution time must be recorded');
    }
  );

  // ---------------------------------------------------------------------------
  // Test B: Invalid index code (IndexError)
  // ---------------------------------------------------------------------------
  console.log('\nTest B: Traceback Extraction & Bug Mapping');
  await runAsyncTest(
    'Run invalid index code a = []; print(a[0]) -> fails with IndexError and returns BOUNDARY_BEETLE',
    async () => {
      const code = 'a = []; print(a[0])';
      const result = await runPythonCode(code);

      assert.strictEqual(result.passed, false, 'Execution must fail');
      assert.strictEqual(result.errorType, 'IndexError', 'Extracted errorType must be IndexError');
      assert.strictEqual(
        result.detectedBug,
        BugType.BOUNDARY_BEETLE,
        'Detected bug must be BOUNDARY_BEETLE'
      );
      assert.ok(result.stderr.includes('IndexError'), 'Stderr must contain IndexError traceback');
    }
  );

  // ---------------------------------------------------------------------------
  // Test C: Infinite loop (Timeout & LOOP_WEED)
  // ---------------------------------------------------------------------------
  console.log('\nTest C: Sandbox Timeout Enforcement');
  await runAsyncTest(
    'Run infinite loop while True: pass -> aborts within 3.5s and returns LOOP_WEED',
    async () => {
      const startTime = Date.now();
      const code = 'while True: pass';
      const result = await runPythonCode(code);
      const wallClockElapsed = Date.now() - startTime;

      assert.strictEqual(result.passed, false, 'Execution must fail on timeout');
      assert.strictEqual(result.errorType, 'TimeoutError', 'Error type must be TimeoutError');
      assert.strictEqual(
        result.detectedBug,
        BugType.LOOP_WEED,
        'Detected bug must be LOOP_WEED'
      );
      assert.ok(
        wallClockElapsed <= 3500,
        `Execution must abort within 3.5s (took ${wallClockElapsed}ms)`
      );
      assert.ok(
        wallClockElapsed >= 2900,
        `Execution should run close to 3000ms timeout (took ${wallClockElapsed}ms)`
      );
      assert.ok(
        result.stderr.includes('TimeoutError'),
        'Stderr must describe the timeout error'
      );
    }
  );

  // ---------------------------------------------------------------------------
  // Test D: Security Sandbox Interception
  // ---------------------------------------------------------------------------
  console.log('\nTest D: Static Security Inspection');
  await runAsyncTest(
    'Run forbidden import import os; os.system("ls") -> immediately blocked with security violation error',
    async () => {
      const startTime = Date.now();
      const code = 'import os; os.system("ls")';
      const result = await runPythonCode(code);
      const wallClockElapsed = Date.now() - startTime;

      assert.strictEqual(result.passed, false, 'Execution must be rejected');
      assert.strictEqual(
        result.errorType,
        'SecurityViolationError',
        'Error type must be SecurityViolationError'
      );
      assert.ok(
        result.stderr.toLowerCase().includes('securityviolationerror') ||
          result.stderr.toLowerCase().includes('forbidden'),
        'Stderr must detail the security violation'
      );
      assert.strictEqual(
        result.detectedBug,
        BugType.STRUCTURE_CATERPILLAR,
        'Detected bug should default to STRUCTURE_CATERPILLAR'
      );
      assert.ok(
        wallClockElapsed < 100,
        `Forbidden code must be intercepted immediately without spawning child process (took ${wallClockElapsed}ms)`
      );
    }
  );

  // ---------------------------------------------------------------------------
  // Additional security & validation coverage
  // ---------------------------------------------------------------------------
  console.log('\nAdditional Sandbox & Traceback Tests');
  await runAsyncTest('Block other dangerous imports and builtins (sys, subprocess, open)', async () => {
    const dangerousSnippets = [
      'import sys\nsys.exit(0)',
      'import subprocess\nsubprocess.run(["dir"])',
      'f = open("secret.txt", "w")',
      '__import__("os")',
    ];

    for (const snippet of dangerousSnippets) {
      const inspection = inspectCodeSafety(snippet);
      assert.strictEqual(inspection.isSafe, false, `Snippet should be blocked: ${snippet}`);

      const result = await runPythonCode(snippet);
      assert.strictEqual(result.passed, false);
      assert.strictEqual(result.errorType, 'SecurityViolationError');
    }
  });

  await runAsyncTest('Semantic traceback parsing on NameError -> SCOPE_SLUG', async () => {
    const result = await runPythonCode('print(unknown_symbol_xyz)');
    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.errorType, 'NameError');
    assert.strictEqual(result.detectedBug, BugType.SCOPE_SLUG);
  });

  console.log('\n====================================================');
  console.log(`  ALL ${passedCount}/${totalCount} TESTS PASSED SUCCESSFULLY!`);
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('Fatal test failure:', err);
  process.exit(1);
});
