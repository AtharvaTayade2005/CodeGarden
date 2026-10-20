'use client';

import React, { useState } from 'react';
import { TreeState, BugType } from '@/lib/treeEngine';

interface DemoControlsProps {
  onSetDemoState: (state: TreeState, message: string) => void;
}

export default function DemoControls({ onSetDemoState }: DemoControlsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSimulateNewStudent = () => {
    const newState: TreeState = {
      hp: 80,
      xp: 0,
      activeBugs: [],
      streakDays: 0,
    };
    onSetDemoState(newState, 'Simulated: New Student (Seed Stage, 80 HP, 0 XP)');
  };

  const handleSimulateBugInfection = () => {
    const newState: TreeState = {
      hp: 50,
      xp: 350,
      activeBugs: [BugType.BOUNDARY_BEETLE],
      streakDays: 3,
    };
    onSetDemoState(
      newState,
      'Simulated: Bug Infection (Sapling Stage, Boundary Beetle active, 50 HP)'
    );
  };

  const handleSimulateRecovery = () => {
    const newState: TreeState = {
      hp: 100,
      xp: 750,
      activeBugs: [],
      streakDays: 7,
    };
    onSetDemoState(
      newState,
      'Simulated: Recovery (Bug cleared, Tree blooms, Level up to Flourishing Tree)'
    );
  };

  return (
    <div
      style={{
        marginTop: '12px',
        padding: '12px 16px',
        background: 'rgba(30, 41, 59, 0.45)',
        border: '1px dashed rgba(148, 163, 184, 0.3)',
        borderRadius: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>🎮</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>
            Presentation Demo Personas
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {isOpen ? '▲ Hide Controls' : '▼ Expand Controls'}
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Button 1 */}
          <button
            onClick={handleSimulateNewStudent}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '0.78rem',
              textAlign: 'left',
              borderColor: 'rgba(52, 211, 153, 0.3)',
            }}
          >
            <span>🌱</span>
            <span>Simulate New Student (Seed Stage, 80 HP, 0 XP)</span>
          </button>

          {/* Button 2 */}
          <button
            onClick={handleSimulateBugInfection}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '0.78rem',
              textAlign: 'left',
              borderColor: 'rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              background: 'rgba(239, 68, 68, 0.08)',
            }}
          >
            <span>🪲</span>
            <span>Simulate Bug Infection (Sapling Stage, Boundary Beetle active, 50 HP)</span>
          </button>

          {/* Button 3 */}
          <button
            onClick={handleSimulateRecovery}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '0.78rem',
              textAlign: 'left',
              borderColor: 'rgba(236, 72, 153, 0.35)',
              color: '#f472b6',
              background: 'rgba(236, 72, 153, 0.08)',
            }}
          >
            <span>🌸</span>
            <span>Simulate Recovery (Bug cleared, Tree blooms, Level up to Flourishing Tree)</span>
          </button>
        </div>
      )}
    </div>
  );
}
