'use client';

import React, { useState, useEffect } from 'react';
import { KeystrokeTelemetryPoint } from '@/lib/dendrochronology';

interface DendroTimelineSliderProps {
  telemetry: KeystrokeTelemetryPoint[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onReturnToLive: () => void;
  isLive: boolean;
}

export default function DendroTimelineSlider({
  telemetry,
  currentIndex,
  onIndexChange,
  onReturnToLive,
  isLive,
}: DendroTimelineSliderProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x

  const totalPoints = telemetry.length;
  const currentPoint = telemetry[currentIndex] || telemetry[totalPoints - 1];

  // Auto-playback loop for time-lapse demo
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentIndex >= totalPoints - 1) {
          setIsPlaying(false);
        } else {
          onIndexChange(currentIndex + 1);
        }
      }, 1200 / playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentIndex, totalPoints, playbackSpeed, onIndexChange]);


  const getStateBadge = (point: KeystrokeTelemetryPoint) => {
    switch (point.ringType) {
      case 'clear_growth':
        return {
          label: 'Clear Growth',
          emoji: '🌱',
          bg: 'rgba(16, 185, 129, 0.15)',
          border: '#10b981',
          text: '#34d399',
        };
      case 'drought_thrashing':
        return {
          label: 'Drought / Thrashing (<45s)',
          emoji: '🍂',
          bg: 'rgba(239, 68, 68, 0.15)',
          border: '#ef4444',
          text: '#f87171',
        };
      case 'burst_exploration':
        return {
          label: 'Active Typing Burst',
          emoji: '⚡',
          bg: 'rgba(245, 158, 11, 0.15)',
          border: '#f59e0b',
          text: '#fbbf24',
        };
      case 'hint_scaffold':
        return {
          label: 'Scaffolded Hint',
          emoji: '💡',
          bg: 'rgba(99, 102, 241, 0.15)',
          border: '#6366f1',
          text: '#a5b4fc',
        };
      case 'idle_pause':
      default:
        return {
          label: 'Reflective Pause',
          emoji: '💤',
          bg: 'rgba(107, 114, 128, 0.15)',
          border: '#6b7280',
          text: '#d1d5db',
        };
    }
  };

  const badge = getStateBadge(currentPoint);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '12px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: !isLive ? 'rgba(30, 27, 75, 0.4)' : 'rgba(15, 23, 20, 0.75)',
        border: !isLive ? '1px solid rgba(129, 140, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Top Controls Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Replay Mode Notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1rem' }}>⏪</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: !isLive ? '#a5b4fc' : '#e2e8f0' }}>
              Dendrochronology Replay Slider
            </span>
          </div>

          {/* Current State Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 8px',
              borderRadius: '999px',
              background: badge.bg,
              border: `1px solid ${badge.border}`,
              fontSize: '0.72rem',
              fontWeight: 600,
              color: badge.text,
            }}
          >
            <span>{badge.emoji}</span>
            <span>{badge.label}</span>
          </div>
        </div>

        {/* Action Buttons: Play/Pause, Speed, Return to Live */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-secondary"
            style={{
              padding: '4px 10px',
              fontSize: '0.72rem',
              borderColor: isPlaying ? 'rgba(239, 68, 68, 0.4)' : 'rgba(52, 211, 153, 0.4)',
              color: isPlaying ? '#f87171' : '#34d399',
            }}
            title={isPlaying ? 'Pause replay' : 'Play time-lapse trajectory'}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play Time-Lapse'}
          </button>

          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
            className="btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
            title="Toggle playback speed"
          >
            {playbackSpeed}x
          </button>

          {!isLive && (
            <button
              onClick={onReturnToLive}
              className="btn-primary"
              style={{
                padding: '4px 12px',
                fontSize: '0.72rem',
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              }}
            >
              <span>⏩ Return to Live Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Scrub Slider Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
          disabled={currentIndex <= 0}
          style={{
            background: 'transparent',
            border: 'none',
            color: currentIndex <= 0 ? '#4b5563' : '#9ca3af',
            cursor: currentIndex <= 0 ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
          }}
          title="Step backward"
        >
          ◀
        </button>

        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="range"
            min={0}
            max={totalPoints - 1}
            value={currentIndex}
            onChange={(e) => onIndexChange(parseInt(e.target.value, 10))}
            style={{
              width: '100%',
              accentColor: '#10b981',
              cursor: 'pointer',
              height: '6px',
            }}
          />
        </div>

        <button
          onClick={() => onIndexChange(Math.min(totalPoints - 1, currentIndex + 1))}
          disabled={currentIndex >= totalPoints - 1}
          style={{
            background: 'transparent',
            border: 'none',
            color: currentIndex >= totalPoints - 1 ? '#4b5563' : '#9ca3af',
            cursor: currentIndex >= totalPoints - 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
          }}
          title="Step forward"
        >
          ▶
        </button>

        <span style={{ fontSize: '0.75rem', color: '#9ca3af', minWidth: '70px', textAlign: 'right' }}>
          Ring {currentIndex + 1} of {totalPoints}
        </span>
      </div>

      {/* Trajectory Scrub Details Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: '#9ca3af',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '6px',
        }}
      >
        <div>
          <span style={{ color: '#cbd5e1' }}>Event: </span>
          <strong style={{ color: badge.text }}>{currentPoint.label}</strong>
          <span style={{ marginLeft: '8px', opacity: 0.8 }}>({currentPoint.detail})</span>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <span>Diff: <strong style={{ color: '#38bdf8' }}>{currentPoint.diffSummary || '0 chars'}</strong></span>
          <span>Errors: <strong style={{ color: currentPoint.errorCount > 0 ? '#f87171' : '#34d399' }}>{currentPoint.errorCount}</strong></span>
          <span>Vitality: <strong style={{ color: currentPoint.treeState.hp > 50 ? '#34d399' : '#f87171' }}>{currentPoint.treeState.hp} HP</strong></span>
        </div>
      </div>
    </div>
  );
}
