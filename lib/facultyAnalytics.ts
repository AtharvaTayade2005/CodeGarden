/**
 * Code Garden - Faculty Analytics & University LMS Continuous Assessment Engine
 * Aggregates student session metrics and generates university-formatted
 * continuous assessment rubrics sheets for Mumbai University (MU) & SPPU.
 */

export interface StudentSessionMetric {
  sessionId: string;
  studentName: string;
  rollNo: string;
  division: string;
  college: string;
  labExperimentId: string; // e.g. "MU_Python_Exp_03"
  labExperimentTitle: string;
  weeklyBugsConquered: number; // Number of resolved AST exceptions (North Star Metric)
  totalAttempts: number;
  hintsUsed: number;
  hintDependencyRatio: number; // Ratio: hintsUsed / totalAttempts (0.0 to 1.0)
  activeMinutes: number; // Total active keyboard engagement flow
  idleMinutes: number; // Reflective pauses & debugging contemplation
  totalSessionMinutes: number;
  cognitiveFlowPercentage: number; // (activeMinutes / totalSessionMinutes) * 100
  lastActiveTimestamp: string;
  status: 'Completed' | 'In Progress' | 'Needs Review';
  assessmentMarks: {
    performanceOutOf10: number; // Practical implementation & bug resolution
    vivaUnderstandingOutOf5: number; // Socratic conceptual understanding
    timelyCompletionOutOf5: number; // Completion & discipline
    totalOutOf20: number; // Continuous internal marks (out of 20)
  };
  primaryMisconception?: string;
}

/**
 * Calculates the Hint Dependency Ratio as a percentage formatted string and raw number.
 * Guardrail check: Flags when ratio >= 25% (indicates excessive scaffolding reliance).
 */
export function calculateHintDependencyRatio(
  hintsUsed: number,
  totalAttempts: number
): { rawRatio: number; percentage: number; formatted: string; isOptimal: boolean } {
  if (totalAttempts <= 0) {
    return { rawRatio: 0, percentage: 0, formatted: '0.0%', isOptimal: true };
  }
  const rawRatio = hintsUsed / totalAttempts;
  const percentage = Math.round(rawRatio * 1000) / 10;
  return {
    rawRatio,
    percentage,
    formatted: `${percentage.toFixed(1)}%`,
    isOptimal: rawRatio < 0.25, // Less than 25% meets the Critical Guardrail (Slide 7)
  };
}

/**
 * Calculates Cognitive Flow Time metrics (active vs. idle minutes).
 */
export function calculateCognitiveFlow(
  activeMinutes: number,
  idleMinutes: number
): {
  totalMinutes: number;
  flowPercentage: number;
  formatted: string;
  activeDisplay: string;
  idleDisplay: string;
} {
  const safeActive = Math.max(0, activeMinutes);
  const safeIdle = Math.max(0, idleMinutes);
  const totalMinutes = safeActive + safeIdle;
  const flowPercentage =
    totalMinutes > 0 ? Math.round((safeActive / totalMinutes) * 100) : 0;

  return {
    totalMinutes,
    flowPercentage,
    formatted: `${safeActive}m active / ${safeIdle}m idle`,
    activeDisplay: `${safeActive} min`,
    idleDisplay: `${safeIdle} min`,
  };
}

/**
 * Evaluates continuous internal assessment marks based on Mumbai University / SPPU rubrics:
 * - Performance (out of 10): scaled by bugs conquered and attempt efficiency
 * - Viva Understanding (out of 5): scaled by hint independence (<25% gets full marks)
 * - Timely Completion (out of 5): scaled by active cognitive flow
 * - Total (out of 20)
 */
export function calculateContinuousAssessmentMarks(
  bugsConquered: number,
  hintRatio: number,
  cognitiveFlowPct: number,
  status: 'Completed' | 'In Progress' | 'Needs Review'
): {
  performanceOutOf10: number;
  vivaUnderstandingOutOf5: number;
  timelyCompletionOutOf5: number;
  totalOutOf20: number;
} {
  if (status === 'Needs Review') {
    return {
      performanceOutOf10: 4,
      vivaUnderstandingOutOf5: 2,
      timelyCompletionOutOf5: 2,
      totalOutOf20: 8,
    };
  }

  // 1. Performance (Max 10): scaled by bugs conquered and penalized on excessive hint reliance
  let performance = Math.min(10, Math.max(4, Math.round(bugsConquered * 0.7 + (status === 'Completed' ? 3 : 1))));
  if (hintRatio > 0.4) {
    performance = Math.max(4, performance - 2);
  }

  // 2. Viva Understanding (Max 5): Higher independence = higher marks
  let viva = 5;
  if (hintRatio > 0.4) viva = 2;
  else if (hintRatio > 0.25) viva = 3;
  else if (hintRatio > 0.15) viva = 4;
  else viva = 5;

  // 3. Timely Completion & Discipline (Max 5)
  let completion = cognitiveFlowPct >= 60 ? 5 : cognitiveFlowPct >= 40 ? 4 : 3;

  const total = Math.min(20, performance + viva + completion);
  return {
    performanceOutOf10: performance,
    vivaUnderstandingOutOf5: viva,
    timelyCompletionOutOf5: completion,
    totalOutOf20: total,
  };
}

/**
 * Pre-seeded Cohort Student Sessions for Mumbai University FE-CMPN Lab Practical evaluation.
 * Represents Divisions FE-CMPN-A, B, and C across 7 lab experiments.
 */
export const SEED_STUDENT_SESSIONS: StudentSessionMetric[] = [
  {
    sessionId: 'sess_mu_001',
    studentName: 'Aarav Sharma',
    rollNo: '2024-FE-01',
    division: 'FE-CMPN-A',
    college: 'Sardar Patel Institute of Technology (SPIT), Mumbai',
    labExperimentId: 'MU_Python_Exp_01',
    labExperimentTitle: 'Variable Swap & Formatted Output',
    weeklyBugsConquered: 14,
    totalAttempts: 12,
    hintsUsed: 2,
    hintDependencyRatio: 0.167,
    activeMinutes: 38,
    idleMinutes: 7,
    totalSessionMinutes: 45,
    cognitiveFlowPercentage: 84,
    lastActiveTimestamp: '2026-10-22 14:30',
    status: 'Completed',
    assessmentMarks: {
      performanceOutOf10: 9,
      vivaUnderstandingOutOf5: 5,
      timelyCompletionOutOf5: 5,
      totalOutOf20: 19,
    },
    primaryMisconception: 'Tuple unpacking syntax vs temporary variable',
  },
  {
    sessionId: 'sess_mu_002',
    studentName: 'Ananya Iyer',
    rollNo: '2024-FE-14',
    division: 'FE-CMPN-A',
    college: 'Sardar Patel Institute of Technology (SPIT), Mumbai',
    labExperimentId: 'MU_Python_Exp_02',
    labExperimentTitle: 'Boundary Condition & Grade Evaluation',
    weeklyBugsConquered: 16,
    totalAttempts: 15,
    hintsUsed: 3,
    hintDependencyRatio: 0.2,
    activeMinutes: 42,
    idleMinutes: 10,
    totalSessionMinutes: 52,
    cognitiveFlowPercentage: 81,
    lastActiveTimestamp: '2026-10-22 15:10',
    status: 'Completed',
    assessmentMarks: {
      performanceOutOf10: 9,
      vivaUnderstandingOutOf5: 4,
      timelyCompletionOutOf5: 5,
      totalOutOf20: 18,
    },
    primaryMisconception: 'Boundary comparison (>= vs > 50)',
  },
  {
    sessionId: 'sess_mu_003',
    studentName: 'Rohan Deshmukh',
    rollNo: '2024-FE-27',
    division: 'FE-CMPN-A',
    college: 'Veermata Jijabai Technological Institute (VJTI), Mumbai',
    labExperimentId: 'MU_Python_Exp_03',
    labExperimentTitle: 'Loop Accumulator & Iteration Bound',
    weeklyBugsConquered: 11,
    totalAttempts: 18,
    hintsUsed: 5,
    hintDependencyRatio: 0.278,
    activeMinutes: 36,
    idleMinutes: 18,
    totalSessionMinutes: 54,
    cognitiveFlowPercentage: 67,
    lastActiveTimestamp: '2026-10-22 16:05',
    status: 'Completed',
    assessmentMarks: {
      performanceOutOf10: 8,
      vivaUnderstandingOutOf5: 3,
      timelyCompletionOutOf5: 4,
      totalOutOf20: 15,
    },
    primaryMisconception: 'Off-by-one in range(1, n + 1) [Stem Caterpillar]',
  },
  {
    sessionId: 'sess_mu_004',
    studentName: 'Priya Nair',
    rollNo: '2024-FE-33',
    division: 'FE-CMPN-B',
    college: 'Veermata Jijabai Technological Institute (VJTI), Mumbai',
    labExperimentId: 'MU_Python_Exp_04',
    labExperimentTitle: 'Safe Division & Zero-Check Guard',
    weeklyBugsConquered: 18,
    totalAttempts: 14,
    hintsUsed: 2,
    hintDependencyRatio: 0.143,
    activeMinutes: 44,
    idleMinutes: 6,
    totalSessionMinutes: 50,
    cognitiveFlowPercentage: 88,
    lastActiveTimestamp: '2026-10-22 16:20',
    status: 'Completed',
    assessmentMarks: {
      performanceOutOf10: 10,
      vivaUnderstandingOutOf5: 5,
      timelyCompletionOutOf5: 5,
      totalOutOf20: 20,
    },
    primaryMisconception: 'ZeroDivisionError guard prior to arithmetic [Fungal Blight]',
  },
  {
    sessionId: 'sess_mu_005',
    studentName: 'Siddharth Patil',
    rollNo: '2024-FE-42',
    division: 'FE-CMPN-B',
    college: 'College of Engineering Pune (COEP Tech University)',
    labExperimentId: 'MU_Python_Exp_05',
    labExperimentTitle: 'Bounded List Traversal & Boundary Guard',
    weeklyBugsConquered: 13,
    totalAttempts: 16,
    hintsUsed: 3,
    hintDependencyRatio: 0.188,
    activeMinutes: 39,
    idleMinutes: 11,
    totalSessionMinutes: 50,
    cognitiveFlowPercentage: 78,
    lastActiveTimestamp: '2026-10-22 16:45',
    status: 'Completed',
    assessmentMarks: {
      performanceOutOf10: 9,
      vivaUnderstandingOutOf5: 4,
      timelyCompletionOutOf5: 5,
      totalOutOf20: 18,
    },
    primaryMisconception: 'List indexing bounds (0 <= idx < len(fruits))',
  },
  {
    sessionId: 'sess_mu_006',
    studentName: 'Sneha Kulkarni',
    rollNo: '2024-FE-55',
    division: 'FE-CMPN-B',
    college: 'College of Engineering Pune (COEP Tech University)',
    labExperimentId: 'MU_Python_Exp_03',
    labExperimentTitle: 'Loop Accumulator & Iteration Bound',
    weeklyBugsConquered: 8,
    totalAttempts: 21,
    hintsUsed: 7,
    hintDependencyRatio: 0.333,
    activeMinutes: 30,
    idleMinutes: 24,
    totalSessionMinutes: 54,
    cognitiveFlowPercentage: 56,
    lastActiveTimestamp: '2026-10-22 16:50',
    status: 'Needs Review',
    assessmentMarks: {
      performanceOutOf10: 7,
      vivaUnderstandingOutOf5: 2,
      timelyCompletionOutOf5: 3,
      totalOutOf20: 12,
    },
    primaryMisconception: 'Infinite loop / timeout >2s [Strangler Vine]',
  },
  {
    sessionId: 'sess_mu_007',
    studentName: 'Tanvi Joshi',
    rollNo: '2024-FE-61',
    division: 'FE-CMPN-C',
    college: 'Dwarkadas J. Sanghvi College of Engineering (DJSCE), Mumbai',
    labExperimentId: 'MU_Python_Exp_06',
    labExperimentTitle: 'String Slicing & Palindrome Verification',
    weeklyBugsConquered: 19,
    totalAttempts: 13,
    hintsUsed: 1,
    hintDependencyRatio: 0.077,
    activeMinutes: 46,
    idleMinutes: 4,
    totalSessionMinutes: 50,
    cognitiveFlowPercentage: 92,
    lastActiveTimestamp: '2026-10-22 17:00',
    status: 'Completed',
    assessmentMarks: {
      performanceOutOf10: 10,
      vivaUnderstandingOutOf5: 5,
      timelyCompletionOutOf5: 5,
      totalOutOf20: 20,
    },
    primaryMisconception: 'Step-slicing notation [::-1]',
  },
  {
    sessionId: 'sess_mu_008',
    studentName: 'Varun Mehta',
    rollNo: '2024-FE-72',
    division: 'FE-CMPN-C',
    college: 'Dwarkadas J. Sanghvi College of Engineering (DJSCE), Mumbai',
    labExperimentId: 'MU_Python_Exp_07',
    labExperimentTitle: 'Modular Factorial & Recursion Terminus',
    weeklyBugsConquered: 15,
    totalAttempts: 17,
    hintsUsed: 3,
    hintDependencyRatio: 0.176,
    activeMinutes: 40,
    idleMinutes: 12,
    totalSessionMinutes: 52,
    cognitiveFlowPercentage: 77,
    lastActiveTimestamp: '2026-10-22 17:05',
    status: 'Completed',
    assessmentMarks: {
      performanceOutOf10: 9,
      vivaUnderstandingOutOf5: 4,
      timelyCompletionOutOf5: 5,
      totalOutOf20: 18,
    },
    primaryMisconception: 'Recursive base condition (val <= 1)',
  },
  {
    sessionId: 'sess_mu_009',
    studentName: 'Ishan Chawla',
    rollNo: '2024-FE-80',
    division: 'FE-CMPN-C',
    college: 'Thadomal Shahani Engineering College (TSEC), Mumbai',
    labExperimentId: 'MU_Python_Exp_05',
    labExperimentTitle: 'Bounded List Traversal & Boundary Guard',
    weeklyBugsConquered: 9,
    totalAttempts: 14,
    hintsUsed: 4,
    hintDependencyRatio: 0.286,
    activeMinutes: 28,
    idleMinutes: 15,
    totalSessionMinutes: 43,
    cognitiveFlowPercentage: 65,
    lastActiveTimestamp: '2026-10-22 17:15',
    status: 'In Progress',
    assessmentMarks: {
      performanceOutOf10: 7,
      vivaUnderstandingOutOf5: 3,
      timelyCompletionOutOf5: 4,
      totalOutOf20: 14,
    },
    primaryMisconception: 'IndexError on upper list boundary access [Stem Caterpillar]',
  },
];

/**
 * Escapes text fields for standard RFC 4180 CSV compliance.
 */
function escapeCsvValue(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates an RFC 4180-compliant CSV string formatted specifically matching
 * Mumbai University (MU) & SPPU Continuous Assessment Sheet (CAS) / Termwork rubrics.
 */
export function generateUniversityLmsCsv(
  sessions: StudentSessionMetric[],
  options?: {
    academicYear?: string;
    courseCode?: string;
    courseName?: string;
    divisionFilter?: string;
  }
): string {
  const academicYear = options?.academicYear || '2024-2025';
  const courseCode = options?.courseCode || 'FEC105';
  const courseName = options?.courseName || 'Python Programming Lab (First Year Engineering)';
  const division = options?.divisionFilter || 'ALL DIVISIONS (FE-CMPN-A/B/C)';

  // University Header Metadata Rows
  const metadataRows: string[] = [
    '# UNIVERSITY CONTINUOUS INTERNAL ASSESSMENT SHEET (CAS)',
    `# University / Directorate: University of Mumbai (MU) / Savitribai Phule Pune University (SPPU)`,
    `# Course: ${courseCode} - ${courseName}`,
    `# Academic Year: ${academicYear} | Semester: FE Semester I | Division: ${division}`,
    `# Source: Code Garden Automated AST Misconception & Telemetry Logger`,
    `# Generated At: ${new Date().toISOString()}`,
    '',
  ];

  // Continuous Assessment Sheet Column Headers (MU / SPPU Official Rubric Format)
  const columns: string[] = [
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

  const headerRow = columns.map(escapeCsvValue).join(',');

  // Data Rows
  const dataRows = sessions.map((sess, idx) => {
    const hintPercent = `${(sess.hintDependencyRatio * 100).toFixed(1)}%`;
    const flowPercent = `${sess.cognitiveFlowPercentage}%`;
    const remark =
      sess.hintDependencyRatio < 0.25
        ? 'High Independence - Exceeded North Star Benchmark'
        : 'Elevated Scaffolding Reliance - Recommended Viva Inquiry';

    const rowValues = [
      idx + 1,
      sess.studentName,
      sess.rollNo,
      sess.division,
      sess.college,
      sess.labExperimentId,
      sess.labExperimentTitle,
      sess.weeklyBugsConquered,
      sess.totalAttempts,
      sess.hintsUsed,
      hintPercent,
      sess.activeMinutes,
      sess.idleMinutes,
      sess.totalSessionMinutes,
      flowPercent,
      sess.status,
      sess.assessmentMarks.performanceOutOf10,
      sess.assessmentMarks.vivaUnderstandingOutOf5,
      sess.assessmentMarks.timelyCompletionOutOf5,
      sess.assessmentMarks.totalOutOf20,
      sess.primaryMisconception || 'None detected',
      remark,
    ];

    return rowValues.map(escapeCsvValue).join(',');
  });

  return [...metadataRows, headerRow, ...dataRows].join('\r\n');
}

/**
 * Triggers native browser download of generated CSV.
 */
export function downloadCsvFile(csvContent: string, fileName: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
