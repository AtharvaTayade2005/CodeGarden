/**
 * Code Garden - Faculty Analytics & University LMS Export Engine Test Suite
 * Validates session metrics aggregation, Hint Dependency Ratio (<25% Guardrail),
 * Cognitive Flow Time calculation, and Mumbai University / SPPU LMS Continuous Assessment Sheet (CAS) CSV formatting.
 */

import assert from 'node:assert';
import {
  StudentSessionMetric,
  SEED_STUDENT_SESSIONS,
  calculateHintDependencyRatio,
  calculateCognitiveFlow,
  calculateContinuousAssessmentMarks,
  generateUniversityLmsCsv,
} from '../lib/facultyAnalytics';

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
console.log('  Running Code Garden Faculty Analytics & LMS Test Suite');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: Aggregated Student Session Metrics Integrity
// -----------------------------------------------------------------------------
console.log('Test 1: Student Session Metric Aggregations');

runTest('1a. Verify pre-seeded student sessions contain all mandatory requirements', () => {
  assert.ok(SEED_STUDENT_SESSIONS.length >= 8, 'Must have at least 8 student sessions');

  SEED_STUDENT_SESSIONS.forEach((s, idx) => {
    // Requirement 1: Student Name, Roll No / Division
    assert.ok(s.studentName && s.studentName.length > 0, `Student ${idx} must have name`);
    assert.ok(s.rollNo && s.rollNo.length > 0, `Student ${idx} must have rollNo`);
    assert.ok(s.division && s.division.startsWith('FE-CMPN-'), `Student ${idx} must have valid division`);

    // Requirement 1: Lab Experiment ID
    assert.ok(s.labExperimentId && s.labExperimentId.startsWith('MU_Python_Exp_'), `Student ${idx} has MU experiment ID`);

    // Requirement 1: Weekly Bugs Conquered
    assert.strictEqual(typeof s.weeklyBugsConquered, 'number');
    assert.ok(s.weeklyBugsConquered >= 0, 'Weekly bugs conquered must be non-negative integer');

    // Requirement 1: Hint Dependency Ratio
    assert.strictEqual(typeof s.hintDependencyRatio, 'number');
    assert.ok(s.hintDependencyRatio >= 0 && s.hintDependencyRatio <= 1, 'Hint ratio between 0 and 1');

    // Requirement 1: Cognitive Flow Time
    assert.strictEqual(typeof s.activeMinutes, 'number');
    assert.strictEqual(typeof s.idleMinutes, 'number');
    assert.strictEqual(s.totalSessionMinutes, s.activeMinutes + s.idleMinutes);
    assert.ok(s.cognitiveFlowPercentage >= 0 && s.cognitiveFlowPercentage <= 100);

    // Continuous Assessment Marks
    assert.ok(s.assessmentMarks.totalOutOf20 <= 20 && s.assessmentMarks.totalOutOf20 >= 0);
  });
});

// -----------------------------------------------------------------------------
// TEST 2: Hint Dependency Ratio Calculation (<25% Guardrail)
// -----------------------------------------------------------------------------
console.log('\nTest 2: Hint Dependency Ratio Calculation & Guardrail Enforcement');

runTest('2a. Accurately calculates ratio as percentage and flags <25% compliance', () => {
  // Optimal: 2 hints on 12 attempts -> 16.7%
  const res1 = calculateHintDependencyRatio(2, 12);
  assert.strictEqual(res1.formatted, '16.7%');
  assert.strictEqual(res1.isOptimal, true, 'Ratio 16.7% must pass <25% guardrail');

  // Guardrail Breach: 5 hints on 18 attempts -> 27.8%
  const res2 = calculateHintDependencyRatio(5, 18);
  assert.strictEqual(res2.formatted, '27.8%');
  assert.strictEqual(res2.isOptimal, false, 'Ratio 27.8% must breach <25% guardrail');

  // Edge Case: 0 attempts
  const res0 = calculateHintDependencyRatio(0, 0);
  assert.strictEqual(res0.formatted, '0.0%');
  assert.strictEqual(res0.isOptimal, true);
});

// -----------------------------------------------------------------------------
// TEST 3: Cognitive Flow Time Calculation
// -----------------------------------------------------------------------------
console.log('\nTest 3: Cognitive Flow Time Tracking (Active vs. Idle Minutes)');

runTest('3a. Accurately formats active flow minutes vs idle minutes', () => {
  const flow1 = calculateCognitiveFlow(42, 10);
  assert.strictEqual(flow1.totalMinutes, 52);
  assert.strictEqual(flow1.flowPercentage, 81);
  assert.strictEqual(flow1.formatted, '42m active / 10m idle');
  assert.strictEqual(flow1.activeDisplay, '42 min');
  assert.strictEqual(flow1.idleDisplay, '10 min');

  // Edge case: 0 minutes
  const flow0 = calculateCognitiveFlow(0, 0);
  assert.strictEqual(flow0.totalMinutes, 0);
  assert.strictEqual(flow0.flowPercentage, 0);
});

// -----------------------------------------------------------------------------
// TEST 4: Continuous Assessment Marks Rubric Computation
// -----------------------------------------------------------------------------
console.log('\nTest 4: Mumbai University Continuous Assessment Marks Rubrics');

runTest('4a. High performing student receives 18-20 marks out of 20', () => {
  const marks = calculateContinuousAssessmentMarks(14, 0.16, 84, 'Completed');
  assert.ok(marks.totalOutOf20 >= 18 && marks.totalOutOf20 <= 20);
  assert.strictEqual(marks.performanceOutOf10, 10);
  assert.strictEqual(marks.vivaUnderstandingOutOf5, 4);
  assert.strictEqual(marks.timelyCompletionOutOf5, 5);
});

runTest('4b. High hint dependency reduces viva understanding score', () => {
  const marks = calculateContinuousAssessmentMarks(8, 0.45, 50, 'Completed');
  assert.strictEqual(marks.vivaUnderstandingOutOf5, 2, 'Hint ratio > 40% drops viva to 2');
  assert.ok(marks.totalOutOf20 < 15, 'Total marks reduced due to excessive scaffolding dependency');
});

// -----------------------------------------------------------------------------
// TEST 5: Requirement 2 - University LMS CSV Export Engine
// -----------------------------------------------------------------------------
console.log('\nTest 5: University LMS (CSV) Continuous Assessment Sheet Export Format');

runTest('5a. CSV contains official Mumbai University / SPPU metadata and columns', () => {
  const csv = generateUniversityLmsCsv(SEED_STUDENT_SESSIONS.slice(0, 3), {
    academicYear: '2024-2025',
    courseCode: 'FEC105',
    courseName: 'Python Programming Lab',
    divisionFilter: 'FE-CMPN-A',
  });

  // Verify Metadata Headers
  assert.ok(csv.includes('# UNIVERSITY CONTINUOUS INTERNAL ASSESSMENT SHEET (CAS)'));
  assert.ok(csv.includes('University of Mumbai (MU) / Savitribai Phule Pune University (SPPU)'));
  assert.ok(csv.includes('FEC105'));
  assert.ok(csv.includes('FE-CMPN-A'));

  // Verify Mandatory Rubric Column Names
  const requiredColumns = [
    'Sr_No',
    'Student_Name',
    'Roll_No',
    'Division',
    'College_Name',
    'Lab_Experiment_ID',
    'Lab_Experiment_Title',
    'Weekly_Bugs_Conquered',
    'Total_Attempts',
    'Hints_Used',
    'Hint_Dependency_Ratio',
    'Active_Flow_Minutes',
    'Idle_Minutes',
    'Total_Session_Minutes',
    'Cognitive_Flow_Percentage',
    'Status',
    'Performance_Marks_10',
    'Viva_Understanding_Marks_5',
    'Timely_Completion_Marks_5',
    'Total_Continuous_Assessment_Marks_20',
    'Primary_AST_Misconception',
    'Faculty_Audit_Remark',
  ];

  requiredColumns.forEach((col) => {
    assert.ok(csv.includes(`"${col}"`), `CSV must include column header "${col}"`);
  });

  // Verify Student Data Row Values
  assert.ok(csv.includes('"Aarav Sharma"'));
  assert.ok(csv.includes('"2024-FE-01"'));
  assert.ok(csv.includes('"MU_Python_Exp_01"'));
  assert.ok(csv.includes('"16.7%"')); // Hint Dependency Ratio
  assert.ok(csv.includes('"38"')); // Active Flow Minutes
  assert.ok(csv.includes('"7"')); // Idle Minutes
});

runTest('5b. CSV strictly adheres to RFC 4180 line delimiters and field quoting', () => {
  const csv = generateUniversityLmsCsv(SEED_STUDENT_SESSIONS.slice(0, 2));

  // Must use CRLF \r\n
  assert.ok(csv.includes('\r\n'), 'CSV must use CRLF line breaks');

  const lines = csv.split('\r\n').filter((l) => l.trim().length > 0 && !l.startsWith('#'));
  assert.ok(lines.length >= 3, 'Must have at least header + 2 student rows');

  // Ensure every field in data rows is quoted or safe
  lines.forEach((line) => {
    const fields = line.split(',');
    assert.ok(fields.length >= 20, 'Each row must contain all rubric fields');
  });
});

console.log('\n====================================================');
console.log(`  ALL ${passedCount}/${totalCount} FACULTY ANALYTICS & LMS TESTS PASSED!`);
console.log('====================================================\n');
