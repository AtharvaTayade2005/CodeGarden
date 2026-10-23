'use client';

import React, { useState, useEffect } from 'react';
import { CONCEPTS_DATA, ConceptTopic, getConceptForExercise } from '@/src/data/concepts';

interface TheoryDrawerProps {
  exerciseId: string;
  exerciseConcept: string;
  isUnlocked: boolean;
  onUnlockEditor: () => void;
}

export default function TheoryDrawer({
  exerciseId,
  exerciseConcept,
  isUnlocked,
  onUnlockEditor,
}: TheoryDrawerProps) {
  // Identify the best initial concept for this exercise
  const initialConcept = getConceptForExercise(exerciseId, exerciseConcept);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialConcept.id);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [hasUserDismissed, setHasUserDismissed] = useState<boolean>(false);

  // Sync selected concept whenever exercise changes
  useEffect(() => {
    const relevant = getConceptForExercise(exerciseId, exerciseConcept);
    setSelectedTopicId(relevant.id);
  }, [exerciseId, exerciseConcept]);

  // Read saved collapsed state from localStorage
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem('codegarden_theory_drawer_collapsed');
      if (savedCollapsed === 'true') {
        setIsCollapsed(true);
        setHasUserDismissed(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const currentTopic: ConceptTopic =
    CONCEPTS_DATA.find((c) => c.id === selectedTopicId) || initialConcept;

  const handleProceedToCode = () => {
    setIsCollapsed(true);
    setHasUserDismissed(true);
    onUnlockEditor();
    try {
      localStorage.setItem('codegarden_theory_drawer_collapsed', 'true');
    } catch {
      // Ignore
    }
  };

  const handleToggleExpand = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    try {
      localStorage.setItem('codegarden_theory_drawer_collapsed', String(nextState));
    } catch {
      // Ignore
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        marginBottom: '16px',
        border: '1.5px solid rgba(52, 211, 153, 0.35)',
        background: 'linear-gradient(180deg, rgba(14, 25, 18, 0.95) 0%, rgba(9, 17, 12, 0.98) 100%)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Drawer Header & Tabs */}
      <div
        style={{
          padding: '12px 18px',
          background: 'rgba(20, 36, 26, 0.85)',
          borderBottom: isCollapsed ? 'none' : '1px solid rgba(52, 211, 153, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>💡</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  color: '#ffffff',
                }}
              >
                Foundational Theory & Syntax Deck
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-pixel)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(52, 211, 153, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                }}
              >
                PRE-CODE INTUITION
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#9ca3af', margin: 0 }}>
              Master the core syntax pattern before writing your lab solution.
            </p>
          </div>
        </div>

        {/* Action Toggle Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleToggleExpand}
            className="btn-secondary"
            style={{
              padding: '4px 12px',
              fontSize: '0.76rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: 'rgba(52, 211, 153, 0.3)',
              color: isCollapsed ? '#34d399' : '#e5e7eb',
            }}
          >
            <span>{isCollapsed ? '📖 Open Theory Deck' : '🔼 Collapse Deck'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Content Area */}
      {!isCollapsed && (
        <div style={{ padding: '18px 20px' }}>
          {/* Topic Navigation Chips */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '12px',
              marginBottom: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {CONCEPTS_DATA.map((concept) => {
              const isSelected = concept.id === selectedTopicId;
              const isExerciseMatch = concept.relatedExerciseIds.includes(exerciseId);

              return (
                <button
                  key={concept.id}
                  onClick={() => setSelectedTopicId(concept.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: isSelected
                      ? '1.5px solid #34d399'
                      : isExerciseMatch
                      ? '1px dashed rgba(52, 211, 153, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.2) 100%)'
                      : 'rgba(20, 32, 24, 0.6)',
                    color: isSelected ? '#34d399' : '#d1d5db',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{concept.icon}</span>
                  <span>{concept.shortLabel}</span>
                  {isExerciseMatch && (
                    <span
                      style={{
                        fontSize: '0.62rem',
                        background: 'rgba(52, 211, 153, 0.2)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        color: '#6ee7b7',
                      }}
                    >
                      Target
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Topic Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '18px' }}>
            {/* Left: Theory Intuition & Blueprint Syntax */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{currentTopic.icon}</span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      margin: 0,
                    }}
                  >
                    {currentTopic.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: '0.86rem',
                    color: '#d1d5db',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {currentTopic.theory}
                </p>
              </div>

              {/* Syntax Blueprint Block */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#34d399',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Syntax Structure
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>Python 3.12 Blueprint</span>
                </div>
                <pre
                  style={{
                    background: '#070d09',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: '#a7f3d0',
                    lineHeight: 1.5,
                    overflowX: 'auto',
                    margin: 0,
                  }}
                >
                  <code>{currentTopic.syntax}</code>
                </pre>
              </div>
            </div>

            {/* Right: Minimal Runnable Example & Output Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#fbbf24',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Minimal Runnable Example
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>Live Simulation</span>
                </div>
                <pre
                  style={{
                    background: '#070d09',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: '#fef08a',
                    lineHeight: 1.5,
                    overflowX: 'auto',
                    margin: 0,
                  }}
                >
                  <code>{currentTopic.runnableExample}</code>
                </pre>
              </div>

              {/* Console Expected Output */}
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Expected Output (Stdout)
                </span>
                <div
                  style={{
                    background: '#040705',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: '#6ee7b7',
                    lineHeight: 1.4,
                  }}
                >
                  {currentTopic.expectedOutput}
                </div>
              </div>

              {/* Pitfall Alert */}
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  color: '#fca5a5',
                  lineHeight: 1.4,
                }}
              >
                <strong>⚠️ Common AST Trap:</strong> {currentTopic.commonPitfalls}
              </div>
            </div>
          </div>

          {/* Action Footer: "Got It / Proceed to Code" */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
              <span>Ready to start? Click below to unlock full focus on the Monaco code editor.</span>
            </div>

            <button
              onClick={handleProceedToCode}
              className="btn-codedex-yellow"
              style={{
                padding: '8px 20px',
                fontSize: '0.88rem',
                borderRadius: '8px',
              }}
            >
              <span>🌱</span>
              <span>Got It / Proceed to Code</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
