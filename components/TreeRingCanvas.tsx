'use client';

import React, { useState } from 'react';
import { KeystrokeTelemetryPoint, RingClassification } from '@/lib/dendrochronology';

interface TreeRingCanvasProps {
  telemetry: KeystrokeTelemetryPoint[];
  activeIndex: number;
  onSelectRing: (index: number) => void;
  compact?: boolean;
}

export default function TreeRingCanvas({
  telemetry,
  activeIndex,
  onSelectRing,
  compact = false,
}: TreeRingCanvasProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const size = compact ? 220 : 280;
  const center = size / 2;
  const maxRadius = center - 18;
  const minRadius = 18;

  const count = Math.max(1, telemetry.length);
  const ringStep = (maxRadius - minRadius) / count;

  const getRingStyling = (type: RingClassification, isActive: boolean, isHovered: boolean) => {
    switch (type) {
      case 'clear_growth':
        return {
          stroke: isHovered || isActive ? '#34d399' : '#10b981',
          width: Math.max(8, ringStep * 0.9),
          opacity: isActive ? 1 : 0.9,
          glow: 'rgba(52, 211, 153, 0.6)',
          dash: 'none',
        };
      case 'drought_thrashing':
        return {
          stroke: isHovered || isActive ? '#ef4444' : '#78350f',
          width: Math.max(2.5, ringStep * 0.35),
          opacity: 0.95,
          glow: 'rgba(239, 68, 68, 0.5)',
          dash: '4, 2',
        };
      case 'burst_exploration':
        return {
          stroke: isHovered || isActive ? '#fbbf24' : '#d97706',
          width: Math.max(5, ringStep * 0.65),
          opacity: 0.85,
          glow: 'rgba(245, 158, 11, 0.4)',
          dash: 'none',
        };
      case 'hint_scaffold':
        return {
          stroke: isHovered || isActive ? '#a5b4fc' : '#6366f1',
          width: Math.max(6, ringStep * 0.75),
          opacity: 0.9,
          glow: 'rgba(99, 102, 241, 0.4)',
          dash: 'none',
        };
      case 'idle_pause':
      default:
        return {
          stroke: isHovered || isActive ? '#d4d4d8' : '#52525b',
          width: Math.max(2, ringStep * 0.3),
          opacity: 0.6,
          glow: 'none',
          dash: '2, 3',
        };
    }
  };

  const activePoint = telemetry[hoveredIndex ?? activeIndex] || telemetry[telemetry.length - 1];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(30, 20, 15, 0.95), rgba(12, 10, 8, 0.98))',
        borderRadius: '12px',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        padding: compact ? '10px' : '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)',
      }}
    >
      {/* Wood Cross-Section Header */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1.1rem' }}>🪵</span>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fde68a' }}>
              Dendrochronology Rings
            </div>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>
              Time-Lapse Tree Trunk Cross-Section ({telemetry.length} growth layers)
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            fontWeight: 600,
          }}
        >
          Ring #{activeIndex + 1} Active
        </span>
      </div>

      {/* SVG Tree Trunk Cross-Section */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ cursor: 'pointer', overflow: 'visible' }}
      >
        <defs>
          {/* Wood Bark Radial Gradient */}
          <radialGradient id="barkOuter" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="#2b1408" />
            <stop offset="93%" stopColor="#1c0b04" />
            <stop offset="100%" stopColor="#0d0502" />
          </radialGradient>

          {/* Heartwood Flesh Gradient */}
          <radialGradient id="heartwood" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5c2e17" />
            <stop offset="40%" stopColor="#431f0e" />
            <stop offset="85%" stopColor="#2e1408" />
            <stop offset="100%" stopColor="#1a0a03" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Bark Rim with Bark Cracks */}
        <circle
          cx={center}
          cy={center}
          r={center - 4}
          fill="url(#barkOuter)"
          stroke="#522511"
          strokeWidth="6"
          strokeDasharray="18 4 12 3 24 5"
        />

        {/* Heartwood Disk */}
        <circle
          cx={center}
          cy={center}
          r={maxRadius + 4}
          fill="url(#heartwood)"
          stroke="rgba(0, 0, 0, 0.6)"
          strokeWidth="2"
        />

        {/* Concentric Annual Growth Rings */}
        {telemetry.map((point, idx) => {
          const radius = minRadius + idx * ringStep;
          const isActive = idx === activeIndex;
          const isHovered = idx === hoveredIndex;
          const styling = getRingStyling(point.ringType, isActive, isHovered);

          // Add slight organic imperfection/wobble so rings look like genuine wood
          const wobble = (idx % 2 === 0 ? 0.8 : -0.8);

          return (
            <g
              key={idx}
              onClick={() => onSelectRing(idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hit area for easy clicking */}
              <circle
                cx={center}
                cy={center}
                r={radius + wobble}
                fill="none"
                stroke="transparent"
                strokeWidth={Math.max(12, ringStep)}
              />

              {/* Visible Concentric Ring */}
              <circle
                cx={center}
                cy={center}
                r={radius + wobble}
                fill="none"
                stroke={styling.stroke}
                strokeWidth={styling.width}
                strokeDasharray={styling.dash}
                opacity={styling.opacity}
                filter={isActive || isHovered ? 'url(#ringGlow)' : undefined}
                style={{
                  transition: 'all 0.25s ease',
                }}
              />

              {/* Compiler Exception Knots / Nodes for Drought / Thrashing Slices */}
              {point.ringType === 'drought_thrashing' && (
                <>
                  <circle
                    cx={center + (radius + wobble) * Math.cos((idx * 1.3) + 0.5)}
                    cy={center + (radius + wobble) * Math.sin((idx * 1.3) + 0.5)}
                    r="4"
                    fill="#ef4444"
                    stroke="#450a0a"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={center + (radius + wobble) * Math.cos((idx * 1.3) + 3.2)}
                    cy={center + (radius + wobble) * Math.sin((idx * 1.3) + 3.2)}
                    r="3"
                    fill="#f87171"
                    stroke="#450a0a"
                    strokeWidth="1"
                  />
                </>
              )}

              {/* Active Ring Cursor Pulse */}
              {isActive && (
                <circle
                  cx={center}
                  cy={center}
                  r={radius + wobble + styling.width / 2 + 2}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  opacity="0.9"
                />
              )}
            </g>
          );
        })}

        {/* Tree Pith Core (Center Initial Seed) */}
        <circle
          cx={center}
          cy={center}
          r={minRadius - 4}
          fill="#ca8a04"
          stroke="#fef08a"
          strokeWidth="2"
        />
        <text
          x={center}
          y={center + 3}
          textAnchor="middle"
          fontSize="9"
          fill="#451a03"
          fontWeight="800"
        >
          🌱
        </text>
      </svg>

      {/* Ring Legend & Selected Ring Details */}
      <div
        style={{
          width: '100%',
          marginTop: '10px',
          background: 'rgba(0, 0, 0, 0.45)',
          borderRadius: '8px',
          padding: '8px 10px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background:
                  activePoint.ringType === 'clear_growth'
                    ? '#10b981'
                    : activePoint.ringType === 'drought_thrashing'
                    ? '#ef4444'
                    : activePoint.ringType === 'hint_scaffold'
                    ? '#818cf8'
                    : '#fbbf24',
              }}
            />
            <strong style={{ fontSize: '0.78rem', color: '#f3f4f6' }}>
              Ring #{hoveredIndex !== null ? hoveredIndex + 1 : activeIndex + 1}: {activePoint.label}
            </strong>
          </div>

          <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
            {activePoint.diffSummary || `${activePoint.deltaLength} chars`}
          </span>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: '4px 0 0', lineHeight: 1.4 }}>
          {activePoint.detail}
        </p>

        {/* Micro Visual Legend */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '8px',
            paddingTop: '6px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.68rem',
            color: '#9ca3af',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '4px', background: '#10b981', borderRadius: '2px' }} />
            <span>Wide Green = Clear Growth</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '2px', background: '#ef4444', borderTop: '2px dotted #ef4444' }} />
            <span>Thin Dark + Node = Drought / Thrashing (&lt;45s)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
