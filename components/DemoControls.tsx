'use client';

import React, { useState } from 'react';
import { TreeState, BugType, ParasiteType } from '@/lib/treeEngine';

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
          <span style={{ fontSize: '1.1rem' }}>⏱️</span>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
              Slide 4: 75-Second Faculty Demo Plan
            </span>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Quick triggers for live presentation viva evaluation
            </div>
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {isOpen ? '▲ Hide' : '▼ Expand'}
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
          {/* Step 1: Slide 4 */}
          <button
            onClick={() => {
              const newState: TreeState = {
                hp: 100,
                xp: 720,
                activeBugs: [],
                streakDays: 5,
              };
              onSetDemoState(
                newState,
                'Demo Step 1: Student solves loop challenge cleanly → Tree flourishes (+20 XP, +10 HP healed)'
              );
            }}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '0.75rem',
              textAlign: 'left',
              borderColor: 'rgba(52, 211, 153, 0.35)',
              color: '#34d399',
            }}
          >
            <span>1️⃣</span>
            <span>Step 1: Solve Loop Puzzle → Tree Flourishes</span>
          </button>

          {/* Step 2: Slide 4 */}
          <button
            onClick={() => {
              const newState: TreeState = {
                hp: 55,
                xp: 320,
                activeBugs: [BugType.BOUNDARY_BEETLE],
                streakDays: 3,
              };
              onSetDemoState(
                newState,
                'Demo Step 2: Student triggers off-by-one loop bug → Boundary Beetle 🪲 attaches to branch (-15 HP)'
              );
            }}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '0.75rem',
              textAlign: 'left',
              borderColor: 'rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              background: 'rgba(239, 68, 68, 0.08)',
            }}
          >
            <span>2️⃣</span>
            <span>Step 2: Trigger Off-by-One Bug → Visual Parasite 🪲 Appears</span>
          </button>

          {/* Step 3: Slide 4 */}
          <button
            onClick={() => {
              const newState: TreeState = {
                hp: 95,
                xp: 400,
                activeBugs: [],
                streakDays: 4,
              };
              onSetDemoState(
                newState,
                'Demo Step 3: AI Socratic hint initiates recovery mission → Student clears boundary bug → Parasite cured!'
              );
            }}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '0.75rem',
              textAlign: 'left',
              borderColor: 'rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
              background: 'rgba(245, 158, 11, 0.08)',
            }}
          >
            <span>3️⃣</span>
            <span>Step 3: AI Socratic Recovery → Parasite Cleared & Tree Restored</span>
          </button>
          {/* Visual Bug Parasite Direct Attachment Triggers */}
          <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
              🐛 AST NODE VISUAL PARASITES (Direct Trigger & Socratic Diagnosis):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
              <button
                onClick={() => {
                  const newState: TreeState = {
                    hp: 65,
                    xp: 350,
                    activeBugs: [BugType.BOUNDARY_BEETLE],
                    activeParasites: [ParasiteType.CATERPILLAR],
                    selectedParasite: ParasiteType.CATERPILLAR,
                    streakDays: 3,
                  };
                  onSetDemoState(
                    newState,
                    'Simulated: IndexError / Loop Boundary → Stem Caterpillar 🐛 attached to Branch Tip (-15 HP)'
                  );
                }}
                className="btn-secondary"
                style={{
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                  fontSize: '0.72rem',
                  textAlign: 'left',
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.1)',
                }}
              >
                <span>🐛</span>
                <span>Branch Tip: Stem Caterpillar (IndexError / Loop Boundary)</span>
              </button>

              <button
                onClick={() => {
                  const newState: TreeState = {
                    hp: 65,
                    xp: 350,
                    activeBugs: [BugType.BOUNDARY_BEETLE],
                    activeParasites: [ParasiteType.FUNGAL_BLIGHT],
                    selectedParasite: ParasiteType.FUNGAL_BLIGHT,
                    streakDays: 3,
                  };
                  onSetDemoState(
                    newState,
                    'Simulated: ZeroDivisionError / TypeError → Fungal Blight 🍄 attached to Node Junction (-15 HP)'
                  );
                }}
                className="btn-secondary"
                style={{
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                  fontSize: '0.72rem',
                  textAlign: 'left',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  background: 'rgba(239, 68, 68, 0.1)',
                }}
              >
                <span>🍄</span>
                <span>Node Junction: Fungal Blight (ZeroDivisionError / TypeError)</span>
              </button>

              <button
                onClick={() => {
                  const newState: TreeState = {
                    hp: 50,
                    xp: 350,
                    activeBugs: [BugType.LOOP_WEED],
                    activeParasites: [ParasiteType.STRANGLER_VINE],
                    selectedParasite: ParasiteType.STRANGLER_VINE,
                    streakDays: 3,
                  };
                  onSetDemoState(
                    newState,
                    'Simulated: Infinite Loop / Timeout >2s → Strangler Vine 🌿 wrapping Central Trunk (-15 HP)'
                  );
                }}
                className="btn-secondary"
                style={{
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                  fontSize: '0.72rem',
                  textAlign: 'left',
                  borderColor: 'rgba(132, 204, 22, 0.4)',
                  color: '#bef264',
                  background: 'rgba(132, 204, 22, 0.1)',
                }}
              >
                <span>🌿</span>
                <span>Central Trunk: Strangler Vine (Infinite Loop / Timeout &gt;2s)</span>
              </button>
            </div>
          </div>

          {/* Simulated Multi-Campus Classroom Leaderboard Preview (Slide 4) */}
          <div
            style={{
              marginTop: '6px',
              padding: '8px 10px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
              🏫 SIMULATED: Multi-Campus Classroom Leaderboard (Slide 4)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.7rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>🥇 SPIT Mumbai (FE Div A)</span>
                <strong style={{ color: '#34d399' }}>94.2% Lab Clearance</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>🥈 VJTI Mumbai (FE Div C)</span>
                <strong style={{ color: '#34d399' }}>91.8% Lab Clearance</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>🥉 COEP Pune (FE Div B)</span>
                <strong style={{ color: '#34d399' }}>88.5% Lab Clearance</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

