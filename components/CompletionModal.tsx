'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AchievementBadge,
  generateLinkedInShareUrl,
  generateCelebratoryText,
  generateGitHubBadgeMarkdown,
} from '@/src/data/badges';
import { Exercise } from '@/lib/curriculumData';
import { TreeState, getTreeStage } from '@/lib/treeEngine';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: AchievementBadge;
  exercise: Exercise;
  treeState: TreeState;
  nextExercise?: Exercise | null;
  userId?: string;
}

export default function CompletionModal({
  isOpen,
  onClose,
  badge,
  exercise,
  treeState,
  nextExercise,
  userId = 'student_fe_cmpn',
}: CompletionModalProps) {
  const [copiedType, setCopiedType] = useState<'linkedin' | 'github' | null>(null);

  if (!isOpen) return null;

  const treeStage = getTreeStage(treeState.xp);
  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://codegarden.app';

  const shareUrl = `${currentOrigin}/learn/${exercise.id}`;
  const linkedInUrl = generateLinkedInShareUrl(shareUrl);
  const celebratoryText = generateCelebratoryText(badge, exercise.title);
  const githubMarkdown = generateGitHubBadgeMarkdown(userId, badge.id, currentOrigin);

  const handleShareLinkedIn = () => {
    // Copy celebratory text to clipboard
    try {
      navigator.clipboard.writeText(celebratoryText);
      setCopiedType('linkedin');
      setTimeout(() => setCopiedType(null), 3000);
    } catch {
      // Ignore clipboard fallback
    }

    // Open LinkedIn Web Share intent in popup window
    window.open(linkedInUrl, '_blank', 'width=600,height=600,noopener,noreferrer');
  };

  const handleCopyGitHubMarkdown = () => {
    try {
      navigator.clipboard.writeText(githubMarkdown);
      setCopiedType('github');
      setTimeout(() => setCopiedType(null), 3000);
    } catch {
      // Ignore
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(4, 9, 6, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel-elevated"
        style={{
          maxWidth: '680px',
          width: '100%',
          borderRadius: '24px',
          border: '2px solid rgba(52, 211, 153, 0.45)',
          background: 'linear-gradient(180deg, #0d1e14 0%, #08130d 100%)',
          padding: '32px 28px',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 50px rgba(16, 185, 129, 0.25)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#9ca3af',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          ✕
        </button>

        {/* Celebration Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-pixel)',
              color: '#34d399',
              marginBottom: '12px',
            }}
          >
            <span>🎉 MODULE CONQUERED • 100% TEST PASS</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 6px',
              lineHeight: 1.15,
            }}
          >
            Your Computational Garden Flourished!
          </h2>

          <p style={{ color: '#9ca3af', fontSize: '0.92rem', margin: 0 }}>
            {exercise.labExperimentNumber}: <strong>{exercise.title}</strong>
          </p>
        </div>

        {/* Tree Growth Milestone Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '14px 16px',
            background: 'rgba(18, 32, 24, 0.8)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            borderRadius: '14px',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase' }}>Tree Stage</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
              🌳 {treeStage}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase' }}>Vitality Restored</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
              💚 {treeState.hp} HP
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase' }}>Academic XP</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#60a5fa', marginTop: '2px' }}>
              ⭐ {treeState.xp} XP
            </div>
          </div>
        </div>

        {/* Milestone Badge Showcase with Live Inline SVG Preview */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.68rem',
                color: '#fbbf24',
                letterSpacing: '0.05em',
              }}
            >
              [ UNLOCKED ACHIEVEMENT BADGE ]
            </span>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              Verified MU / SPPU Status
            </span>
          </div>

          {/* Inline SVG Card Preview */}
          <div
            style={{
              background: '#070f0a',
              border: `2px solid ${badge.color}`,
              borderRadius: '16px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              boxShadow: `0 8px 24px ${badge.color}20`,
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `${badge.color}25`,
                border: `2px solid ${badge.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                flexShrink: 0,
              }}
            >
              {badge.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-pixel)',
                  color: '#34d399',
                  letterSpacing: '0.06em',
                }}
              >
                CODE GARDEN • VERIFIED LAB MASTERY
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '2px 0 4px',
                }}
              >
                {badge.name}
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '8px' }}>
                {badge.universityModule}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#10b981',
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                  VERIFIED PASS 100%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Viral Distribution Actions: LinkedIn & GitHub */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          {/* Action 1: LinkedIn Web Share Intent */}
          <div
            style={{
              padding: '16px',
              background: 'rgba(10, 20, 15, 0.8)',
              border: '1.5px solid rgba(14, 118, 168, 0.4)',
              borderRadius: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>💼</span>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                  Share Milestone on LinkedIn
                </span>
              </div>
              {copiedType === 'linkedin' && (
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                  ✓ Copied to Clipboard!
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: '0 0 12px', lineHeight: 1.5 }}>
              Showcase your problem-solving resilience, AST error recovery, and lab readiness to recruiters and peers.
            </p>

            <button
              onClick={handleShareLinkedIn}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
                color: '#ffffff',
                border: '1px solid #3880c9',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(10, 102, 194, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Post on LinkedIn & Copy Celebratory Text</span>
              <span>↗</span>
            </button>
          </div>

          {/* Action 2: GitHub Profile Markdown Embed */}
          <div
            style={{
              padding: '16px',
              background: 'rgba(10, 20, 15, 0.8)',
              border: '1.5px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🐙</span>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                  Showcase on GitHub README
                </span>
              </div>
              <button
                onClick={handleCopyGitHubMarkdown}
                style={{
                  background: copiedType === 'github' ? '#10b981' : 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  color: copiedType === 'github' ? '#ffffff' : '#34d399',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {copiedType === 'github' ? '✓ Copied Markdown' : '📋 Copy Markdown Code'}
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 10px' }}>
              Paste this dynamic markdown badge into your GitHub profile README:
            </p>

            <pre
              style={{
                background: '#040705',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                color: '#a7f3d0',
                overflowX: 'auto',
                margin: 0,
              }}
            >
              <code>{githubMarkdown}</code>
            </pre>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            Keep Practicing
          </button>

          {nextExercise && (
            <Link
              href={`/learn/${nextExercise.id}`}
              onClick={onClose}
              className="btn-codedex-yellow"
              style={{ padding: '10px 22px', fontSize: '0.92rem', textDecoration: 'none' }}
            >
              <span>Next Lab Quest ({nextExercise.labExperimentNumber})</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
