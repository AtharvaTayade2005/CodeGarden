/**
 * Code Garden - Curriculum Data
 * Initial structured Python learning exercises with tiered scaffolding hints and test cases.
 */

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  concept: string;
  starterCode: string;
  testCases: TestCase[];
  scaffoldingHints: [string, string, string]; // Tier 1: Conceptual, Tier 2: Structural, Tier 3: Concrete syntax
}

export const initialExercises: Exercise[] = [
  {
    id: 'variable-swap-print',
    title: 'Variable Swap & Print',
    concept: 'Variables',
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
      'Tier 1 (Concept): Variables store references to values. To swap them, you need to assign the value of b to a and the value of a to b at the same time.',
      'Tier 2 (Structure): Python allows simultaneous assignment using comma separation: left_vars = right_vars.',
      'Tier 3 (Syntax): Add the line `a, b = b, a` right before the print statement.',
    ],
  },
  {
    id: 'pass-fail-boundary',
    title: 'Pass-Fail Boundary',
    concept: 'if/else conditions',
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
      'Tier 1 (Concept): Conditionals let code branch based on boolean logic using the `if` and `else` keywords.',
      'Tier 2 (Structure): The passing boundary is 50 inclusive. Use the `>=` comparison operator.',
      'Tier 3 (Syntax): Structure your code as: `if score >= 50: print("Pass")` followed by `else: print("Fail")`.',
    ],
  },
  {
    id: 'accumulator-loop',
    title: 'Accumulator Loop',
    concept: 'for loops',
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
      'Tier 1 (Concept): An accumulator pattern initializes a variable before the loop and adds each step value into it during each iteration.',
      'Tier 2 (Structure): `range(start, stop)` does not include `stop`. To iterate through `n` inclusive, your range should stop at `n + 1`.',
      'Tier 3 (Syntax): Use `for i in range(1, n + 1):` and inside the loop add `total += i`.',
    ],
  },
  {
    id: 'safe-divider-guard',
    title: 'Safe Divider Guard',
    concept: 'ZeroDivision avoidance',
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
      'Tier 1 (Concept): Dividing by zero raises a ZeroDivisionError in Python, terminating program execution. Defensive code checks the divisor first.',
      'Tier 2 (Structure): Check `if b == 0:` before attempting any division.',
      'Tier 3 (Syntax): Write: `if b == 0: print("Error: Division by zero")` and `else: print(a // b)`.',
    ],
  },
  {
    id: 'list-index-traversal',
    title: 'List Index Traversal',
    concept: 'Index boundaries',
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
      'Tier 1 (Concept): Python lists have bounded indices. Accessing an index outside the valid range raises an IndexError.',
      'Tier 2 (Structure): Verify both boundaries: the index must be non-negative (`>= 0`) and strictly less than `len(fruits)`.',
      'Tier 3 (Syntax): Use `if 0 <= idx < len(fruits): print(fruits[idx])` followed by `else: print("Index out of bounds")`.',
    ],
  },
];
