'use client';

import React from 'react';
import { TreeStage, BugType, TreeState } from '@/lib/treeEngine';

interface TreeCanvasProps {
  treeState: TreeState;
  treeStage: TreeStage;
}

export default function TreeCanvas({ treeState, treeStage }: TreeCanvasProps) {
  const { hp, xp, activeBugs, streakDays } = treeState;

  // HP Color calculation (Green: >= 75, Yellow/Amber: 45-74, Crimson: < 45)
  const getHpColor = (val: number): { bar: string; glow: string; text: string } => {
    if (val >= 75) {
      return {
        bar: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%)',
        glow: 'rgba(16, 185, 129, 0.4)',
        text: '#34d399',
      };
    }
    if (val >= 45) {
      return {
        bar: 'linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
        glow: 'rgba(245, 158, 11, 0.4)',
        text: '#fbbf24',
      };
    }
    return {
      bar: 'linear-gradient(90deg, #b91c1c 0%, #ef4444 50%, #f87171 100%)',
      glow: 'rgba(239, 68, 68, 0.4)',
      text: '#f87171',
    };
  };

  const hpColors = getHpColor(hp);

  // Stage progress thresholds
  const getStageInfo = () => {
    switch (treeStage) {
      case TreeStage.SEED:
        return { name: 'Seed Phase', range: '0 - 99 XP', nextGoal: 100, currentBase: 0 };
      case TreeStage.SPROUT:
        return { name: 'Sprout Phase', range: '100 - 299 XP', nextGoal: 300, currentBase: 100 };
      case TreeStage.SAPLING:
        return { name: 'Sapling Phase', range: '300 - 699 XP', nextGoal: 700, currentBase: 300 };
      case TreeStage.FLOURISHING_TREE:
        return { name: 'Flourishing Tree', range: '700+ XP', nextGoal: 1000, currentBase: 700 };
    }
  };

  const stageInfo = getStageInfo();
  const xpPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(((xp - stageInfo.currentBase) / (stageInfo.nextGoal - stageInfo.currentBase)) * 100)
    )
  );

  const hasBug = (b: BugType) => activeBugs.includes(b);

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Status Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🌱</span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#f3f4f6' }}>
              Living Code Tree
            </h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
            {stageInfo.name} ({xp} XP)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#fbbf24',
            }}
          >
            <span>🔥</span>
            <span>{streakDays} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Health Bar with Smooth Color Shifting */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
          <span style={{ color: '#9ca3af', fontWeight: 500 }}>Botanical Vitality (HP)</span>
          <span style={{ fontWeight: 700, color: hpColors.text }}>
            {hp} / 100 HP {hp <= 20 && '(Hard Floor Reached)'}
          </span>
        </div>
        <div
          style={{
            height: '10px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '999px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${hp}%`,
              background: hpColors.bar,
              boxShadow: `0 0 12px ${hpColors.glow}`,
              borderRadius: '999px',
              transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.8s ease',
            }}
          />
        </div>
      </div>

      {/* Tree Visualization Canvas/SVG */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '280px',
          background: 'radial-gradient(ellipse at 50% 80%, rgba(16, 185, 129, 0.12), rgba(0, 0, 0, 0.45))',
          borderRadius: '12px',
          border: '1px solid rgba(52, 211, 153, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg
          viewBox="0 0 400 300"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          className="animate-sway"
        >
          <defs>
            {/* Trunk Gradient */}
            <linearGradient id="barkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#452719" />
              <stop offset="50%" stopColor="#6e3d23" />
              <stop offset="100%" stopColor="#3d2114" />
            </linearGradient>

            {/* Lush Foliage Gradient */}
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Glowing Soil */}
            <radialGradient id="soilGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>

            {/* Blossom Gradient */}
            <linearGradient id="blossomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>

          {/* Glowing Ground Base */}
          <ellipse cx="200" cy="270" rx="140" ry="25" fill="url(#soilGlow)" />
          <ellipse cx="200" cy="270" rx="90" ry="14" fill="#1b2a21" stroke="rgba(52, 211, 153, 0.3)" strokeWidth="1.5" />

          {/* STAGE 1: SEED */}
          {treeStage === TreeStage.SEED && (
            <g transform="translate(0, 10)">
              {/* Seed Pod */}
              <ellipse cx="200" cy="262" rx="14" ry="9" fill="#854d0e" stroke="#ca8a04" strokeWidth="1.5" />
              {/* Sprouting crack */}
              <path d="M 196 260 Q 200 256 202 263" stroke="#facc15" strokeWidth="1.5" fill="none" />
              {/* Little nascent green cotyledon */}
              <path
                d="M 200 256 Q 198 245 204 238 Q 208 244 200 256 Z"
                fill="url(#leafGrad)"
                stroke="#059669"
                strokeWidth="1"
              />
              <circle cx="204" cy="238" r="3" fill="#a7f3d0" />
            </g>
          )}

          {/* STAGE 2: SPROUT */}
          {treeStage === TreeStage.SPROUT && (
            <g>
              {/* Thin flexible stem */}
              <path
                d="M 200 270 Q 196 220 200 185"
                fill="none"
                stroke="url(#leafGrad)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Left Leaf */}
              <path
                d="M 198 220 C 170 215 160 190 175 180 C 190 190 198 210 198 220 Z"
                fill="url(#leafGrad)"
                stroke="#047857"
                strokeWidth="1.5"
              />
              {/* Right Leaf */}
              <path
                d="M 200 200 C 230 195 240 170 225 160 C 210 170 200 190 200 200 Z"
                fill="url(#leafGrad)"
                stroke="#047857"
                strokeWidth="1.5"
              />
              {/* Terminal Bud */}
              <circle cx="200" cy="183" r="4" fill="#a7f3d0" />
            </g>
          )}

          {/* STAGE 3: SAPLING */}
          {treeStage === TreeStage.SAPLING && (
            <g>
              {/* Branching wooden trunk */}
              <path
                d="M 193 270 L 196 210 Q 190 180 160 145 Q 185 165 198 190 Q 205 165 240 135 Q 215 165 204 210 L 207 270 Z"
                fill="url(#barkGrad)"
                stroke="#29160d"
                strokeWidth="1"
              />
              {/* Central Branch */}
              <path
                d="M 198 190 Q 200 150 200 120"
                fill="none"
                stroke="url(#barkGrad)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Left Foliage Clustered Nodes */}
              <circle cx="155" cy="140" r="26" fill="url(#leafGrad)" opacity="0.9" />
              <circle cx="140" cy="130" r="20" fill="#059669" opacity="0.85" />
              {/* Right Foliage Clustered Nodes */}
              <circle cx="245" cy="130" r="28" fill="url(#leafGrad)" opacity="0.9" />
              <circle cx="260" cy="120" r="19" fill="#059669" opacity="0.85" />
              {/* Top Central Crown */}
              <circle cx="200" cy="115" r="32" fill="url(#leafGrad)" />
              <circle cx="190" cy="100" r="22" fill="#34d399" opacity="0.6" />
            </g>
          )}

          {/* STAGE 4: FLOURISHING TREE */}
          {treeStage === TreeStage.FLOURISHING_TREE && (
            <g>
              {/* Sturdy Mature Trunk */}
              <path
                d="M 188 270 Q 194 215 185 180 Q 165 150 125 115 Q 160 135 185 165 Q 196 140 198 90 Q 204 140 215 165 Q 240 135 275 115 Q 235 150 215 180 Q 206 215 212 270 Z"
                fill="url(#barkGrad)"
                stroke="#1f0f08"
                strokeWidth="1.5"
              />
              {/* Expansive Foliage Canopy */}
              <circle cx="125" cy="110" r="36" fill="url(#leafGrad)" opacity="0.9" />
              <circle cx="275" cy="110" r="36" fill="url(#leafGrad)" opacity="0.9" />
              <circle cx="160" cy="85" r="42" fill="#059669" opacity="0.9" />
              <circle cx="240" cy="85" r="42" fill="#059669" opacity="0.9" />
              <circle cx="200" cy="70" r="48" fill="url(#leafGrad)" />
              <circle cx="200" cy="55" r="34" fill="#34d399" opacity="0.75" />

              {/* Radiant Blossoms */}
              <g transform="translate(130, 100)">
                <circle cx="0" cy="0" r="6" fill="url(#blossomGrad)" />
                <circle cx="0" cy="0" r="2" fill="#fef08a" />
              </g>
              <g transform="translate(265, 95)">
                <circle cx="0" cy="0" r="7" fill="url(#blossomGrad)" />
                <circle cx="0" cy="0" r="2.5" fill="#fef08a" />
              </g>
              <g transform="translate(200, 60)">
                <circle cx="0" cy="0" r="8" fill="url(#blossomGrad)" />
                <circle cx="0" cy="0" r="3" fill="#fef08a" />
              </g>
              <g transform="translate(170, 75)">
                <circle cx="0" cy="0" r="5.5" fill="url(#blossomGrad)" />
                <circle cx="0" cy="0" r="2" fill="#fef08a" />
              </g>
              <g transform="translate(230, 80)">
                <circle cx="0" cy="0" r="6" fill="url(#blossomGrad)" />
                <circle cx="0" cy="0" r="2" fill="#fef08a" />
              </g>
            </g>
          )}

          {/* BOTANICAL PARASITE DAMAGE & OVERLAYS */}
          {/* 1. LOOP_WEED (Thorny wrapping tendrils) */}
          {hasBug(BugType.LOOP_WEED) && (
            <g stroke="#84cc16" strokeWidth="2.5" fill="none" strokeDasharray="3 2">
              <path d="M 185 265 Q 205 255 195 240 Q 185 225 208 215" />
              <path d="M 215 260 Q 192 245 205 230 Q 215 215 198 200" />
              {/* Thorns */}
              <circle cx="198" cy="245" r="2" fill="#4d7c0f" />
              <circle cx="204" cy="225" r="2" fill="#4d7c0f" />
            </g>
          )}

          {/* 2. BOUNDARY_BEETLE on lower branch */}
          {hasBug(BugType.BOUNDARY_BEETLE) && (
            <g transform="translate(210, 215)" className="animate-crawl">
              <circle cx="0" cy="0" r="10" fill="rgba(239, 68, 68, 0.25)" />
              <text x="-7" y="5" fontSize="14">🪲</text>
            </g>
          )}

          {/* 3. STRUCTURE_CATERPILLAR creeping on branch */}
          {hasBug(BugType.STRUCTURE_CATERPILLAR) && (
            <g transform="translate(170, 195)" className="animate-crawl">
              <circle cx="0" cy="0" r="10" fill="rgba(245, 158, 11, 0.25)" />
              <text x="-7" y="5" fontSize="14">🐛</text>
            </g>
          )}

          {/* 4. SCOPE_SLUG on trunk */}
          {hasBug(BugType.SCOPE_SLUG) && (
            <g transform="translate(192, 235)" className="animate-crawl">
              <ellipse cx="0" cy="0" rx="10" ry="7" fill="rgba(168, 85, 247, 0.25)" />
              <text x="-7" y="5" fontSize="14">🐌</text>
            </g>
          )}

          {/* 5. LOOP_WEED icon at base */}
          {hasBug(BugType.LOOP_WEED) && (
            <g transform="translate(200, 260)">
              <text x="-7" y="5" fontSize="14">🌿</text>
            </g>
          )}
        </svg>

        {/* Ambient Spore Particles */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.4)',
            background: 'rgba(0,0,0,0.5)',
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          Stage {treeStage}
        </div>
      </div>

      {/* Dynamic Parasite Diagnostics & Objective Badges */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#9ca3af' }}>
            Active Parasites ({activeBugs.length})
          </span>
          {activeBugs.length === 0 && (
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              ✓ Canopy Healthy & Bug-Free
            </span>
          )}
        </div>

        {activeBugs.length === 0 ? (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>🛡️</span>
            <span>No parasitic infestations. All botanical tissues intact (+10 HP on pass).</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeBugs.map((bug, idx) => {
              const bugConfig = {
                [BugType.BOUNDARY_BEETLE]: {
                  emoji: '🪲',
                  name: 'Boundary Beetle',
                  cause: 'IndexError / ZeroDivisionError',
                  advice: 'Guard collection indices or division denominators',
                  color: '#ef4444',
                  bg: 'rgba(239, 68, 68, 0.12)',
                  border: 'rgba(239, 68, 68, 0.3)',
                },
                [BugType.STRUCTURE_CATERPILLAR]: {
                  emoji: '🐛',
                  name: 'Structure Caterpillar',
                  cause: 'SyntaxError / IndentationError',
                  advice: 'Verify matching indentation and colons',
                  color: '#f59e0b',
                  bg: 'rgba(245, 158, 11, 0.12)',
                  border: 'rgba(245, 158, 11, 0.3)',
                },
                [BugType.SCOPE_SLUG]: {
                  emoji: '🐌',
                  name: 'Scope Slug',
                  cause: 'NameError / AttributeError',
                  advice: 'Initialize variables before referencing them',
                  color: '#a855f7',
                  bg: 'rgba(168, 85, 247, 0.12)',
                  border: 'rgba(168, 85, 247, 0.3)',
                },
                [BugType.LOOP_WEED]: {
                  emoji: '🌿',
                  name: 'Loop Weed',
                  cause: 'TimeoutError / Infinite Loop',
                  advice: 'Ensure loop counter advances toward termination',
                  color: '#84cc16',
                  bg: 'rgba(132, 204, 22, 0.12)',
                  border: 'rgba(132, 204, 22, 0.3)',
                },
              }[bug];

              return (
                <div
                  key={`${bug}-${idx}`}
                  style={{
                    padding: '8px 12px',
                    background: bugConfig.bg,
                    border: `1px solid ${bugConfig.border}`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{bugConfig.emoji}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: bugConfig.color }}>
                        {bugConfig.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{bugConfig.cause}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: bugConfig.color,
                      fontWeight: 600,
                      background: 'rgba(0,0,0,0.3)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    Solve to Eradicate
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Growth Stage Progress */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>
          <span>Next Growth Stage Progress</span>
          <span>{xpPercent}%</span>
        </div>
        <div
          style={{
            height: '6px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${xpPercent}%`,
              background: 'linear-gradient(90deg, #10b981, #6ee7b7)',
              borderRadius: '999px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
