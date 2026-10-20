'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  onRun: () => void;
  onAskHint: () => void;
  onReset: () => void;
  isRunning: boolean;
  isHintLoading: boolean;
  attemptCount: number;
}

export default function CodeEditor({
  code,
  onChange,
  onRun,
  onAskHint,
  onReset,
  isRunning,
  isHintLoading,
  attemptCount,
}: CodeEditorProps) {
  // Support Ctrl+Enter / Cmd+Enter to run code
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isRunning) {
        onRun();
      }
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '420px',
        overflow: 'hidden',
        border: '1px solid rgba(52, 211, 153, 0.2)',
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Editor Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          background: 'rgba(12, 18, 14, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(52, 211, 153, 0.1)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#34d399',
            }}
          >
            <span>🐍</span>
            <span>solution.py</span>
          </div>

          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Python 3.14 Sandbox (Isolated Mode -I)
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onReset}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            title="Reset code to starter template"
            disabled={isRunning}
          >
            <span>↺</span>
            <span>Reset</span>
          </button>

          <button
            onClick={onAskHint}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              borderColor: 'rgba(168, 85, 247, 0.35)',
              color: '#c084fc',
              background: 'rgba(168, 85, 247, 0.1)',
            }}
            disabled={isHintLoading || isRunning}
            title="Request AI Scaffolding Hint (Tiered Fading Guidance)"
          >
            <span>✨</span>
            <span>{isHintLoading ? 'Consulting Tutor...' : `Ask AI Tutor (${attemptCount > 0 ? `Tier ${Math.min(3, attemptCount)}` : 'Guidance'})`}</span>
          </button>

          <button
            onClick={onRun}
            className="btn-primary"
            style={{ padding: '6px 16px', fontSize: '0.75rem' }}
            disabled={isRunning}
            title="Run Code in Python Sandbox (Ctrl+Enter)"
          >
            <span>{isRunning ? '⏳' : '▶'}</span>
            <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 4,
            insertSpaces: true,
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
          loading={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#9ca3af',
                fontSize: '0.875rem',
              }}
            >
              Loading Python Editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
