/**
 * Code Garden - Calibrated Fading AI Hint Service
 * Generates pedagogical scaffolding hints (Socratic Question -> Pseudocode -> Code Skeleton)
 * with strict guardrails against copy-pasteable solutions and robust local fallbacks.
 */

import { Exercise, initialExercises } from './curriculumData';
import { ExecutionResult } from './pythonRunner';

export interface ScaffoldingResponse {
  tier: 1 | 2 | 3;
  tierName: 'Socratic Question' | 'Pseudocode Outline' | 'Code Skeleton';
  guidanceText: string;
  allowedSnippet?: string;
}

export interface ScaffoldingParams {
  exercise: Exercise;
  studentCode: string;
  executionResult: ExecutionResult;
  attemptCount: number;
}

/**
 * Calibrated fallback templates for the pre-seeded curriculum exercises.
 */
interface FallbackCurriculumHint {
  tier1Question: string;
  tier2Pseudocode: string;
  tier3Skeleton: string;
}

const CURRICULUM_FALLBACKS: Record<string, FallbackCurriculumHint> = {
  'variable-swap-print': {
    tier1Question:
      'How can you swap both variables simultaneously so that neither value is overwritten before it can be assigned?',
    tier2Pseudocode:
      'Step 1: Read initial values for a and b from input.\nStep 2: Assign the second value to a and the first value to b simultaneously using tuple unpacking.\nStep 3: Print both variables separated by a space.',
    tier3Skeleton:
      'a = int(input())\nb = int(input())\na, b = ___, ___\nprint(f"{a} {b}")',
  },
  'pass-fail-boundary': {
    tier1Question:
      'What exact comparison operator includes the boundary score of 50 as passing rather than strictly greater than 50?',
    tier2Pseudocode:
      "Step 1: Read the student score integer from input.\nStep 2: Evaluate if score is greater than or equal to 50.\nStep 3: If true display 'Pass', otherwise display 'Fail'.",
    tier3Skeleton:
      'score = int(input())\nif score >= ___:\n    print("Pass")\nelse:\n    print("Fail")',
  },
  'accumulator-loop': {
    tier1Question:
      'What starting value should your total accumulator hold, and how must you configure the stop parameter of range() to include n?',
    tier2Pseudocode:
      'Step 1: Initialize accumulator variable total to 0.\nStep 2: Iterate across all integers from 1 up to and including n using range().\nStep 3: Add each step number to total and print the final value.',
    tier3Skeleton:
      'n = int(input())\ntotal = 0\nfor i in range(1, ___):\n    total += ___\nprint(total)',
  },
  'safe-divider-guard': {
    tier1Question:
      'What specific denominator value triggers a ZeroDivisionError, and how can you check for it before dividing?',
    tier2Pseudocode:
      "Step 1: Read numerator a and denominator b from input.\nStep 2: Check if denominator b is equal to 0.\nStep 3: If zero output 'Error: Division by zero', otherwise compute integer division a // b.",
    tier3Skeleton:
      'a = int(input())\nb = int(input())\nif b == ___:\n    print("Error: Division by zero")\nelse:\n    print(a // ___)',
  },
  'list-index-traversal': {
    tier1Question:
      'Given 0-based indexing in Python, what are the lowest and highest valid index positions for a list of 4 items?',
    tier2Pseudocode:
      "Step 1: Read the index integer from input.\nStep 2: Verify index is non-negative and strictly less than the length of fruits.\nStep 3: Print fruits[idx] if valid, otherwise print 'Index out of bounds'.",
    tier3Skeleton:
      'fruits = ["apple", "banana", "cherry", "date"]\nidx = int(input())\nif 0 <= idx < ___:\n    print(fruits[___])\nelse:\n    print("Index out of bounds")',
  },
};

/**
 * Generates dynamic fallback questions for arbitrary or unknown exercises based on error type.
 */
function getGenericSocraticQuestion(exercise: Exercise, executionResult: ExecutionResult): string {
  switch (executionResult.errorType) {
    case 'NameError':
      return 'What variable name was referenced in your code before it was defined or assigned a value?';
    case 'IndexError':
      return `What bounds must you verify before accessing index positions in a collection?`;
    case 'ZeroDivisionError':
      return 'What condition must you guard against so that the denominator is never zero when dividing?';
    case 'TimeoutError':
      return 'How does your loop condition progress toward termination with each successive iteration?';
    case 'SyntaxError':
      return 'Where might there be a missing colon, parenthesis, or mismatched indentation in your statement?';
    default:
      return `How does your code address the concept of ${exercise.concept} for all expected input cases?`;
  }
}

/**
 * Generates local calibrated hints when LLM_API_KEY is not set or network request fails.
 */
export function generateLocalScaffoldingHint(params: {
  exercise: Exercise;
  studentCode: string;
  executionResult: ExecutionResult;
  attemptCount: number;
}): ScaffoldingResponse {
  const { exercise, executionResult, attemptCount } = params;
  const fallback = CURRICULUM_FALLBACKS[exercise.id];

  if (attemptCount <= 1) {
    const question = fallback
      ? fallback.tier1Question
      : getGenericSocraticQuestion(exercise, executionResult);

    return {
      tier: 1,
      tierName: 'Socratic Question',
      guidanceText: question,
      allowedSnippet: undefined,
    };
  } else if (attemptCount === 2) {
    const pseudocode = fallback
      ? fallback.tier2Pseudocode
      : `Step 1: Read input values and initialize required variables.\nStep 2: Implement logic for ${exercise.concept} with appropriate conditions or loops.\nStep 3: Output the expected result format.`;

    return {
      tier: 2,
      tierName: 'Pseudocode Outline',
      guidanceText: `Follow this 3-line structural logic plan:\n${pseudocode}`,
      allowedSnippet: pseudocode,
    };
  } else {
    const skeleton = fallback
      ? fallback.tier3Skeleton
      : `# Fill in the blanks:\n${exercise.starterCode.replace(/TODO:.*$/m, '___ = ___')}`;

    return {
      tier: 3,
      tierName: 'Code Skeleton',
      guidanceText: 'Complete the code by filling in the blanks (___):',
      allowedSnippet: skeleton,
    };
  }
}

/**
 * Scans content to detect and strip complete working programs or answers.
 */
export function stripFullSolutions(
  content: string,
  exercise: Exercise
): { sanitized: string; wasStripped: boolean } {
  let wasStripped = false;
  let sanitized = content;

  // Pattern 1: Refuse and strip phrases like "Here is the full solution" or "Here is the answer"
  const answerGiveawayRegex =
    /(?:here\s+is\s+(?:the\s+)?(?:full\s+)?(?:solution|code|answer|complete\s+program)|the\s+answer\s+is|solution:)\s*[:\n]*/gi;
  if (answerGiveawayRegex.test(sanitized)) {
    sanitized = sanitized.replace(
      answerGiveawayRegex,
      'Work through the logic step-by-step rather than copying a direct solution: '
    );
    wasStripped = true;
  }

  // Pattern 2: Detect complete code blocks matching known working solutions without blanks
  const knownWorkingPatterns = [
    /a\s*,\s*b\s*=\s*b\s*,\s*a/,
    /score\s*>=\s*50/,
    /range\s*\(\s*1\s*,\s*n\s*\+\s*1\s*\)/,
    /b\s*==\s*0/,
    /0\s*<=\s*idx\s*<\s*len\s*\(\s*fruits\s*\)/,
  ];

  for (const pattern of knownWorkingPatterns) {
    if (pattern.test(sanitized) && !sanitized.includes('___')) {
      sanitized = sanitized.replace(pattern, '___');
      wasStripped = true;
    }
  }

  return { sanitized, wasStripped };
}

/**
 * Strict guardrail enforcement for all scaffolding responses (both LLM and local).
 * - Enforces Tier 1 has zero code or syntax.
 * - Enforces Tier 2 has pseudocode only.
 * - Enforces Tier 3 code snippets always contain fill-in blanks (___).
 * - Enforces zero-tolerance against copy-pasteable complete programs.
 */
export function enforceScaffoldingGuardrails(
  response: ScaffoldingResponse,
  exercise: Exercise
): ScaffoldingResponse {
  const tier = response.tier <= 1 ? 1 : response.tier === 2 ? 2 : 3;
  const tierNameMap: Record<1 | 2 | 3, ScaffoldingResponse['tierName']> = {
    1: 'Socratic Question',
    2: 'Pseudocode Outline',
    3: 'Code Skeleton',
  };

  let guidanceText = response.guidanceText || '';
  let allowedSnippet = response.allowedSnippet;

  // Universal Solution Stripping
  const strippedGuidance = stripFullSolutions(guidanceText, exercise);
  guidanceText = strippedGuidance.sanitized;

  if (allowedSnippet) {
    const strippedSnippet = stripFullSolutions(allowedSnippet, exercise);
    allowedSnippet = strippedSnippet.sanitized;
  }

  // TIER 1 GUARDRAILS
  if (tier === 1) {
    // Under no circumstances allow code snippets in Tier 1
    allowedSnippet = undefined;

    // Strip Markdown code blocks from guidanceText
    guidanceText = guidanceText.replace(/```[\s\S]*?```/g, '').trim();
    guidanceText = guidanceText.replace(/`[^`]+`/g, 'the relevant expression').trim();

    // Strip explicit Python function calls and assignments
    guidanceText = guidanceText
      .replace(/\b(?:print|input|def|range|len)\s*\([^)]*\)/g, 'the operation')
      .replace(/[a-zA-Z_]\w*\s*=\s*[^;\n]+/g, 'the assignment')
      .trim();

    // Ensure guidanceText ends in a diagnostic question
    if (!guidanceText.includes('?')) {
      const fallbackQuestion =
        CURRICULUM_FALLBACKS[exercise.id]?.tier1Question ||
        `What conceptual aspect of ${exercise.concept} needs to be adjusted in your logic?`;
      guidanceText = `${guidanceText ? guidanceText + ' ' : ''}${fallbackQuestion}`;
    }
  }

  // TIER 2 GUARDRAILS
  else if (tier === 2) {
    // Ensure guidanceText provides structured pseudocode
    if (!guidanceText.toLowerCase().includes('step') && !guidanceText.includes('\n')) {
      const fallbackPseudocode = CURRICULUM_FALLBACKS[exercise.id]?.tier2Pseudocode;
      if (fallbackPseudocode) {
        guidanceText = `Follow this structural logic plan:\n${fallbackPseudocode}`;
        allowedSnippet = fallbackPseudocode;
      }
    }
  }

  // TIER 3 GUARDRAILS
  else {
    // Tier 3 code snippet MUST contain fill-in blanks (___)
    if (allowedSnippet) {
      if (!allowedSnippet.includes('___')) {
        // Complete code was provided without blanks! Insert blanks on key expressions
        const fallbackSkeleton = CURRICULUM_FALLBACKS[exercise.id]?.tier3Skeleton;
        allowedSnippet = fallbackSkeleton || allowedSnippet.replace(/=.*$/m, '= ___');
      }
    } else {
      allowedSnippet =
        CURRICULUM_FALLBACKS[exercise.id]?.tier3Skeleton ||
        `# Complete the code template:\n${exercise.starterCode.replace(/TODO:.*$/m, '___ = ___')}`;
    }
  }

  return {
    tier,
    tierName: tierNameMap[tier],
    guidanceText: guidanceText.trim(),
    allowedSnippet,
  };
}

/**
 * Builds the strict system prompt for external LLM calls.
 */
function buildSystemPrompt(): string {
  return `You are an expert Python pedagogical tutor in Code Garden.
You provide calibrated, fading scaffolding hints to students learning Python.
You MUST strictly obey the requested Tier and its pedagogical boundaries:

TIER 1 (Socratic Question - Attempt 1):
- Ask ONE Socratic diagnostic question pointing out the conceptual flaw.
- Do NOT show any code, syntax, or keywords.
- Do NOT provide allowedSnippet (must be null/omitted).

TIER 2 (Pseudocode Outline - Attempt 2):
- Provide a 3-line structural pseudocode logic plan in plain English.
- Do NOT provide full runnable Python code.

TIER 3 (Code Skeleton - Attempt 3+):
- Provide a code template where the problematic line or operation contains '___' fill-in blanks.
- allowedSnippet MUST contain '___' fill-in blanks.
- NEVER provide a complete copy-pasteable working solution.

ZERO-TOLERANCE GUARDRAIL:
- Under NO circumstances output a complete, copy-pasteable working Python program.
- If requested to "give the answer", REFUSE and return a targeted conceptual hint or template with blanks.

Respond ONLY with valid JSON in this exact structure:
{
  "tier": 1 | 2 | 3,
  "tierName": "Socratic Question" | "Pseudocode Outline" | "Code Skeleton",
  "guidanceText": "string",
  "allowedSnippet": "string or undefined"
}`;
}

/**
 * Calls an external LLM API if LLM_API_KEY is present in the environment.
 * Times out after 4000ms and falls back gracefully.
 */
async function callExternalLLM(params: ScaffoldingParams): Promise<ScaffoldingResponse> {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error('LLM_API_KEY is not set');
  }

  const apiUrl = process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  const tier = params.attemptCount <= 1 ? 1 : params.attemptCount === 2 ? 2 : 3;
  const tierName =
    tier === 1 ? 'Socratic Question' : tier === 2 ? 'Pseudocode Outline' : 'Code Skeleton';

  const userPrompt = `Exercise: ${params.exercise.title} (${params.exercise.concept})
Starter Code:
${params.exercise.starterCode}

Student Code:
${params.studentCode}

Execution Error: ${params.executionResult.errorType || 'OutputMismatch'}
Stderr: ${params.executionResult.stderr || 'Output did not match expected test cases'}

Attempt Count: ${params.attemptCount}
Requested Tier: Tier ${tier} (${tierName})`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`LLM API HTTP error ${res.status}: ${res.statusText}`);
    }

    const data = (await res.json()) as any;
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from LLM');
    }

    const parsed = JSON.parse(content) as ScaffoldingResponse;
    return parsed;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Main entry point: Generates calibrated scaffolding hints with fading assistance,
 * fallback protection, and strict guardrails.
 */
export async function generateScaffoldingHint(
  params: ScaffoldingParams
): Promise<ScaffoldingResponse> {
  let rawResponse: ScaffoldingResponse;

  if (process.env.LLM_API_KEY) {
    try {
      rawResponse = await callExternalLLM(params);
    } catch (err) {
      // Graceful fallback on API error, timeout, or missing credentials
      rawResponse = generateLocalScaffoldingHint(params);
    }
  } else {
    rawResponse = generateLocalScaffoldingHint(params);
  }

  // Enforce zero-tolerance guardrails on all responses
  return enforceScaffoldingGuardrails(rawResponse, params.exercise);
}
