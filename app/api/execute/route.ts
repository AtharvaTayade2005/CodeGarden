import { NextRequest, NextResponse } from 'next/server';
import { initialExercises } from '@/lib/curriculumData';
import { runPythonCode } from '@/lib/pythonRunner';
import { applyExerciseResult, INITIAL_STATE, TreeState } from '@/lib/treeEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exerciseId, code, currentTreeState } = body;

    if (!exerciseId || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Missing required parameters: exerciseId and code' },
        { status: 400 }
      );
    }

    const exercise = initialExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) {
      return NextResponse.json(
        { error: `Exercise with ID "${exerciseId}" not found.` },
        { status: 404 }
      );
    }

    const stateToApply: TreeState = currentTreeState || INITIAL_STATE;

    // Execute student code against exercise test cases in the sandbox
    const executionResult = await runPythonCode(code, exercise.testCases);

    // Calculate deterministic state delta
    const updatedTreeState = applyExerciseResult(
      stateToApply,
      executionResult.passed,
      executionResult.errorType || executionResult.detectedBug
    );

    return NextResponse.json({
      executionResult,
      updatedTreeState,
    });
  } catch (error: any) {
    console.error('API /api/execute error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error during execution' },
      { status: 500 }
    );
  }
}
