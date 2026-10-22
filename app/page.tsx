import Link from 'next/link';
import { initialExercises } from '@/lib/curriculumData';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Pitch & Academic Header */}
      <header
        style={{
          padding: '48px 24px 32px',
          textAlign: 'center',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        {/* Course & Presentation Metadata */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 18px',
            background: 'rgba(52, 211, 153, 0.08)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '999px',
            fontSize: '0.8rem',
            color: '#34d399',
            fontWeight: 600,
            marginBottom: '18px',
          }}
        >
          <span>🎓 MDMIE03 • Innovation Management & Scaling Startups</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>Presentation 2 (25 ISA Marks) • Division: TE-C</span>
        </div>

        <h1
          style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '14px',
            background: 'linear-gradient(135deg, #ffffff 40%, #a7f3d0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Code Garden 🌿
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: '#e5e7eb',
            fontWeight: 600,
            marginBottom: '10px',
          }}
        >
          MVP Validation, Semantic Error Profiling & Institutional Scale-Up
        </p>

        <p
          style={{
            fontSize: '0.95rem',
            color: '#9ca3af',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 28px',
          }}
        >
          Helping first-year engineering students master foundational programming through
          <strong> diagnostic visual plant growth</strong>, <strong>university lab-synchronized modules</strong>,
          and <strong>calibrated fading AI recovery</strong>.
        </p>

        {/* Founding Team Badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '32px',
          }}
        >
          <div className="glass-panel" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <span style={{ color: '#9ca3af' }}>Product & Engine: </span>
            <strong style={{ color: '#34d399' }}>Atharva Tayade</strong>
          </div>
          <div className="glass-panel" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <span style={{ color: '#9ca3af' }}>Curriculum & Pilot: </span>
            <strong style={{ color: '#34d399' }}>Parth Phatak</strong>
          </div>
          <div className="glass-panel" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <span style={{ color: '#9ca3af' }}>Testing & Analytics: </span>
            <strong style={{ color: '#34d399' }}>Rutuja Darade</strong>
          </div>
        </div>

        {/* Action Button & Live Demo Quick Link */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link
            href="/learn/variable-swap-print"
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem', textDecoration: 'none' }}
          >
            <span>🌿</span>
            <span>Launch Lab Workspace (Exp 01)</span>
          </Link>

          <Link
            href="/faculty"
            className="btn-secondary"
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem',
              textDecoration: 'none',
              borderColor: 'rgba(52, 211, 153, 0.4)',
              background: 'rgba(52, 211, 153, 0.1)',
              color: '#34d399',
            }}
          >
            <span>🎓</span>
            <span>Professor Dashboard & LMS Export</span>
          </Link>

          <Link
            href="/learn/accumulator-loop"
            className="btn-secondary"
            style={{ padding: '12px 24px', fontSize: '0.95rem', textDecoration: 'none' }}
          >
            <span>⏱️</span>
            <span>75-Sec Live Demo (Loop Bug)</span>
          </Link>
        </div>
      </header>

      {/* Validated Growth Metrics & Decision Banner */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 40px', padding: '0 24px', width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
            marginBottom: '20px',
          }}
        >
          {/* Metric 1 */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '3px solid #10b981' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>
              North Star Metric (Slide 7)
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
              Weekly Bugs Conquered
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Target: 15 / student • Measures true misconception remediation
            </div>
          </div>

          {/* Metric 2 */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '3px solid #f59e0b' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>
              Critical Guardrail (Slide 7)
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', margin: '4px 0' }}>
              Hint Ratio &lt; 25%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Measured: <strong>18%</strong> • Prevents blind copy-pasting
            </div>
          </div>

          {/* Metric 3 */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '3px solid #6366f1' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>
              Growth Experiment (Slide 8)
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a5b4fc', margin: '4px 0' }}>
              +132% Retention Lift
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              65% repeat rate on university lab questions vs 28% on generic quests
            </div>
          </div>
        </div>

        {/* Strategic Decision Highlight */}
        <div
          style={{
            padding: '12px 18px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>🎯</span>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>
                Strategic Decision: NARROW (Slides 6 & 11)
              </span>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                Narrowing strictly to Mumbai University (MU) & SPPU Python First-Year Syllabus.
                <strong> Deliberately NOT building C++ or Web Dev yet</strong> to preserve deep diagnostic depth.
              </p>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(52, 211, 153, 0.15)',
              color: '#34d399',
              fontWeight: 700,
            }}
          >
            MU / SPPU Lab Aligned
          </span>
        </div>
      </section>

      {/* University Synchronized Lab Manual Experiments */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>📚</span>
              <span>Mumbai University (MU) FE Computer Engineering Lab Practicals</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
              Structured around semester practical examinations and continuous internal assessment (ISA).
            </p>
          </div>

          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            {initialExercises.length} Synchronized Modules
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {initialExercises.map((ex) => (
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
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {ex.labExperimentNumber}
                  </span>

                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                    {ex.testCases.length} Test Cases
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '4px' }}>
                    {ex.title}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', marginBottom: '2px' }}>
                    {ex.syllabusUnit}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                    Core Diagnostic: <strong>{ex.concept}</strong>
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
                    fontSize: '0.78rem',
                    color: '#34d399',
                    fontWeight: 600,
                  }}
                >
                  <span>Launch Viva Workspace</span>
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

