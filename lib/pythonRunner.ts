/**
 * Code Garden - Python AST Misconception Profiler & Execution Runner
 * Provides sandboxed execution of student Python code with security constraints,
 * timeout enforcement, static inspection, and semantic traceback parsing.
 */

import { spawn, spawnSync } from 'node:child_process';
import { StringDecoder } from 'node:string_decoder';
import {
  BugType,
  mapExceptionToBug,
  ParasiteType,
  mapExceptionToParasite,
  generateSocraticPrompt,
  PARASITE_DEFINITIONS,
  ParasiteLocation,
} from './treeEngine';
import { TestCase } from './curriculumData';

export interface ExecutionResult {
  passed: boolean;
  stdout: string;
  stderr: string;
  errorType?: string;
  detectedBug?: BugType;
  detectedParasite?: ParasiteType;
  socraticPrompt?: string;
  astLocation?: ParasiteLocation;
  failedTestCaseIndex?: number;
  executionTimeMs: number;
}

export interface RunOptions {
  timeoutMs?: number;
  pythonBin?: string;
}

export const DEFAULT_TIMEOUT_MS = 3000;
export const MAX_OUTPUT_LENGTH = 10000;

/**
 * Truncates output exceeding MAX_OUTPUT_LENGTH to prevent UI freezes.
 */
export function truncateOutput(text: string): string {
  if (text.length > MAX_OUTPUT_LENGTH) {
    return (
      text.slice(0, MAX_OUTPUT_LENGTH) +
      '\n... [Output truncated: exceeded 10,000 character limit to prevent UI freeze]'
    );
  }
  return text;
}

let cachedPythonBin: string | null = null;

/**
 * Resolves the available Python 3 executable on the current system.
 * Defaults to 'python' on Windows and 'python3' on POSIX systems.
 */
export function getPythonBinary(override?: string): string {
  if (override) return override;
  if (process.env.PYTHON_BIN) return process.env.PYTHON_BIN;
  if (cachedPythonBin) return cachedPythonBin;

  const candidates =
    process.platform === 'win32' ? ['python', 'py', 'python3'] : ['python3', 'python'];

  for (const bin of candidates) {
    try {
      const res = spawnSync(bin, ['-I', '-c', 'import sys; print(sys.version_info.major)'], {
        stdio: 'pipe',
        encoding: 'utf8',
      });
      if (res.status === 0 && res.stdout.trim() === '3') {
        cachedPythonBin = bin;
        return bin;
      }
    } catch {
      // Continue checking next candidate
    }
  }

  // Fallback default
  const fallback = process.platform === 'win32' ? 'python' : 'python3';
  cachedPythonBin = fallback;
  return fallback;
}

interface ForbiddenRule {
  pattern: RegExp;
  description: string;
}

const FORBIDDEN_RULES: ForbiddenRule[] = [
  { pattern: /\bimport\s+[^;#\n]*\bos\b/, description: "Forbidden import: 'os'" },
  { pattern: /\bfrom\s+os\b/, description: "Forbidden import: 'from os'" },
  { pattern: /\bimport\s+[^;#\n]*\bsys\b/, description: "Forbidden import: 'sys'" },
  { pattern: /\bfrom\s+sys\b/, description: "Forbidden import: 'from sys'" },
  { pattern: /\bimport\s+[^;#\n]*\bsubprocess\b/, description: "Forbidden import: 'subprocess'" },
  { pattern: /\bfrom\s+subprocess\b/, description: "Forbidden import: 'from subprocess'" },
  {
    pattern: /\bimport\s+[^;#\n]*\b(shutil|socket|urllib|requests|pathlib|pty|posix|commands)\b/,
    description: 'Forbidden system/networking module import',
  },
  {
    pattern: /\bfrom\s+(shutil|socket|urllib|requests|pathlib|pty|posix|commands)\b/,
    description: 'Forbidden system/networking module import',
  },
  { pattern: /\bopen\s*\(/, description: "Forbidden built-in: 'open()'" },
  { pattern: /\b__import__\s*\(/, description: "Forbidden built-in: '__import__()'" },
  { pattern: /\beval\s*\(/, description: "Forbidden built-in: 'eval()'" },
  { pattern: /\bexec\s*\(/, description: "Forbidden built-in: 'exec()'" },
  { pattern: /\bcompile\s*\(/, description: "Forbidden built-in: 'compile()'" },
];

/**
 * Strips single-line comments (# ...) outside string literals to prevent false positives.
 */
function stripPythonComments(code: string): string {
  return code
    .split('\n')
    .map((line) => {
      let inSingle = false;
      let inDouble = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const prev = i > 0 ? line[i - 1] : '';
        if (char === "'" && !inDouble && prev !== '\\') {
          inSingle = !inSingle;
        } else if (char === '"' && !inSingle && prev !== '\\') {
          inDouble = !inDouble;
        } else if (char === '#' && !inSingle && !inDouble) {
          return line.slice(0, i);
        }
      }
      return line;
    })
    .join('\n');
}

/**
 * Inspects code statically for forbidden imports and dangerous built-ins.
 */
export function inspectCodeSafety(code: string): { isSafe: boolean; violation?: string } {
  const stripped = stripPythonComments(code);

  for (const rule of FORBIDDEN_RULES) {
    if (rule.pattern.test(stripped)) {
      return { isSafe: false, violation: rule.description };
    }
  }

  return { isSafe: true };
}

/**
 * Extracts the exact Python exception class name from stderr tracebacks.
 * Traverses from the bottom of stderr upward to find the primary terminating exception.
 */
export function extractErrorTypeFromStderr(stderr: string): string | undefined {
  if (!stderr) return undefined;

  const lines = stderr
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return undefined;

  // Python exception lines typically look like: "IndexError: list index out of range"
  // or "SyntaxError: invalid syntax"
  const exceptionRegex =
    /^([a-zA-Z_][a-zA-Z0-9_.]*(?:Error|Exception|Warning|Interrupt|Exit))(?::\s*(.*))?$/;

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const match = line.match(exceptionRegex);
    if (match) {
      return match[1];
    }
  }

  // Fallback: detect any line ending with standard CamelCase Error pattern
  for (let i = lines.length - 1; i >= 0; i--) {
    const match = lines[i].match(/^([A-Z][a-zA-Z0-9_]*):/);
    if (match) {
      return match[1];
    }
  }

  return undefined;
}

interface ProcessExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
}

/**
 * Spawns an isolated Python process (`python -I -c "<code>"`) with stdin input and hard timeout.
 */
function spawnPythonProcess(
  code: string,
  input: string,
  timeoutMs: number,
  pythonBin: string
): Promise<ProcessExecutionResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdoutData = '';
    let stderrData = '';
    let timedOut = false;
    let closed = false;

    const stdoutDecoder = new StringDecoder('utf8');
    const stderrDecoder = new StringDecoder('utf8');

    // Execute with isolated mode flag -I
    const child = spawn(pythonBin, ['-I', '-c', code], {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });

    const timeoutTimer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill('SIGKILL');
      } catch {
        // Child already terminated
      }

      // Windows backup force-kill if still active after 200ms
      if (process.platform === 'win32' && child.pid) {
        setTimeout(() => {
          if (!closed && child.pid) {
            try {
              spawn('taskkill', ['/pid', child.pid.toString(), '/T', '/F'], {
                stdio: 'ignore',
                windowsHide: true,
              });
            } catch {
              // Ignore cleanup errors
            }
          }
        }, 200);
      }
    }, timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      if (stdoutData.length <= MAX_OUTPUT_LENGTH) {
        stdoutData += stdoutDecoder.write(chunk);
      }
    });

    child.stderr.on('data', (chunk: Buffer) => {
      if (stderrData.length <= MAX_OUTPUT_LENGTH) {
        stderrData += stderrDecoder.write(chunk);
      }
    });

    child.on('error', (err: Error) => {
      clearTimeout(timeoutTimer);
      if (!closed) {
        closed = true;
        stdoutData += stdoutDecoder.end();
        stderrData += stderrDecoder.end();
        stderrData += `\nProcessError: ${err.message}`;
        resolve({
          stdout: truncateOutput(stdoutData),
          stderr: truncateOutput(stderrData),
          exitCode: 1,
          timedOut,
          durationMs: Date.now() - startTime,
        });
      }
    });

    child.on('close', (code: number | null) => {
      clearTimeout(timeoutTimer);
      if (!closed) {
        closed = true;
        stdoutData += stdoutDecoder.end();
        stderrData += stderrDecoder.end();
        resolve({
          stdout: truncateOutput(stdoutData),
          stderr: truncateOutput(stderrData),
          exitCode: code,
          timedOut,
          durationMs: Date.now() - startTime,
        });
      }
    });

    // Write input to stdin and close pipe
    try {
      if (input) {
        child.stdin.write(input.endsWith('\n') ? input : input + '\n');
      }
      child.stdin.end();
    } catch {
      // Child process might have exited early (e.g. syntax error)
    }
  });
}

/**
 * Normalizes test case inputs into standard TestCase array.
 */
function normalizeTestCases(
  testCasesInput?: TestCase[] | TestCase | string
): Array<{ input: string; expectedOutput?: string; isHidden?: boolean }> {
  if (!testCasesInput) {
    return [{ input: '' }];
  }
  if (typeof testCasesInput === 'string') {
    return [{ input: testCasesInput }];
  }
  if (Array.isArray(testCasesInput)) {
    return testCasesInput.length > 0 ? testCasesInput : [{ input: '' }];
  }
  return [testCasesInput];
}

/**
 * Executes student Python code in a secure sandbox against test cases.
 * Returns structured ExecutionResult with semantic traceback mapping and timing.
 */
export async function runPythonCode(
  code: string,
  testCasesInput?: TestCase[] | TestCase | string,
  options?: RunOptions
): Promise<ExecutionResult> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const pythonBin = getPythonBinary(options?.pythonBin);

  // 1. Static security inspection
  const safety = inspectCodeSafety(code);
  if (!safety.isSafe) {
    const errorMsg = `SecurityViolationError: Execution blocked. ${safety.violation}`;
    return {
      passed: false,
      stdout: '',
      stderr: errorMsg,
      errorType: 'SecurityViolationError',
      detectedBug: BugType.STRUCTURE_CATERPILLAR,
      failedTestCaseIndex: 0,
      executionTimeMs: 0,
    };
  }

  const testCases = normalizeTestCases(testCasesInput);
  let totalTimeMs = 0;
  let lastStdout = '';

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const procResult = await spawnPythonProcess(code, tc.input, timeoutMs, pythonBin);
    totalTimeMs += procResult.durationMs;
    lastStdout = procResult.stdout;

    // Timeout handling (>2s)
    if (procResult.timedOut || totalTimeMs >= 2000) {
      const parasite = ParasiteType.STRANGLER_VINE;
      return {
        passed: false,
        stdout: procResult.stdout.trim(),
        stderr: `TimeoutError: Execution exceeded ${timeoutMs}ms limit (>2s infinite loop / iteration limit exceeded)`,
        errorType: 'TimeoutError',
        detectedBug: BugType.LOOP_WEED,
        detectedParasite: parasite,
        socraticPrompt: generateSocraticPrompt(parasite, { errorType: 'TimeoutError', code }),
        astLocation: PARASITE_DEFINITIONS[parasite].location,
        failedTestCaseIndex: i,
        executionTimeMs: totalTimeMs,
      };
    }

    // Process exited with error or printed traceback to stderr
    if (procResult.exitCode !== 0 || procResult.stderr.trim().length > 0) {
      const errorClass = extractErrorTypeFromStderr(procResult.stderr) ?? 'RuntimeError';
      const detectedBug = mapExceptionToBug(errorClass);
      const detectedParasite =
        mapExceptionToParasite(errorClass, procResult.stderr, totalTimeMs) ?? undefined;
      const socraticPrompt = detectedParasite
        ? generateSocraticPrompt(detectedParasite, {
            errorType: errorClass,
            stderr: procResult.stderr,
            code,
          })
        : undefined;
      const astLocation = detectedParasite
        ? PARASITE_DEFINITIONS[detectedParasite].location
        : undefined;

      return {
        passed: false,
        stdout: procResult.stdout.trim(),
        stderr: procResult.stderr.trim(),
        errorType: errorClass,
        detectedBug,
        detectedParasite,
        socraticPrompt,
        astLocation,
        failedTestCaseIndex: i,
        executionTimeMs: totalTimeMs,
      };
    }

    // Output verification if expectedOutput was provided
    if (tc.expectedOutput !== undefined) {
      const actual = procResult.stdout.trim();
      const expected = tc.expectedOutput.trim();
      if (actual !== expected) {
        return {
          passed: false,
          stdout: actual,
          stderr: `AssertionError: Expected output "${expected}", but received "${actual}"`,
          errorType: 'AssertionError',
          detectedBug: mapExceptionToBug('AssertionError'),
          failedTestCaseIndex: i,
          executionTimeMs: totalTimeMs,
        };
      }
    }
  }

  return {
    passed: true,
    stdout: lastStdout.trim(),
    stderr: '',
    executionTimeMs: totalTimeMs,
  };
}

export const executePythonCode = runPythonCode;
export const executePython = runPythonCode;
