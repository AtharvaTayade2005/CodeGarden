/**
 * Code Garden - Curriculum Data
 * Synchronized with Mumbai University (MU) / SPPU First-Year Computer Engineering
 * Python Programming Lab Manual Syllabus (FE Semester 1 & 2).
 */

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  labExperimentNumber: string;
  syllabusUnit: string;
  concept: string;
  starterCode: string;
  testCases: TestCase[];
  scaffoldingHints: [string, string, string]; // Tier 1: Socratic, Tier 2: Pseudocode, Tier 3: Concrete syntax
}

export const initialExercises: Exercise[] = [
  {
    id: 'variable-swap-print',
    title: 'MU Exp 1: Variable Swap & Formatted Output',
    labExperimentNumber: 'Lab Experiment 01',
    syllabusUnit: 'Unit I: Python Basics & Input/Output',
    concept: 'Variables & Tuples',
    starterCode: `# Read two integers from input
a = int(input())
b = int(input())

# TODO: Swap the values of variable 'a' and variable 'b'
# Hint: In Python, you can swap without a temporary variable using tuple unpacking!

print(f"{a} {b}")
`,
    testCases: [
      {
        input: '5\n10',
        expectedOutput: '10 5',
        isHidden: false,
      },
      {
        input: '1\n2',
        expectedOutput: '2 1',
        isHidden: false,
      },
      {
        input: '42\n99',
        expectedOutput: '99 42',
        isHidden: true,
      },
    ],
    scaffoldingHints: [
      'Tier 1 (Socratic): Variables store references to values. How can you assign the value of b to a and a to b simultaneously in a single line?',
      'Tier 2 (Structure): Python supports simultaneous tuple assignment: `left_a, left_b = right_b, right_a`.',
      'Tier 3 (Syntax): Add the line `a, b = b, a` right before the print statement.',
    ],
  },
  {
    id: 'pass-fail-boundary',
    title: 'MU Exp 2: Pass/Fail Conditional Grade Evaluation',
    labExperimentNumber: 'Lab Experiment 02',
    syllabusUnit: 'Unit II: Control Structures & Branching',
    concept: 'if/else Conditionals',
    starterCode: `# Read an integer score from input
score = int(input())

# TODO: If score is 50 or higher, print 'Pass'. Otherwise, print 'Fail'.
`,
    testCases: [
      {
        input: '50',
        expectedOutput: 'Pass',
        isHidden: false,
      },
      {
        input: '49',
        expectedOutput: 'Fail',
        isHidden: false,
      },
      {
        input: '85',
        expectedOutput: 'Pass',
        isHidden: false,
      },
      {
        input: '0',
        expectedOutput: 'Fail',
        isHidden: true,
      },
    ],
    scaffoldingHints: [
      'Tier 1 (Socratic): What exact comparison operator includes the boundary score of 50 as passing rather than strictly greater than 50?',
      'Tier 2 (Structure): The passing boundary is 50 inclusive. Use the `>=` comparison operator inside an `if` block.',
      'Tier 3 (Syntax): Structure your code as: `if score >= 50:\n    print("Pass")\nelse:\n    print("Fail")`.',
    ],
  },
  {
    id: 'accumulator-loop',
    title: 'MU Exp 3: Range Accumulator & Loop Logic',
    labExperimentNumber: 'Lab Experiment 03',
    syllabusUnit: 'Unit II: Loops & Iterations',
    concept: 'for loops & range()',
    starterCode: `# Read an integer n from input
n = int(input())

total = 0
# TODO: Use a for-loop with range() to accumulate the sum of integers from 1 to n (inclusive)

print(total)
`,
    testCases: [
      {
        input: '5',
        expectedOutput: '15',
        isHidden: false,
      },
      {
        input: '1',
        expectedOutput: '1',
        isHidden: false,
      },
      {
        input: '10',
        expectedOutput: '55',
        isHidden: false,
      },
      {
        input: '100',
        expectedOutput: '5050',
        isHidden: true,
      },
    ],
    scaffoldingHints: [
      'Tier 1 (Socratic): `range(start, stop)` in Python stops strictly BEFORE the stop number. How must you configure the stop parameter to include n?',
      'Tier 2 (Structure): To iterate up to and including n, your range stop value must be `n + 1`. In each iteration, add `i` into `total`.',
      'Tier 3 (Syntax): Use `for i in range(1, n + 1):\n    total += i`.',
    ],
  },
  {
    id: 'safe-divider-guard',
    title: 'MU Exp 4: ZeroDivision Defensive Exception Guard',
    labExperimentNumber: 'Lab Experiment 04',
    syllabusUnit: 'Unit IV: Exception & Error Handling',
    concept: 'Defensive Division & Exceptions',
    starterCode: `# Read two integers: numerator 'a' and denominator 'b'
a = int(input())
b = int(input())

# TODO: Guard against division by zero!
# If b is 0, print 'Error: Division by zero'
# Otherwise, print the integer division result (a // b)
`,
    testCases: [
      {
        input: '10\n2',
        expectedOutput: '5',
        isHidden: false,
      },
      {
        input: '7\n0',
        expectedOutput: 'Error: Division by zero',
        isHidden: false,
      },
      {
        input: '0\n5',
        expectedOutput: '0',
        isHidden: false,
      },
      {
        input: '100\n0',
        expectedOutput: 'Error: Division by zero',
        isHidden: true,
      },
    ],
    scaffoldingHints: [
      'Tier 1 (Socratic): What specific denominator value crashes Python with a ZeroDivisionError, and how can you check for it before dividing?',
      'Tier 2 (Structure): Check `if b == 0:` before attempting any division. Only compute `a // b` inside the `else` block.',
      'Tier 3 (Syntax): Write: `if b == 0:\n    print("Error: Division by zero")\nelse:\n    print(a // b)`.',
    ],
  },
  {
    id: 'list-index-traversal',
    title: 'MU Exp 5: Bounded List Traversal & Boundary Guard',
    labExperimentNumber: 'Lab Experiment 05',
    syllabusUnit: 'Unit III: Sequences & Lists',
    concept: 'List Index Boundaries',
    starterCode: `fruits = ["apple", "banana", "cherry", "date"]

# Read an index from input
idx = int(input())

# TODO: Safely access the fruit at idx.
# If idx is valid (0 to len(fruits) - 1), print fruits[idx].
# If idx is negative or >= len(fruits), print 'Index out of bounds'.
`,
    testCases: [
      {
        input: '1',
        expectedOutput: 'banana',
        isHidden: false,
      },
      {
        input: '3',
        expectedOutput: 'date',
        isHidden: false,
      },
      {
        input: '4',
        expectedOutput: 'Index out of bounds',
        isHidden: false,
      },
      {
        input: '-1',
        expectedOutput: 'Index out of bounds',
        isHidden: true,
      },
    ],
    scaffoldingHints: [
      'Tier 1 (Socratic): In a 4-item list, valid indices are 0 through 3. How do you check that idx is non-negative and strictly within the length boundary?',
      'Tier 2 (Structure): Verify both bounds: `0 <= idx < len(fruits)`. If valid, access `fruits[idx]`.',
      'Tier 3 (Syntax): Use `if 0 <= idx < len(fruits):\n    print(fruits[idx])\nelse:\n    print("Index out of bounds")`.',
    ],
  },
  {
    id: 'string-slicing-palindrome',
    title: 'MU Exp 6: String Slicing & Palindrome Verification',
    labExperimentNumber: 'Lab Experiment 06',
    syllabusUnit: 'Unit III: Strings & Slicing Mechanics',
    concept: 'String Slicing [::-1]',
    starterCode: `# Read a word from input
word = input()

# TODO: Check if word is a palindrome using string step slicing [::-1]
# If word reads the same backwards, print 'Palindrome'
# Otherwise, print 'Not a palindrome'
`,
    testCases: [
      {
        input: 'radar',
        expectedOutput: 'Palindrome',
        isHidden: false,
      },
      {
        input: 'python',
        expectedOutput: 'Not a palindrome',
        isHidden: false,
      },
      {
        input: 'madam',
        expectedOutput: 'Palindrome',
        isHidden: true,
      },
    ],
    scaffoldingHints: [
      'Tier 1 (Socratic): How can you reverse a string in Python using slice notation with a step parameter?',
      'Tier 2 (Structure): `word[::-1]` creates a reversed copy of the string. Compare if `word == word[::-1]`.',
      'Tier 3 (Syntax): Write: `if word == word[::-1]:\n    print("Palindrome")\nelse:\n    print("Not a palindrome")`.',
    ],
  },
  {
    id: 'modular-functions-factorial',
    title: 'MU Exp 7: Modular Functions & Recursion Logic',
    labExperimentNumber: 'Lab Experiment 07',
    syllabusUnit: 'Unit V: Functions & Modular Programming',
    concept: 'Functions & Recursion',
    starterCode: `# Read integer n from input
n = int(input())

# TODO: Define a function compute_factorial(val) that returns the factorial of val.
# Base case: if val <= 1, return 1. Otherwise return val * compute_factorial(val - 1).

def compute_factorial(val):
    # Complete this function
    pass

print(compute_factorial(n))
`,
    testCases: [
      {
        input: '5',
        expectedOutput: '120',
        isHidden: false,
      },
      {
        input: '1',
        expectedOutput: '1',
        isHidden: false,
      },
      {
        input: '0',
        expectedOutput: '1',
        isHidden: false,
      },
      {
        input: '7',
        expectedOutput: '5040',
        isHidden: true,
      },
    ],
    scaffoldingHints: [
      'Tier 1 (Socratic): In a recursive function, what is the base case condition that stops infinite recursion when calculating factorial?',
      'Tier 2 (Structure): If `val <= 1` return 1. Otherwise, return `val * compute_factorial(val - 1)`.',
      'Tier 3 (Syntax): In the function body replace `pass` with: `if val <= 1:\n        return 1\n    return val * compute_factorial(val - 1)`.',
    ],
  },
];

