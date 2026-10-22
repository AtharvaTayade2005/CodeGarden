'use client';

import React, { useState, useEffect } from 'react';
import {
  TreeStage,
  BugType,
  TreeState,
  ParasiteType,
  PARASITE_DEFINITIONS,
  ParasiteLocation,
} from '@/lib/treeEngine';
import { KeystrokeTelemetryPoint } from '@/lib/dendrochronology';
import TreeRingCanvas from './TreeRingCanvas';

interface TreeCanvasProps {
  treeState: TreeState;
  treeStage: TreeStage;
  telemetry?: KeystrokeTelemetryPoint[];
  activeRingIndex?: number;
  onSelectRing?: (index: number) => void;
  activeParasite?: ParasiteType | null;
  socraticPrompt?: string | null;
  onSelectParasite?: (parasite: ParasiteType | null) => void;
}

export default function TreeCanvas({
  treeState,
  treeStage,
  telemetry = [],
  activeRingIndex = 0,
  onSelectRing = () => {},
  activeParasite = null,
  socraticPrompt = null,
  onSelectParasite = () => {},
}: TreeCanvasProps) {
  const { hp, xp, activeBugs, streakDays } = treeState;
  const [activeTab, setActiveTab] = useState<'tree' | 'rings'>('tree');
  const [selectedParasite, setSelectedParasite] = useState<ParasiteType | null>(
    activeParasite || treeState.selectedParasite || (treeState.activeParasites?.[0] ?? null)
  );

  useEffect(() => {
    if (activeParasite) {
      setSelectedParasite(activeParasite);
      setActiveTab('tree');
    }
  }, [activeParasite]);

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

  const activeParasites = treeState.activeParasites ? [...treeState.activeParasites] : [];
  if (activeParasite && !activeParasites.includes(activeParasite)) {
    activeParasites.push(activeParasite);
  }
  const hasParasite = (p: ParasiteType) => activeParasites.includes(p);
  const hasBug = (b: BugType) => activeBugs.includes(b);

  // Anatomical coordinates for localized parasite attachments
  const getCaterpillarPos = () => {
    switch (treeStage) {
      case TreeStage.SEED:
        return { x: 204, y: 238 };
      case TreeStage.SPROUT:
        return { x: 225, y: 160 };
      case TreeStage.SAPLING:
        return { x: 245, y: 120 };
      case TreeStage.FLOURISHING_TREE:
        return { x: 275, y: 105 };
    }
  };

  const getFungalBlightPos = () => {
    switch (treeStage) {
      case TreeStage.SEED:
        return { x: 200, y: 256 };
      case TreeStage.SPROUT:
        return { x: 200, y: 200 };
      case TreeStage.SAPLING:
      case TreeStage.FLOURISHING_TREE:
        return { x: 198, y: 190 };
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Status Header & View Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Concentric Cross-Section Ring Icon next to tree */}
            <span
              onClick={() => setActiveTab(activeTab === 'tree' ? 'rings' : 'tree')}
              style={{
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: '6px',
                background: activeTab === 'rings' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              }}
              title="Click to toggle Dendrochronology Tree Rings view"
            >
              {activeTab === 'tree' ? '🌱' : '🪵'}
            </span>

            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#f3f4f6' }}>
              {activeTab === 'tree' ? 'Living Code Tree' : 'Dendrochronology Rings'}
            </h2>

            {/* Mini concentric ring indicator icon */}
            <button
              onClick={() => setActiveTab(activeTab === 'tree' ? 'rings' : 'tree')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '999px',
                background: activeTab === 'rings' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(52, 211, 153, 0.1)',
                border: `1px solid ${activeTab === 'rings' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(52, 211, 153, 0.3)'}`,
                color: activeTab === 'rings' ? '#fbbf24' : '#34d399',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Toggle between Tree Canvas and Dendrochronology Cross-Section"
            >
              <span>🪵</span>
              <span>{telemetry.length} Rings</span>
            </button>
          </div>

          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
            {stageInfo.name} ({xp} XP)
          </span>
        </div>

        {/* View Switcher Tabs & Streak Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '8px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              onClick={() => setActiveTab('tree')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'tree' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: activeTab === 'tree' ? '#34d399' : '#9ca3af',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🌳 Tree View
            </button>
            <button
              onClick={() => setActiveTab('rings')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'rings' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                color: activeTab === 'rings' ? '#fbbf24' : '#9ca3af',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🪵 Tree Rings
            </button>
          </div>

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
            <span>{streakDays}d Streak</span>
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

      {/* Tree Visualization Canvas/SVG or Dendrochronology Tree Rings */}
      {activeTab === 'rings' ? (
        <TreeRingCanvas
          telemetry={telemetry}
          activeIndex={activeRingIndex}
          onSelectRing={onSelectRing}
        />
      ) : (
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

          {/* BOTANICAL AST PARASITE DAMAGE & LOCALIZED OVERLAYS */}

          {/* 1. ParasiteType.CATERPILLAR on Branch Tip */}
          {hasParasite(ParasiteType.CATERPILLAR) && (() => {
            const pos = getCaterpillarPos();
            const isSelected = selectedParasite === ParasiteType.CATERPILLAR;
            return (
              <g
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedParasite(ParasiteType.CATERPILLAR);
                  onSelectParasite?.(ParasiteType.CATERPILLAR);
                }}
                style={{ cursor: 'pointer' }}
                className="animate-crawl"
              >
                {/* Pulsing Alert Ring on Branch Tip */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? '18' : '14'}
                  fill="rgba(245, 158, 11, 0.25)"
                  stroke="#f59e0b"
                  strokeWidth={isSelected ? '2' : '1.5'}
                  strokeDasharray="3 3"
                >
                  <animate attributeName="r" values="13;17;13" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Nibbled/withering brown leaf segment */}
                <path d="M -8 4 Q 0 8 8 2 Q 4 -4 -6 -2 Z" fill="#78350f" opacity="0.85" />

                {/* High-res segmented caterpillar sprite attached to branch tip */}
                <circle cx="-6" cy="1" r="3.5" fill="#f59e0b" />
                <circle cx="-2" cy="-1" r="4" fill="#fbbf24" />
                <circle cx="3" cy="0" r="4.5" fill="#facc15" />
                {/* Caterpillar Head */}
                <circle cx="8" cy="-2" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
                {/* Eyes */}
                <circle cx="9" cy="-3.5" r="1" fill="#1e293b" />
                <circle cx="7" cy="-3.5" r="0.8" fill="#1e293b" />
                {/* Antennae */}
                <path d="M 9 -6 L 11 -9 M 7 -6 L 6 -9" stroke="#b45309" strokeWidth="1" strokeLinecap="round" />

                {/* Interactive Click-to-Diagnose pill tag */}
                <g transform="translate(0, -18)">
                  <rect
                    x="-42"
                    y="-9"
                    width="84"
                    height="16"
                    rx="4"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke="#f59e0b"
                    strokeWidth="1"
                  />
                  <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fef08a">
                    🐛 Click Branch Tip
                  </text>
                </g>
              </g>
            );
          })()}

          {/* 2. ParasiteType.FUNGAL_BLIGHT at Node Junction */}
          {hasParasite(ParasiteType.FUNGAL_BLIGHT) && (() => {
            const pos = getFungalBlightPos();
            const isSelected = selectedParasite === ParasiteType.FUNGAL_BLIGHT;
            return (
              <g
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedParasite(ParasiteType.FUNGAL_BLIGHT);
                  onSelectParasite?.(ParasiteType.FUNGAL_BLIGHT);
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Necrotic junction patch */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={isSelected ? '20' : '16'}
                  ry="10"
                  fill="rgba(159, 18, 57, 0.6)"
                  stroke="#f43f5e"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />

                {/* Clustered Bioluminescent Fungal Caps */}
                {/* Left Cap */}
                <path d="M -9 4 Q -5 -7 0 3 Z" fill="#e11d48" stroke="#fecdd3" strokeWidth="0.8" />
                <circle cx="-4" cy="-1" r="1" fill="#fff" />
                {/* Center High Cap */}
                <path d="M -4 2 Q 2 -11 8 3 Z" fill="#be123c" stroke="#f43f5e" strokeWidth="0.8" />
                <circle cx="2" cy="-4" r="1.2" fill="#ffe4e6" />
                {/* Right Shelf Fungus */}
                <path d="M 4 5 C 11 3 13 8 5 9 Z" fill="#9333ea" />

                {/* Spore particles floating from node junction */}
                <circle cx="-6" cy="-8" r="1.5" fill="#f43f5e">
                  <animate attributeName="cy" values="-8;-16;-8" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="5" cy="-10" r="1.5" fill="#c084fc">
                  <animate attributeName="cy" values="-10;-18;-10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Interactive Click-to-Diagnose pill tag */}
                <g transform="translate(0, -18)">
                  <rect
                    x="-46"
                    y="-9"
                    width="92"
                    height="16"
                    rx="4"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke="#f43f5e"
                    strokeWidth="1"
                  />
                  <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fda4af">
                    🍄 Click Junction
                  </text>
                </g>
              </g>
            );
          })()}

          {/* 3. ParasiteType.STRANGLER_VINE wrapping Central Trunk */}
          {hasParasite(ParasiteType.STRANGLER_VINE) && (() => {
            const isSelected = selectedParasite === ParasiteType.STRANGLER_VINE;
            return (
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedParasite(ParasiteType.STRANGLER_VINE);
                  onSelectParasite?.(ParasiteType.STRANGLER_VINE);
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Heavy thorny constricting vine coils wrapping around the central trunk */}
                <g stroke="#84cc16" strokeWidth={isSelected ? '4' : '3'} fill="none" strokeLinecap="round">
                  <path d="M 186 265 Q 200 252 214 262" stroke="#4d7c0f" />
                  <path d="M 215 248 Q 198 238 185 248" stroke="#65a30d" />
                  <path d="M 186 232 Q 200 220 214 230" stroke="#84cc16" />
                  <path d="M 186 265 Q 205 248 185 232" stroke="#a3e635" strokeWidth="2.5" />
                  <path d="M 214 262 Q 195 244 214 230" stroke="#4d7c0f" strokeWidth="2.5" />
                </g>
                {/* Thorns */}
                <polygon points="183,250 186,247 186,253" fill="#365314" />
                <polygon points="217,245 214,242 214,248" fill="#365314" />
                <polygon points="184,233 187,230 187,236" fill="#365314" />
                <polygon points="216,260 213,257 213,263" fill="#365314" />

                {/* Glowing strangler heart on the central trunk */}
                <g transform="translate(200, 240)">
                  <circle cx="0" cy="0" r={isSelected ? '12' : '9'} fill="rgba(132, 204, 22, 0.35)" stroke="#84cc16" strokeWidth="1.5">
                    <animate attributeName="r" values="9;12;9" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <text x="-6" y="5" fontSize="12">🌿</text>
                  {/* Interactive Click-to-Diagnose pill tag */}
                  <g transform="translate(0, 18)">
                    <rect
                      x="-42"
                      y="-8"
                      width="84"
                      height="16"
                      rx="4"
                      fill="rgba(15, 23, 42, 0.9)"
                      stroke="#84cc16"
                      strokeWidth="1"
                    />
                    <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#bef264">
                      🌿 Click Trunk
                    </text>
                  </g>
                </g>
              </g>
            );
          })()}

          {/* Legacy Bug Fallbacks if not already covered by Parasite */}
          {!hasParasite(ParasiteType.STRANGLER_VINE) && hasBug(BugType.LOOP_WEED) && (
            <g stroke="#84cc16" strokeWidth="2.5" fill="none" strokeDasharray="3 2">
              <path d="M 185 265 Q 205 255 195 240 Q 185 225 208 215" />
              <path d="M 215 260 Q 192 245 205 230 Q 215 215 198 200" />
            </g>
          )}

          {!hasParasite(ParasiteType.CATERPILLAR) && !hasParasite(ParasiteType.FUNGAL_BLIGHT) && hasBug(BugType.BOUNDARY_BEETLE) && (
            <g transform="translate(210, 215)" className="animate-crawl">
              <circle cx="0" cy="0" r="10" fill="rgba(239, 68, 68, 0.25)" />
              <text x="-7" y="5" fontSize="14">🪲</text>
            </g>
          )}

          {!hasParasite(ParasiteType.CATERPILLAR) && hasBug(BugType.STRUCTURE_CATERPILLAR) && (
            <g transform="translate(170, 195)" className="animate-crawl">
              <circle cx="0" cy="0" r="10" fill="rgba(245, 158, 11, 0.25)" />
              <text x="-7" y="5" fontSize="14">🐛</text>
            </g>
          )}

          {hasBug(BugType.SCOPE_SLUG) && (
            <g transform="translate(192, 235)" className="animate-crawl">
              <ellipse cx="0" cy="0" rx="10" ry="7" fill="rgba(168, 85, 247, 0.25)" />
              <text x="-7" y="5" fontSize="14">🐌</text>
            </g>
          )}
        </svg>

        {/* CLICK-TO-DIAGNOSE: In-Canvas Socratic Prompt Dialogue Card (Req 3) */}
        {selectedParasite && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              background: 'rgba(10, 15, 20, 0.94)',
              backdropFilter: 'blur(12px)',
              border: `1.5px solid ${PARASITE_DEFINITIONS[selectedParasite].color}`,
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px ${PARASITE_DEFINITIONS[selectedParasite].bg}`,
              zIndex: 30,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>{PARASITE_DEFINITIONS[selectedParasite].emoji}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: PARASITE_DEFINITIONS[selectedParasite].color }}>
                      {PARASITE_DEFINITIONS[selectedParasite].name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '1px 8px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#cbd5e1',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      AST Attachment: {PARASITE_DEFINITIONS[selectedParasite].locationLabel}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    Localized visual parasite attached to AST node
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedParasite(null);
                  onSelectParasite?.(null);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  width: '22px',
                  height: '22px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close Diagnostic"
              >
                ✕
              </button>
            </div>

            {/* Single-Sentence Socratic Prompt (Strictly no code solution) */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                borderLeft: `3px solid ${PARASITE_DEFINITIONS[selectedParasite].color}`,
                borderRadius: '0 8px 8px 0',
                padding: '8px 12px',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '2px' }}>
                Socratic Diagnostic Inquiry:
              </div>
              <p style={{ fontSize: '0.84rem', color: '#f8fafc', fontWeight: 500, lineHeight: 1.45, margin: 0 }}>
                &ldquo;{socraticPrompt || PARASITE_DEFINITIONS[selectedParasite].defaultPrompt}&rdquo;
              </p>
            </div>

            {/* Footer Notice */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#34d399' }}>
                <span>💡</span>
                <span>Reflective inquiry enabled &bull; No code solutions revealed</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedParasite(null);
                  onSelectParasite?.(null);
                }}
                style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: PARASITE_DEFINITIONS[selectedParasite].color,
                  border: 'none',
                  color: '#0f172a',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Check Code &rarr;
              </button>
            </div>
          </div>
        )}

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
    )}

      {/* Dynamic Parasite Diagnostics & Objective Badges */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#9ca3af' }}>
            Active Parasites ({activeParasites.length + activeBugs.length})
          </span>
          {activeParasites.length === 0 && activeBugs.length === 0 && (
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              ✓ Canopy Healthy & Bug-Free
            </span>
          )}
        </div>

        {activeParasites.length === 0 && activeBugs.length === 0 ? (
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
            {/* 1. Active ParasiteType Cards */}
            {activeParasites.map((parasite, idx) => {
              const def = PARASITE_DEFINITIONS[parasite];
              const isSelected = selectedParasite === parasite;

              return (
                <div
                  key={`parasite-${parasite}-${idx}`}
                  style={{
                    padding: '8px 12px',
                    background: def.bg,
                    border: `1px solid ${isSelected ? def.color : def.border}`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? `0 0 10px ${def.bg}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.25rem' }}>{def.emoji}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: def.color }}>
                          {def.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: 'rgba(0,0,0,0.4)',
                            color: '#e2e8f0',
                          }}
                        >
                          Node: {def.locationLabel}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{def.description}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedParasite(parasite);
                      setActiveTab('tree');
                      onSelectParasite?.(parasite);
                    }}
                    style={{
                      fontSize: '0.72rem',
                      color: def.color,
                      fontWeight: 600,
                      background: 'rgba(0,0,0,0.4)',
                      border: `1px solid ${def.color}`,
                      padding: '3px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Click to Diagnose
                  </button>
                </div>
              );
            })}

            {/* 2. Legacy BugType Cards (when not duplicated) */}
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
                  key={`bug-${bug}-${idx}`}
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
