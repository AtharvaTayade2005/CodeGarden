'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Exercise, initialExercises } from '@/lib/curriculumData';
import { TreeState, TreeStage, INITIAL_STATE, getTreeStage, ParasiteType } from '@/lib/treeEngine';
import { ExecutionResult } from '@/lib/pythonRunner';
import { ScaffoldingResponse } from '@/lib/scaffoldingEngine';
import TreeCanvas from './TreeCanvas';
import CodeEditor from './CodeEditor';
import DiagnosticTerminal from './DiagnosticTerminal';
import DemoControls from './DemoControls';
import DendroTimelineSlider from './DendroTimelineSlider';
import {
  KeystrokeTelemetryPoint,
  StateMachineContext,
  INITIAL_TELEMETRY_CONTEXT,
  generateInitialTelemetryRings,
  evaluateExecutionEvent,
} from '@/lib/dendrochronology';

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
  const [selectedParasite, setSelectedParasite] = useState<ParasiteType | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'damage' | 'info' } | null>(
    null
  );

  // Dendrochronology Telemetry & State Logger (Req 1 & Req 2)
  const [telemetry, setTelemetry] = useState<KeystrokeTelemetryPoint[]>(() =>
    generateInitialTelemetryRings(exercise.starterCode, INITIAL_STATE)
  );
  const [telemetryContext, setTelemetryContext] = useState<StateMachineContext>(INITIAL_TELEMETRY_CONTEXT);
  const [previousCode, setPreviousCode] = useState<string>(exercise.starterCode);
  const [scrubbedIndex, setScrubbedIndex] = useState<number | null>(null);

  // Replay frame resolution (Req 4: Scrubbable timeline slider replay)
  const isLive = scrubbedIndex === null || scrubbedIndex === telemetry.length - 1;
  const currentTimelineIndex = scrubbedIndex ?? Math.max(0, telemetry.length - 1);
  const activeTimelinePoint = telemetry[currentTimelineIndex];

  const displayedCode = !isLive && activeTimelinePoint ? activeTimelinePoint.codeSnapshot : code;
  const displayedTreeState = !isLive && activeTimelinePoint ? activeTimelinePoint.treeState : treeState;
  const displayedTreeStage = getTreeStage(displayedTreeState.xp);

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
    setPreviousCode(exercise.starterCode);
    setExecutionResult(null);
    setHint(null);
    setAttemptCount(0);
    setScrubbedIndex(null);
    setTelemetry(generateInitialTelemetryRings(exercise.starterCode, treeState));
    setTelemetryContext(INITIAL_TELEMETRY_CONTEXT);
  }, [exercise]);

  const treeStage = getTreeStage(treeState.xp);

  // Run code against Python sandbox API
  const handleRunCode = async () => {
    // Edge-case check: Empty code submission warning
    if (!code.trim()) {
      setNotification({
        message: '⚠️ Validation Warning: Code editor is empty. Please write Python code before running.',
        type: 'damage',
      });
      return;
    }

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
      if (newResult.detectedParasite) {
        setSelectedParasite(newResult.detectedParasite);
      } else if (newResult.passed) {
        setSelectedParasite(null);
      }

      // Evaluate Dendrochronology State Machine Event (Req 2: Drought <45s vs Clear Growth)
      const { telemetryPoint, updatedContext } = evaluateExecutionEvent(
        newResult.passed,
        code,
        newState,
        telemetryContext,
        previousCode
      );
      setTelemetry((prev) => [...prev, telemetryPoint]);
      setTelemetryContext(updatedContext);
      setPreviousCode(code);
      setScrubbedIndex(null); // Return to live on new run

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
    setTelemetryContext((prev) => ({
      ...prev,
      hintsUsedForCurrentBug: prev.hintsUsedForCurrentBug + 1,
    }));
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
    setPreviousCode(exercise.starterCode);
    setExecutionResult(null);
    setHint(null);
    setAttemptCount(0);
    setScrubbedIndex(null);
    setTreeState((prev) => ({
      ...prev,
      hp: 80, // Restored to baseline HP
      activeBugs: [], // Clear parasites
    }));
    setTelemetry(generateInitialTelemetryRings(exercise.starterCode, { ...treeState, hp: 80, activeBugs: [] }));
    setTelemetryContext(INITIAL_TELEMETRY_CONTEXT);
    setNotification({
      message: 'Starter code restored. HP reset to baseline (80 HP); accumulated XP preserved.',
      type: 'info',
    });
  };

  const handleSetDemoState = (newState: TreeState, message: string) => {
    setTreeState(newState);
    setNotification({ message, type: 'info' });
    setScrubbedIndex(null);

    // Record demo trigger as a new tree ring in the telemetry trajectory
    const now = Date.now();
    const hasBug = newState.activeBugs.length > 0;
    const demoPoint: KeystrokeTelemetryPoint = {
      timestamp: now,
      deltaLength: 0,
      errorCount: hasBug ? 1 : 0,
      state: hasBug ? 'stuck' : 'recovered',
      codeSnapshot: code,
      treeState: { ...newState },
      ringType: hasBug ? 'drought_thrashing' : 'clear_growth',
      label: hasBug ? 'Simulated Drought Knot' : 'Simulated Growth Ring',
      detail: message,
      nodeCount: hasBug ? 2 : 0,
      diffSummary: 'Demo State',
    };
    setTelemetry((prev) => [...prev, demoPoint]);
  };


  const handleApplySnippet = (snippet: string) => {
    setCode(snippet);
    setNotification({
      message: 'Applied code skeleton to editor. Fill in the ___ blanks!',
      type: 'info',
    });
  };

  // 8-Minute Micro-Sprint Timer (Slide 5: Restructured learning into 8-minute micro-sprints)
  const [sprintSeconds, setSprintSeconds] = useState<number>(8 * 60);
  const [isSprintActive, setIsSprintActive] = useState<boolean>(true);
  const [showFacultyCockpit, setShowFacultyCockpit] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isSprintActive && sprintSeconds > 0) {
      timer = setInterval(() => {
        setSprintSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSprintActive, sprintSeconds]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
          height: '64px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(8, 13, 10, 0.95)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#34d399',
              fontWeight: 800,
              fontSize: '1.05rem',
            }}
          >
            <span>🌳</span>
            <span>Code Garden</span>
          </Link>

          <span style={{ color: '#4b5563' }}>|</span>

          {/* Exercise Selector Pills */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', maxWidth: '480px' }}>
            {initialExercises.map((ex, idx) => {
              const isCurrent = ex.id === exercise.id;
              return (
                <Link
                  key={ex.id}
                  href={`/learn/${ex.id}`}
                  style={{
                    textDecoration: 'none',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    whiteSpace: 'nowrap',
                    fontWeight: isCurrent ? 700 : 500,
                    background: isCurrent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: isCurrent ? '#34d399' : '#9ca3af',
                    border: `1px solid ${isCurrent ? 'rgba(52, 211, 153, 0.4)' : 'transparent'}`,
                  }}
                  title={ex.title}
                >
                  Exp {idx + 1}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Presentation & Validated Metrics HUD */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* 8-Minute Micro-Sprint Timer (Slide 5) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: sprintSeconds < 60 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.1)',
              border: `1px solid ${sprintSeconds < 60 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(52, 211, 153, 0.25)'}`,
              borderRadius: '6px',
              fontSize: '0.75rem',
            }}
            title="8-Minute Micro-Sprint (Slide 5: Prevents student cognitive fatigue)"
          >
            <span style={{ cursor: 'pointer' }} onClick={() => setIsSprintActive(!isSprintActive)}>
              {isSprintActive ? '⏱️' : '⏸️'}
            </span>
            <span style={{ color: sprintSeconds < 60 ? '#f87171' : '#34d399', fontWeight: 700 }}>
              Sprint: {formatTimer(sprintSeconds)}
            </span>
          </div>

          {/* North Star Metric (Slide 7) */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: '#9ca3af',
            }}
            className="md-flex"
          >
            <span>Bugs Conquered:</span>
            <strong style={{ color: '#34d399' }}>14/15 Target</strong>
          </div>

          {/* Guardrail: Hint Dependency Ratio (Slide 7) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '6px',
              fontSize: '0.72rem',
              color: '#fbbf24',
              fontWeight: 600,
            }}
            title="Slide 7 Guardrail: Hint Dependency Ratio < 25%"
          >
            <span>Hint Ratio: 18%</span>
          </div>

          {/* Tree Vitality Stage */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
            <span style={{ color: '#10b981', fontWeight: 700 }}>{treeStage}</span>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>({treeState.hp} HP)</span>
          </div>

          {/* Faculty LMS Export & Cockpit Toggle */}
          <Link
            href="/faculty"
            className="btn-secondary"
            style={{
              padding: '4px 10px',
              fontSize: '0.72rem',
              borderColor: 'rgba(52, 211, 153, 0.4)',
              color: '#34d399',
              background: 'rgba(52, 211, 153, 0.1)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Open Professor Summary Dashboard & LMS Export"
          >
            <span>🎓</span>
            <span>Faculty LMS Export</span>
          </Link>

          <button
            onClick={() => setShowFacultyCockpit(!showFacultyCockpit)}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.72rem', borderColor: 'rgba(99, 102, 241, 0.4)' }}
            title="Open Teacher Diagnostic Cockpit (Slide 6)"
          >
            <span>📊 Cohort Heatmap</span>
          </button>
        </div>
      </header>

      {/* Faculty Diagnostic Cockpit Modal (Slide 6 & 11) */}
      {showFacultyCockpit && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowFacultyCockpit(false)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '750px',
              width: '100%',
              padding: '24px',
              background: 'rgba(15, 23, 20, 0.98)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#818cf8', fontWeight: 700 }}>
                  Phase 2 Institutional Product (Slide 6 & 11)
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f3f4f6', margin: '2px 0' }}>
                  Faculty Diagnostic Cockpit — Batch Misconception Heatmap
                </h2>
                <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                  Live cohort analytics for Mumbai University FE-CMPN Division TE-C (100 Active Students).
                </p>
              </div>
              <button
                onClick={() => setShowFacultyCockpit(false)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Batch Heatmap Evidence from Slides 3 & 5 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 700 }}>CRITICAL LAB VIVA BOTTLENECK</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>78% Loop Index Confusion</div>
                <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '4px 0 0' }}>
                  Off-by-one errors in `range(stop)` parameters leading to Boundary Beetle infestations.
                </p>
              </div>

              <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>SYNTAX ABANDONMENT RATE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>80% Indentation Friction</div>
                <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '4px 0 0' }}>
                  Beginners struggle with Python indentation blocks before grasping algorithmic control flow.
                </p>
              </div>
            </div>

            {/* Experiment Cohort Lift */}
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(52, 211, 153, 0.25)', borderRadius: '8px', marginBottom: '16px' }}>
              <strong style={{ fontSize: '0.8rem', color: '#34d399' }}>A/B Cohort Test Result (Slide 8):</strong>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '4px 0 0' }}>
                University lab practical framing generated a <strong>65% repeat engagement rate</strong> versus 28% for fantasy RPG quest titles (+132% lift across 40 students).
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Link
                href="/faculty"
                className="btn-primary"
                style={{
                  padding: '6px 16px',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>📥</span>
                <span>Open Professor Dashboard & LMS Export</span>
              </Link>
              <button onClick={() => setShowFacultyCockpit(false)} className="btn-secondary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
                Close View
              </button>
            </div>
          </div>
        </div>
      )}


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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {exercise.labExperimentNumber}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 600 }}>
                    {exercise.syllabusUnit}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f3f4f6', marginTop: '2px', marginBottom: '4px' }}>
                  {exercise.title}
                </h1>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Target Diagnostic: <strong style={{ color: '#d1d5db' }}>{exercise.concept}</strong>
                </div>
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

          {/* Replay Mode Notice Banner when scrubbed in past */}
          {!isLive && (
            <div
              style={{
                padding: '8px 16px',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(129, 140, 248, 0.4)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: '#e0e7ff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⏪</span>
                <span>
                  <strong>Time-Lapse Replay:</strong> Showing Ring #{currentTimelineIndex + 1} ({activeTimelinePoint?.label})
                </span>
              </div>
              <button
                onClick={() => setScrubbedIndex(null)}
                className="btn-primary"
                style={{ padding: '3px 10px', fontSize: '0.72rem' }}
              >
                Return to Live Code
              </button>
            </div>
          )}

          {/* Monaco Code Editor */}
          <CodeEditor
            code={displayedCode}
            onChange={(val) => {
              if (scrubbedIndex !== null) setScrubbedIndex(null);
              setCode(val);
            }}
            onRun={handleRunCode}
            onAskHint={handleAskHint}
            onReset={handleResetCode}
            isRunning={isRunning}
            isHintLoading={isHintLoading}
            attemptCount={attemptCount}
          />

          {/* Dendrochronology Scrubbable Timeline Slider (Req 4) */}
          <DendroTimelineSlider
            telemetry={telemetry}
            currentIndex={currentTimelineIndex}
            onIndexChange={(idx) => setScrubbedIndex(idx)}
            onReturnToLive={() => setScrubbedIndex(null)}
            isLive={isLive}
          />

          {/* Diagnostic Terminal Drawer */}
          <DiagnosticTerminal
            testCases={exercise.testCases}
            executionResult={executionResult}
            hint={hint}
            onApplySnippet={handleApplySnippet}
            onDiagnoseParasite={(parasite) => {
              setSelectedParasite(parasite);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isRunning={isRunning}
          />
        </div>

        {/* RIGHT COLUMN: Living Code Tree Visualizer & Parasite HUD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TreeCanvas
            treeState={displayedTreeState}
            treeStage={displayedTreeStage}
            telemetry={telemetry}
            activeRingIndex={currentTimelineIndex}
            onSelectRing={(idx) => setScrubbedIndex(idx)}
            activeParasite={selectedParasite || executionResult?.detectedParasite}
            socraticPrompt={executionResult?.socraticPrompt}
            onSelectParasite={(p) => setSelectedParasite(p)}
          />

          {/* Demo Controls for Presentation & Simulation */}
          <DemoControls onSetDemoState={handleSetDemoState} />


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
