/**
 * Code Garden - Phase 3 Calibrated Fading AI Hint Service Test Suite
 * Evaluates pedagogical scaffolding tiers (Socratic Question -> Pseudocode -> Code Skeleton),
 * fallback mechanisms, and strict zero-tolerance solution stripping guardrails.
 */

import assert from 'node:assert';
import { initialExercises } from '../lib/curriculumData';
import { runPythonCode } from '../lib/pythonRunner';
import { BugType } from '../lib/treeEngine';
import {
  generateScaffoldingHint,
  enforceScaffoldingGuardrails,
  stripFullSolutions,
  ScaffoldingResponse,
} from '../lib/scaffoldingEngine';

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
  console.log('  Running Code Garden Phase 3 Scaffolding Test Suite');
  console.log('====================================================\n');

  const exercise = initialExercises[0]; // "Variable Swap & Print"

  // ---------------------------------------------------------------------------
  // Step 1: Simulate Execution Failure with Missing Variable (NameError)
  // ---------------------------------------------------------------------------
  console.log('Step 1: Simulating runtime execution failure with missing variable');

  // Student code references undefined variable 'temp_c'
  const failingStudentCode = `a = int(input())
b = int(input())
# Bug: student references undefined variable temp_c
a = temp_c
print(f"{a} {b}")
`;

  const executionResult = await runPythonCode(failingStudentCode, [
    { input: '5\n10', expectedOutput: '10 5', isHidden: false },
  ]);

  assert.strictEqual(executionResult.passed, false, 'Student code must fail');
  assert.strictEqual(executionResult.errorType, 'NameError', 'Must fail with NameError');
  assert.strictEqual(
    executionResult.detectedBug,
    BugType.SCOPE_SLUG,
    'Botanical bug must be SCOPE_SLUG'
  );
  console.log('  ✓ Verified runtime failure: NameError (SCOPE_SLUG)\n');

  // ---------------------------------------------------------------------------
  // Step 2: Test 3 Consecutive Attempts with Fading Scaffolding
  // ---------------------------------------------------------------------------
  console.log('Step 2: Evaluating 3 Consecutive Attempt Tiers');

  // Attempt 1: TIER 1 - Socratic Question
  await runAsyncTest(
    'Attempt 1: Returns Tier 1 Socratic Question with zero code snippets or syntax',
    async () => {
      const response = await generateScaffoldingHint({
        exercise,
        studentCode: failingStudentCode,
        executionResult,
        attemptCount: 1,
      });

      assert.strictEqual(response.tier, 1, 'Tier must be 1');
      assert.strictEqual(response.tierName, 'Socratic Question', 'Tier name must be Socratic Question');
      assert.strictEqual(response.allowedSnippet, undefined, 'Tier 1 must have no allowedSnippet');
      assert.ok(response.guidanceText.includes('?'), 'Tier 1 guidance must be a question');

      // Verify no code blocks, syntax, or keywords in Tier 1 guidance
      assert.strictEqual(
        /```|def\s|print\(|input\(/.test(response.guidanceText),
        false,
        'Tier 1 guidance must not show code syntax or executable statements'
      );
    }
  );

  // Attempt 2: TIER 2 - Pseudocode Outline
  await runAsyncTest(
    'Attempt 2: Returns Tier 2 Pseudocode Outline with 3-line structural logic plan',
    async () => {
      const response = await generateScaffoldingHint({
        exercise,
        studentCode: failingStudentCode,
        executionResult,
        attemptCount: 2,
      });

      assert.strictEqual(response.tier, 2, 'Tier must be 2');
      assert.strictEqual(response.tierName, 'Pseudocode Outline', 'Tier name must be Pseudocode Outline');
      assert.ok(
        response.guidanceText.toLowerCase().includes('step') ||
          response.guidanceText.toLowerCase().includes('plan') ||
          response.guidanceText.split('\n').filter((l) => l.trim().length > 0).length >= 3,
        'Tier 2 guidance must present a multi-step logic plan'
      );
      assert.ok(
        response.allowedSnippet !== undefined,
        'Tier 2 may provide pseudocode outline in allowedSnippet'
      );
      assert.ok(
        response.allowedSnippet.toLowerCase().includes('step'),
        'Pseudocode outline must detail structural steps'
      );
    }
  );

  // Attempt 3: TIER 3 - Code Skeleton
  await runAsyncTest(
    'Attempt 3: Returns Tier 3 Code Skeleton containing fill-in blanks (___)',
    async () => {
      const response = await generateScaffoldingHint({
        exercise,
        studentCode: failingStudentCode,
        executionResult,
        attemptCount: 3,
      });

      assert.strictEqual(response.tier, 3, 'Tier must be 3');
      assert.strictEqual(response.tierName, 'Code Skeleton', 'Tier name must be Code Skeleton');
      assert.ok(response.allowedSnippet !== undefined, 'Tier 3 must provide an allowedSnippet');
      assert.ok(
        response.allowedSnippet.includes('___'),
        'Tier 3 allowedSnippet must contain fill-in blanks (___)'
      );
    }
  );

  // ---------------------------------------------------------------------------
  // Step 3: Zero-Tolerance Solution Stripping Guardrails
  // ---------------------------------------------------------------------------
  console.log('\nStep 3: Evaluating Zero-Tolerance Guardrails & Solution Stripping');

  await runAsyncTest(
    'Guardrail catches and strips complete working program without blanks',
    async () => {
      // Adversarial mock response leaking the full working code without blanks
      const leakedFullCodeResponse: ScaffoldingResponse = {
        tier: 3,
        tierName: 'Code Skeleton',
        guidanceText: 'Here is the full solution:\na, b = b, a\nprint(f"{a} {b}")',
        allowedSnippet: 'a, b = b, a\nprint(f"{a} {b}")', // Full working solution leaked!
      };

      const sanitized = enforceScaffoldingGuardrails(leakedFullCodeResponse, exercise);

      // The full working solution must NOT be preserved as-is
      assert.ok(
        sanitized.allowedSnippet?.includes('___'),
        'Sanitized snippet must replace full code with blanked template (___)'
      );
      assert.strictEqual(
        sanitized.allowedSnippet?.includes('a, b = b, a'),
        false,
        'Complete working line a, b = b, a must not be leaked'
      );
      assert.strictEqual(
        sanitized.guidanceText.includes('Here is the full solution:'),
        false,
        'Direct solution announcement must be stripped from guidance'
      );
    }
  );

  await runAsyncTest(
    'Guardrail strips leaked code and enforces Socratic Question in Tier 1',
    async () => {
      // Adversarial mock response attempting to leak code during Tier 1
      const leakedTier1Response: ScaffoldingResponse = {
        tier: 1,
        tierName: 'Socratic Question',
        guidanceText: 'Here is the answer: just write ```python\na, b = b, a\n```',
        allowedSnippet: 'a, b = b, a',
      };

      const sanitized = enforceScaffoldingGuardrails(leakedTier1Response, exercise);

      assert.strictEqual(sanitized.tier, 1);
      assert.strictEqual(
        sanitized.allowedSnippet,
        undefined,
        'Tier 1 must never have an allowedSnippet'
      );
      assert.strictEqual(
        sanitized.guidanceText.includes('```'),
        false,
        'Code blocks must be removed from Tier 1 guidance'
      );
      assert.strictEqual(
        sanitized.guidanceText.includes('a, b = b, a'),
        false,
        'Code statements must be removed from Tier 1 guidance'
      );
      assert.ok(
        sanitized.guidanceText.includes('?'),
        'Tier 1 guidance must remain a Socratic question'
      );
    }
  );

  await runAsyncTest(
    'stripFullSolutions utility helper correctly identifies and redacts solution patterns',
    async () => {
      const rawText = 'The answer is: a, b = b, a';
      const result = stripFullSolutions(rawText, exercise);

      assert.strictEqual(result.wasStripped, true, 'Solution leak must be detected');
      assert.strictEqual(
        result.sanitized.includes('a, b = b, a'),
        false,
        'Direct answer must be redacted'
      );
      assert.ok(
        result.sanitized.includes('___') || result.sanitized.includes('step-by-step'),
        'Redacted text must redirect student toward independent problem-solving'
      );
    }
  );

  console.log('\n====================================================');
  console.log(`  ALL ${passedCount}/${totalCount} TESTS PASSED SUCCESSFULLY!`);
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('Fatal test failure:', err);
  process.exit(1);
});
