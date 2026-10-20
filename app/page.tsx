import Link from 'next/link';
import { initialExercises } from '@/lib/curriculumData';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Header */}
      <header
        style={{
          padding: '60px 24px 40px',
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '999px',
            fontSize: '0.85rem',
            color: '#34d399',
            fontWeight: 600,
            marginBottom: '20px',
          }}
        >
          <span>🌱</span>
          <span>Gamified Botanical Python Learning Platform</span>
        </div>

        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ffffff 30%, #a7f3d0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Grow Your Mind. Nurture Your Code Tree.
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: '#9ca3af',
            lineHeight: 1.6,
            marginBottom: '32px',
            maxWidth: '680px',
            margin: '0 auto 32px',
          }}
        >
          Write Python code to heal damaged computational branches. Defeat botanical parasites
          like 🪲 Boundary Beetles and 🐛 Structure Caterpillars with fading AI scaffolding hints.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link
            href="/learn/variable-swap-print"
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '1rem', textDecoration: 'none' }}
          >
            <span>🌿</span>
            <span>Enter Code Garden (Exercise 1)</span>
          </Link>
        </div>
      </header>

      {/* Curriculum Exercises Grid */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px', width: '100%' }}>
        <h2
          style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#e5e7eb',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📚</span>
          <span>Curriculum Quests</span>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {initialExercises.map((ex, idx) => (
            <Link
              key={ex.id}
              href={`/learn/${ex.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  height: '100%',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    Quest {idx + 1}
                  </span>

                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {ex.testCases.length} Test Cases
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '4px' }}>
                    {ex.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    Core Concept: <strong>{ex.concept}</strong>
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: '#34d399',
                    fontWeight: 600,
                  }}
                >
                  <span>Launch Workspace</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
