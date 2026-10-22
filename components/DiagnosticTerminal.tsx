'use client';

import React, { useState } from 'react';
import { ExecutionResult } from '@/lib/pythonRunner';
import { TestCase } from '@/lib/curriculumData';
import { BugType, ParasiteType, PARASITE_DEFINITIONS } from '@/lib/treeEngine';
import { ScaffoldingResponse } from '@/lib/scaffoldingEngine';

interface DiagnosticTerminalProps {
  testCases: TestCase[];
  executionResult: ExecutionResult | null;
  hint: ScaffoldingResponse | null;
  onApplySnippet?: (snippet: string) => void;
  onDiagnoseParasite?: (parasite: ParasiteType) => void;
  isRunning: boolean;
}

export default function DiagnosticTerminal({
  testCases,
  executionResult,
  hint,
  onApplySnippet,
  onDiagnoseParasite,
  isRunning,
}: DiagnosticTerminalProps) {
  const [activeTab, setActiveTab] = useState<'tests' | 'console' | 'quest'>('tests');
  const [isQuestOpen, setIsQuestOpen] = useState<boolean>(true);
  const [showRawStderr, setShowRawStderr] = useState<boolean>(false);

  const getBugDetails = (bug?: BugType) => {
    switch (bug) {
      case BugType.BOUNDARY_BEETLE:
        return {
          title: 'Boundary Beetle Infestation',
          emoji: '🪲',
          color: '#ef4444',
          damage: 'Nibbling sequence boundaries! Index out of range or division by zero detected.',
          cure: 'Verify that index is within 0 <= idx < len(arr) and check that divisors are not 0.',
        };
      case BugType.STRUCTURE_CATERPILLAR:
        return {
          title: 'Structure Caterpillar Infiltration',
          emoji: '🐛',
          color: '#f59e0b',
          damage: 'Chewing structural fibers! Syntax or indentation irregularity detected.',
          cure: 'Ensure consistent 4-space indentation and check for closing colons and parentheses.',
        };
      case BugType.SCOPE_SLUG:
        return {
          title: 'Scope Slug Residue',
          emoji: '🐌',
          color: '#a855f7',
          damage: 'Leaving confusing slime trails! Undefined variable referenced in local scope.',
          cure: 'Verify that all variables are initialized and assigned before they are referenced.',
        };
      case BugType.LOOP_WEED:
        return {
          title: 'Loop Weed Entanglement',
          emoji: '🌿',
          color: '#84cc16',
          damage: 'Strangling the computational flow! Loop iteration limit or timeout exceeded (3000ms).',
          cure: 'Ensure the loop step variable changes with each iteration toward its exit condition.',
        };
      default:
        return null;
    }
  };

  const bugInfo = executionResult?.detectedBug ? getBugDetails(executionResult.detectedBug) : null;

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '260px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Terminal Tab Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          background: 'rgba(10, 15, 12, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('tests')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'tests' ? 'rgba(52, 211, 153, 0.15)' : 'transparent',
              color: activeTab === 'tests' ? '#34d399' : '#9ca3af',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🧪</span>
            <span>Test Cases</span>
            {executionResult && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  background: executionResult.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: executionResult.passed ? '#34d399' : '#f87171',
                }}
              >
                {executionResult.passed ? 'Passed' : 'Failed'}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('console')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'console' ? 'rgba(52, 211, 153, 0.15)' : 'transparent',
              color: activeTab === 'console' ? '#34d399' : '#9ca3af',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>💻</span>
            <span>Console & Traceback</span>
          </button>

          {hint && (
            <button
              onClick={() => setActiveTab('quest')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'quest' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.08)',
                color: activeTab === 'quest' ? '#c084fc' : '#a855f7',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>✨</span>
              <span>Socratic Recovery Quest (Tier {hint.tier})</span>
            </button>
          )}
        </div>

        {executionResult && (
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            ⏱️ {executionResult.executionTimeMs}ms
          </span>
        )}
      </div>

      {/* Terminal Content Body */}
      <div style={{ padding: '16px', flex: 1, overflowY: 'auto', background: 'rgba(6, 10, 8, 0.9)' }}>
        {isRunning && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.875rem' }}>
            <span className="animate-spin">🌀</span>
            <span>Running isolated Python execution sandbox...</span>
          </div>
        )}

        {/* TAB 1: Test Cases */}
        {!isRunning && activeTab === 'tests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Parasite Alert Card on Failure */}
            {!executionResult?.passed && (executionResult?.detectedParasite || bugInfo) && (
              <div
                style={{
                  padding: '14px 16px',
                  background: executionResult?.detectedParasite
                    ? PARASITE_DEFINITIONS[executionResult.detectedParasite].bg
                    : 'rgba(239, 68, 68, 0.08)',
                  border: `1.5px solid ${
                    executionResult?.detectedParasite
                      ? PARASITE_DEFINITIONS[executionResult.detectedParasite].color
                      : bugInfo?.color || '#ef4444'
                  }`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  boxShadow: executionResult?.detectedParasite
                    ? `0 4px 16px ${PARASITE_DEFINITIONS[executionResult.detectedParasite].bg}`
                    : 'none',
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>
                  {executionResult?.detectedParasite
                    ? PARASITE_DEFINITIONS[executionResult.detectedParasite].emoji
                    : bugInfo?.emoji || '⚠️'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: executionResult?.detectedParasite
                            ? PARASITE_DEFINITIONS[executionResult.detectedParasite].color
                            : bugInfo?.color || '#ef4444',
                          fontSize: '0.92rem',
                        }}
                      >
                        {executionResult?.detectedParasite
                          ? `${PARASITE_DEFINITIONS[executionResult.detectedParasite].name} Attached`
                          : bugInfo?.title || 'Execution Exception'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '1px 8px',
                          borderRadius: '4px',
                          background: 'rgba(0,0,0,0.4)',
                          color: '#e2e8f0',
                        }}
                      >
                        {executionResult?.astLocation
                          ? `AST Node: ${PARASITE_DEFINITIONS[executionResult.detectedParasite!].locationLabel}`
                          : executionResult?.errorType} (-15 HP)
                      </span>
                    </div>

                    {executionResult?.detectedParasite && onDiagnoseParasite && (
                      <button
                        onClick={() => onDiagnoseParasite(executionResult.detectedParasite!)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: PARASITE_DEFINITIONS[executionResult.detectedParasite].color,
                          color: '#0f172a',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        <span>{PARASITE_DEFINITIONS[executionResult.detectedParasite].emoji}</span>
                        <span>Click Bug on Tree</span>
                      </button>
                    )}
                  </div>

                  {/* Single-Sentence Socratic Prompt */}
                  {executionResult?.socraticPrompt ? (
                    <div
                      style={{
                        padding: '8px 10px',
                        background: 'rgba(0,0,0,0.4)',
                        borderLeft: `3px solid ${
                          executionResult.detectedParasite
                            ? PARASITE_DEFINITIONS[executionResult.detectedParasite].color
                            : '#ef4444'
                        }`,
                        borderRadius: '0 6px 6px 0',
                        marginTop: '4px',
                        marginBottom: '6px',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#f8fafc', fontWeight: 500, lineHeight: 1.4 }}>
                        &ldquo;{executionResult.socraticPrompt}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                      {bugInfo?.damage}
                    </p>
                  )}

                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                    <strong>Ecological Remedy:</strong>{' '}
                    {executionResult?.detectedParasite
                      ? PARASITE_DEFINITIONS[executionResult.detectedParasite].description
                      : bugInfo?.cure}
                  </p>
                </div>
              </div>
            )}

            {/* Test Case Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {testCases.map((tc, idx) => {
                const isFailedCase =
                  executionResult && !executionResult.passed && executionResult.failedTestCaseIndex === idx;
                const isPassedCase =
                  executionResult && (executionResult.passed || (executionResult.failedTestCaseIndex !== undefined && executionResult.failedTestCaseIndex > idx));

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${
                        isFailedCase
                          ? 'rgba(239, 68, 68, 0.4)'
                          : isPassedCase
                          ? 'rgba(16, 185, 129, 0.3)'
                          : 'rgba(255, 255, 255, 0.06)'
                      }`,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>
                        Test Case {idx + 1} {tc.isHidden && '🔒 (Hidden)'}
                      </span>
                      {executionResult && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: isFailedCase ? '#f87171' : isPassedCase ? '#34d399' : '#9ca3af',
                          }}
                        >
                          {isFailedCase ? '✗ FAILED' : isPassedCase ? '✓ PASSED' : 'Pending'}
                        </span>
                      )}
                    </div>

                    {!tc.isHidden ? (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#d1d5db',
                          background: 'rgba(0,0,0,0.3)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                        }}
                      >
                        <div>
                          <span style={{ color: '#6b7280' }}>Input: </span>
                          <span>{tc.input.replace(/\n/g, ' ↵ ')}</span>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }}>Expected: </span>
                          <span>{tc.expectedOutput}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                        Hidden evaluation test case to verify generalization.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Console & Traceback */}
        {!isRunning && activeTab === 'console' && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            {executionResult ? (
              <div>
                {executionResult.stdout && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ color: '#6b7280', marginBottom: '4px' }}>--- STDOUT ---</div>
                    <pre style={{ color: '#34d399', whiteSpace: 'pre-wrap' }}>{executionResult.stdout}</pre>
                  </div>
                )}
                {/* Intercept raw compiler stack trace with localized botanical parasite card (Req 2) */}
                {executionResult.stderr && (
                  <div>
                    {executionResult.detectedParasite ? (
                      <div
                        style={{
                          padding: '16px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: `1.5px solid ${PARASITE_DEFINITIONS[executionResult.detectedParasite].color}`,
                          borderRadius: '10px',
                          boxShadow: `0 4px 20px ${PARASITE_DEFINITIONS[executionResult.detectedParasite].bg}`,
                          marginBottom: '14px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.6rem' }}>{PARASITE_DEFINITIONS[executionResult.detectedParasite].emoji}</span>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: PARASITE_DEFINITIONS[executionResult.detectedParasite].color }}>
                                  Raw Terminal Traceback Intercepted
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    background: 'rgba(0,0,0,0.4)',
                                    color: '#94a3b8',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                  }}
                                >
                                  Localized to AST Node
                                </span>
                              </div>
                              <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                                A visual parasite has attached to your Living Code Tree at the{' '}
                                <strong style={{ color: PARASITE_DEFINITIONS[executionResult.detectedParasite].color }}>
                                  {PARASITE_DEFINITIONS[executionResult.detectedParasite].locationLabel}
                                </strong>
                                .
                              </span>
                            </div>
                          </div>

                          {onDiagnoseParasite && (
                            <button
                              onClick={() => onDiagnoseParasite(executionResult.detectedParasite!)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                background: PARASITE_DEFINITIONS[executionResult.detectedParasite].color,
                                color: '#0f172a',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                              }}
                            >
                              <span>{PARASITE_DEFINITIONS[executionResult.detectedParasite].emoji}</span>
                              <span>Inspect on Tree</span>
                            </button>
                          )}
                        </div>

                        {/* Single-sentence Socratic prompt display */}
                        <div
                          style={{
                            padding: '10px 12px',
                            background: 'rgba(0,0,0,0.5)',
                            borderLeft: `3px solid ${PARASITE_DEFINITIONS[executionResult.detectedParasite].color}`,
                            borderRadius: '0 6px 6px 0',
                            marginBottom: '10px',
                          }}
                        >
                          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                            Socratic Diagnostic Question:
                          </div>
                          <p style={{ margin: 0, fontSize: '0.84rem', color: '#f8fafc', fontWeight: 500, lineHeight: 1.45 }}>
                            &ldquo;{executionResult.socraticPrompt || PARASITE_DEFINITIONS[executionResult.detectedParasite].defaultPrompt}&rdquo;
                          </p>
                        </div>

                        {/* Collapsible raw trace for instructors / advanced debugging */}
                        <div>
                          <button
                            onClick={() => setShowRawStderr(!showRawStderr)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748b',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>{showRawStderr ? '▼ Hide' : '▶ Show'} raw compiler trace (advanced debug only)</span>
                          </button>
                          {showRawStderr && (
                            <pre style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '6px', background: 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
                              {executionResult.stderr}
                            </pre>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ color: '#ef4444', marginBottom: '4px' }}>--- EXECUTION NOTICE ---</div>
                        <pre style={{ color: '#f87171', whiteSpace: 'pre-wrap' }}>{executionResult.stderr}</pre>
                      </div>
                    )}
                  </div>
                )}
                {!executionResult.stdout && !executionResult.stderr && (
                  <span style={{ color: '#6b7280' }}>Program exited cleanly with no console output.</span>
                )}
              </div>
            ) : (
              <span style={{ color: '#6b7280' }}>No execution output yet. Click "Run Code" to execute.</span>
            )}
          </div>
        )}

        {/* TAB 3: Socratic Recovery Quest Box */}
        {hint !== null && !isRunning && (activeTab === 'quest' || isQuestOpen) && (
          <div
            style={{
              marginTop: activeTab === 'quest' ? 0 : '16px',
              padding: '14px',
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                cursor: 'pointer',
              }}
              onClick={() => setIsQuestOpen(!isQuestOpen)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>✨</span>
                <span style={{ fontWeight: 700, color: '#c084fc', fontSize: '0.875rem' }}>
                  Socratic Recovery Quest: Tier {hint.tier} ({hint.tierName})
                </span>
              </div>
              <span style={{ color: '#a855f7', fontSize: '0.8rem' }}>{isQuestOpen ? '▲ Hide' : '▼ Expand'}</span>
            </div>

            {isQuestOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '0.85rem', color: '#e9d5ff', lineHeight: 1.5 }}>
                  {hint.guidanceText}
                </p>

                {hint.allowedSnippet && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 600 }}>
                        {hint.tier === 3 ? 'Code Skeleton (Fill in the ___ blanks):' : 'Structural Plan:'}
                      </span>
                      {hint.tier === 3 && onApplySnippet && (
                        <button
                          onClick={() => onApplySnippet(hint.allowedSnippet!)}
                          style={{
                            background: 'rgba(168, 85, 247, 0.2)',
                            border: '1px solid rgba(168, 85, 247, 0.4)',
                            color: '#d8b4fe',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                          }}
                        >
                          Apply Skeleton to Editor
                        </button>
                      )}
                    </div>
                    <pre
                      style={{
                        padding: '10px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        borderRadius: '6px',
                        color: '#f3e8ff',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {hint.allowedSnippet}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
