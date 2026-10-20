'use client';

import React, { useState } from 'react';
import { ExecutionResult } from '@/lib/pythonRunner';
import { TestCase } from '@/lib/curriculumData';
import { BugType } from '@/lib/treeEngine';
import { ScaffoldingResponse } from '@/lib/scaffoldingEngine';

interface DiagnosticTerminalProps {
  testCases: TestCase[];
  executionResult: ExecutionResult | null;
  hint: ScaffoldingResponse | null;
  onApplySnippet?: (snippet: string) => void;
  isRunning: boolean;
}

export default function DiagnosticTerminal({
  testCases,
  executionResult,
  hint,
  onApplySnippet,
  isRunning,
}: DiagnosticTerminalProps) {
  const [activeTab, setActiveTab] = useState<'tests' | 'console' | 'quest'>('tests');
  const [isQuestOpen, setIsQuestOpen] = useState<boolean>(true);

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
            {bugInfo && !executionResult?.passed && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: `1px solid ${bugInfo.color}`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '1.75rem' }}>{bugInfo.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, color: bugInfo.color, fontSize: '0.9rem' }}>
                      {bugInfo.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(0,0,0,0.4)',
                        color: '#f87171',
                      }}
                    >
                      {executionResult?.errorType} (-15 HP)
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginBottom: '4px' }}>
                    {bugInfo.damage}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    <strong>Ecological Remedy:</strong> {bugInfo.cure}
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
                {executionResult.stderr && (
                  <div>
                    <div style={{ color: '#ef4444', marginBottom: '4px' }}>--- STDERR TRACEBACK ---</div>
                    <pre style={{ color: '#f87171', whiteSpace: 'pre-wrap' }}>{executionResult.stderr}</pre>
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
