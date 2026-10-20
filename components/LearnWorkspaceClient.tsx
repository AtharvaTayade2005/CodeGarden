'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Exercise, initialExercises } from '@/lib/curriculumData';
import { TreeState, TreeStage, INITIAL_STATE, getTreeStage } from '@/lib/treeEngine';
import { ExecutionResult } from '@/lib/pythonRunner';
import { ScaffoldingResponse } from '@/lib/scaffoldingEngine';
import TreeCanvas from './TreeCanvas';
import CodeEditor from './CodeEditor';
import DiagnosticTerminal from './DiagnosticTerminal';

interface LearnWorkspaceClientProps {
  exercise: Exercise;
}

export default function LearnWorkspaceClient({ exercise }: LearnWorkspaceClientProps) {
  const [code, setCode] = useState<string>(exercise.starterCode);
  const [treeState, setTreeState] = useState<TreeState>(INITIAL_STATE);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [hint, setHint] = useState<ScaffoldingResponse | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isHintLoading, setIsHintLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'damage' | 'info' } | null>(
    null
  );

  // Restore or sync treeState from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem('codegarden_tree_state');
      if (saved) {
        setTreeState(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Persist treeState changes
  useEffect(() => {
    try {
      localStorage.setItem('codegarden_tree_state', JSON.stringify(treeState));
    } catch {
      // Ignore
    }
  }, [treeState]);

  // Reset editor when exercise changes
  useEffect(() => {
    setCode(exercise.starterCode);
    setExecutionResult(null);
    setHint(null);
    setAttemptCount(0);
  }, [exercise]);

  const treeStage = getTreeStage(treeState.xp);

  // Run code against Python sandbox API
  const handleRunCode = async () => {
    setIsRunning(true);
    setNotification(null);

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise.id,
          code,
          currentTreeState: treeState,
        }),
      });

      if (!res.ok) {
        throw new Error(`Execution request failed with status ${res.status}`);
      }

      const data = await res.json();
      const newResult: ExecutionResult = data.executionResult;
      const newState: TreeState = data.updatedTreeState;

      setExecutionResult(newResult);
      setTreeState(newState);

      if (newResult.passed) {
        setAttemptCount(0);
        setNotification({
          message: '🌟 Success! Tests Passed: +20 XP, +10 HP (Healed). Parasite resolved!',
          type: 'success',
        });
      } else {
        const nextAttempt = attemptCount + 1;
        setAttemptCount(nextAttempt);
        setNotification({
          message: `⚠️ Failure: -15 HP (Vitality floor at 20). Parasite attached: ${newResult.detectedBug || newResult.errorType}`,
          type: 'damage',
        });

        // Automatically fetch Tier 1 hint on first failure
        if (nextAttempt === 1) {
          fetchHint(newResult, nextAttempt);
        }
      }
    } catch (err: any) {
      console.error('Execution error:', err);
      setNotification({
        message: `Execution Error: ${err.message}`,
        type: 'damage',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Fetch AI Scaffolding Hint
  const fetchHint = async (currentResult?: ExecutionResult | null, attempt?: number) => {
    setIsHintLoading(true);
    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise.id,
          code,
          executionResult: currentResult || executionResult,
          attemptCount: attempt ?? attemptCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHint(data.hint);
      }
    } catch (err) {
      console.error('Hint error:', err);
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleAskHint = () => {
    fetchHint(executionResult, attemptCount > 0 ? attemptCount : 1);
  };

  const handleResetCode = () => {
    setCode(exercise.starterCode);
    setNotification({ message: 'Starter code restored.', type: 'info' });
  };

  const handleApplySnippet = (snippet: string) => {
    setCode(snippet);
    setNotification({
      message: 'Applied code skeleton to editor. Fill in the ___ blanks!',
      type: 'info',
    });
  };

  // Find next exercise
  const currentIndex = initialExercises.findIndex((e) => e.id === exercise.id);
  const nextExercise = initialExercises[currentIndex + 1] || null;
  const prevExercise = initialExercises[currentIndex - 1] || null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Topbar */}
      <header
        style={{
          height: '60px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(8, 13, 10, 0.95)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#34d399',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}
          >
            <span>🌳</span>
            <span>Code Garden</span>
          </Link>

          <span style={{ color: '#4b5563' }}>|</span>

          {/* Exercise Selector Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {initialExercises.map((ex, idx) => {
              const isCurrent = ex.id === exercise.id;
              return (
                <Link
                  key={ex.id}
                  href={`/learn/${ex.id}`}
                  style={{
                    textDecoration: 'none',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: isCurrent ? 700 : 500,
                    background: isCurrent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: isCurrent ? '#34d399' : '#9ca3af',
                    border: `1px solid ${isCurrent ? 'rgba(52, 211, 153, 0.4)' : 'transparent'}`,
                  }}
                >
                  {idx + 1}. {ex.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Global Progress Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <span style={{ color: '#9ca3af' }}>Stage:</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>{treeStage}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <span style={{ color: '#9ca3af' }}>XP:</span>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>{treeState.xp}</span>
          </div>
        </div>
      </header>

      {/* Dynamic Notification Toast */}
      {notification && (
        <div
          style={{
            padding: '10px 24px',
            background:
              notification.type === 'success'
                ? 'rgba(16, 185, 129, 0.2)'
                : notification.type === 'damage'
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(59, 130, 246, 0.2)',
            borderBottom: `1px solid ${
              notification.type === 'success'
                ? '#10b981'
                : notification.type === 'damage'
                ? '#ef4444'
                : '#3b82f6'
            }`,
            color:
              notification.type === 'success'
                ? '#a7f3d0'
                : notification.type === 'damage'
                ? '#fecaca'
                : '#bfdbfe',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Dual-Pane Workspace */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.25fr 0.95fr',
          gap: '20px',
          padding: '20px 24px',
          maxWidth: '1700px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* LEFT COLUMN: Problem Spec, Code Editor, Diagnostic Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Exercise Info Card */}
          <div className="glass-panel" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 700,
                    color: '#10b981',
                  }}
                >
                  Concept: {exercise.concept}
                </span>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f3f4f6', marginTop: '2px' }}>
                  {exercise.title}
                </h1>
              </div>

              {/* Prev / Next Exercise Links */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {prevExercise && (
                  <Link href={`/learn/${prevExercise.id}`} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    ← Prev
                  </Link>
                )}
                {nextExercise && (
                  <Link href={`/learn/${nextExercise.id}`} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    Next →
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <CodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRunCode}
            onAskHint={handleAskHint}
            onReset={handleResetCode}
            isRunning={isRunning}
            isHintLoading={isHintLoading}
            attemptCount={attemptCount}
          />

          {/* Diagnostic Terminal Drawer */}
          <DiagnosticTerminal
            testCases={exercise.testCases}
            executionResult={executionResult}
            hint={hint}
            onApplySnippet={handleApplySnippet}
            isRunning={isRunning}
          />
        </div>

        {/* RIGHT COLUMN: Living Code Tree Visualizer & Parasite HUD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TreeCanvas treeState={treeState} treeStage={treeStage} />

          {/* Ecological Learning Guide Card */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#d1d5db' }}>
              🌿 Garden Mechanics & Growth Rules
            </h3>
            <ul style={{ fontSize: '0.8rem', color: '#9ca3af', paddingLeft: '16px', lineHeight: 1.6 }}>
              <li>
                <strong>Pass an exercise:</strong> +20 XP, +10 HP (capped at 100), eradicates one active bug.
              </li>
              <li>
                <strong>Fail a test case:</strong> -15 HP (hard floor at 20 HP), attaches botanical parasite.
              </li>
              <li>
                <strong>Growth Stages:</strong> Seed (0-99 XP) → Sprout (100-299 XP) → Sapling (300-699 XP) → Flourishing (700+ XP).
              </li>
              <li>
                <strong>Fading AI Hints:</strong> Tier 1 (Socratic Question) → Tier 2 (Pseudocode Plan) → Tier 3 (Code Skeleton with blanks).
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
