import { NextRequest, NextResponse } from 'next/server';
import { initialExercises } from '@/lib/curriculumData';
import { generateScaffoldingHint } from '@/lib/scaffoldingEngine';
import { ExecutionResult } from '@/lib/pythonRunner';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exerciseId, code, executionResult, attemptCount } = body;

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'Missing required parameter: exerciseId' },
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

    const execResult: ExecutionResult = executionResult || {
      passed: false,
      stdout: '',
      stderr: 'Request for hint without prior test execution failure',
      errorType: 'PedagogicalHintRequested',
      executionTimeMs: 0,
    };

    const hint = await generateScaffoldingHint({
      exercise,
      studentCode: typeof code === 'string' ? code : exercise.starterCode,
      executionResult: execResult,
      attemptCount: typeof attemptCount === 'number' ? attemptCount : 1,
    });

    return NextResponse.json({ hint });
  } catch (error: any) {
    console.error('API /api/hint error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error while generating scaffolding hint' },
      { status: 500 }
    );
  }
}
