import Link from 'next/link';
import { initialExercises } from '@/lib/curriculumData';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#080e0a' }}>
      {/* 1. Codédex-style Sticky Navigation Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(8, 14, 10, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(52, 211, 153, 0.15)',
          padding: '12px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Logo & Brand */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                border: '2px solid #34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                boxShadow: '0 0 16px rgba(52, 211, 153, 0.4)',
              }}
            >
              🌱
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Code Garden</span>
                <span
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.55rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(52, 211, 153, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                  }}
                >
                  v1.2
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <a
              href="#curriculum"
              style={{
                color: '#d1d5db',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              📖 Lab Practicals
            </a>
            <a
              href="#how-it-works"
              style={{
                color: '#d1d5db',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              🌳 The Code Tree
            </a>
            <a
              href="#parasites"
              style={{
                color: '#d1d5db',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              🐛 Bug Parasites
            </a>
            <Link
              href="/faculty"
              style={{
                color: '#34d399',
                fontSize: '0.9rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>📊 Faculty Portal</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  background: 'rgba(52, 211, 153, 0.2)',
                  borderRadius: '4px',
                  color: '#6ee7b7',
                }}
              >
                LMS
              </span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/learn/accumulator-loop"
              className="btn-codedex-dark"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <span>⚡ 75s Demo</span>
            </Link>
            <Link
              href="/learn/variable-swap-print"
              className="btn-codedex-yellow"
              style={{ padding: '9px 20px', fontSize: '0.92rem' }}
            >
              <span>Start Coding 🌿</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section - Codédex Style Rich Botanical Adventure */}
      <section
        style={{
          position: 'relative',
          padding: '36px 20px 48px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          className="hero-landscape-viewport"
          style={{
            position: 'relative',
            minHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '48px 24px',
          }}
        >
          {/* Background Image Layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/hero-garden-pixel.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 45%',
              opacity: 0.85,
              zIndex: 1,
            }}
          />

          {/* Atmospheric Dark & Vignette Overlay so text has perfect contrast */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center, rgba(10, 20, 14, 0.72) 0%, rgba(5, 12, 8, 0.92) 80%, #050b07 100%)',
              zIndex: 2,
            }}
          />

          {/* Foreground Hero Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '860px',
              margin: '0 auto',
            }}
          >
            {/* Top Pixel Banner */}
            <div style={{ marginBottom: '18px' }}>
              <span className="hero-caps-badge">
                <span>✦</span>
                <span>START YOUR BOTANICAL CODING JOURNEY</span>
                <span>✦</span>
              </span>
            </div>

            {/* Main Adventure Heading */}
            <h1 className="hero-adventure-title" style={{ marginBottom: '16px' }}>
              Grow Your Code Into a Living Garden
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '1.2rem',
                color: '#e5e7eb',
                lineHeight: 1.6,
                fontWeight: 500,
                maxWidth: '740px',
                margin: '0 auto 32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
              }}
            >
              The most delightful, beginner-friendly way for engineering students to master Python.
              Watch your syntax sprout living trees, conquer cute bug parasites instead of scary stack traces,
              and breeze through university lab practicals.
            </p>

            {/* 3D Tactile Action Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '28px',
              }}
            >
              <Link href="/learn/variable-swap-print" className="btn-codedex-yellow">
                <span>🌱</span>
                <span>Enter The Garden (Free)</span>
              </Link>

              <a href="#curriculum" className="btn-codedex-green">
                <span>📖</span>
                <span>University Lab Quests</span>
              </a>

              <Link href="/faculty" className="btn-codedex-dark">
                <span>🎓</span>
                <span>Professor LMS Cockpit</span>
              </Link>
            </div>

            {/* Trust & Syllabus Strip */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '16px',
                padding: '8px 20px',
                background: 'rgba(10, 20, 14, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '999px',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                fontSize: '0.8rem',
                color: '#a7f3d0',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <span>🏛️ Mumbai University & SPPU Syllabi</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>⚡ Python 3.12 AST Sandbox</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>🎯 100% Socratic Recovery (No Answers Leaked)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "What Are We Offering?" - Core Platform Capabilities */}
      <section
        id="how-it-works"
        style={{
          padding: '64px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.72rem',
              color: '#34d399',
              letterSpacing: '0.08em',
              marginBottom: '10px',
            }}
          >
            [ PLATFORM ARCHITECTURE & PEDAGOGY ]
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '14px',
            }}
          >
            Why Beginners Blossom in Code Garden
          </h2>
          <p
            style={{
              color: '#9ca3af',
              fontSize: '1.05rem',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Traditional compilers throw intimidating red stack traces that make 78% of first-year students quit.
            We replaced frustration with an interactive biological ecosystem.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Card 1: Living Code Tree */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              border: '1.5px solid rgba(52, 211, 153, 0.25)',
              background: 'linear-gradient(180deg, rgba(20, 36, 26, 0.8) 0%, rgba(12, 22, 16, 0.9) 100%)',
              borderRadius: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
              }}
            >
              🌳
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
              The Living Code Tree
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Your source code is parsed into an AST that directly fuels a growing botanical tree.
              Clean loops, conditionals, and functions sprout leafy branches and blooming flowers in real time.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.62rem',
                  color: '#34d399',
                  background: 'rgba(52, 211, 153, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                GROWTH: SPROUT → OAK
              </span>
            </div>
          </div>

          {/* Card 2: Visual Bug Parasites */}
          <div
            id="parasites"
            className="glass-panel"
            style={{
              padding: '28px',
              border: '1.5px solid rgba(245, 158, 11, 0.25)',
              background: 'linear-gradient(180deg, rgba(36, 28, 20, 0.8) 0%, rgba(22, 16, 12, 0.9) 100%)',
              borderRadius: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
              }}
            >
              🐛
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
              No Cryptic Stack Traces
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Instead of terrifying terminal errors, exceptions attach visually as botanical parasites:
              <strong> Caterpillars</strong> on branch tips for index slips, <strong>Fungal Blight</strong> at junctions,
              and <strong>Strangler Vines</strong> for infinite loops.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.62rem',
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                CLICK-TO-DIAGNOSE
              </span>
            </div>
          </div>

          {/* Card 3: 3-Tier Socratic AI */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              border: '1.5px solid rgba(139, 92, 246, 0.25)',
              background: 'linear-gradient(180deg, rgba(30, 20, 42, 0.8) 0%, rgba(18, 12, 26, 0.9) 100%)',
              borderRadius: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
              }}
            >
              🦉
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
              Calibrated Socratic Sage
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Our 3-tier fading scaffolding guides you to discover the solution without spoiling it:
              Tier 1 Socratic Questioning → Tier 2 Logic Outline → Tier 3 Fill-in Skeleton.
              Complete code is strictly never given away.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.62rem',
                  color: '#c084fc',
                  background: 'rgba(139, 92, 246, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                HINT RATIO &lt; 25% GUARDRAIL
              </span>
            </div>
          </div>

          {/* Card 4: Dendrochronology Rings */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              border: '1.5px solid rgba(56, 189, 248, 0.25)',
              background: 'linear-gradient(180deg, rgba(16, 28, 40, 0.8) 0%, rgba(10, 18, 26, 0.9) 100%)',
              borderRadius: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
              }}
            >
              🪵
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
              Dendrochronology Rings
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Every compile logs a concentric tree ring. Thick vibrant green rings represent clean passes,
              while thin dark rings capture resilient recovery from exceptions—proving authentic, un-cheated mastery.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.62rem',
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                TIME-LAPSE AUDIT TRAIL
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. University Lab Curriculum - Quest Board (Mumbai University & SPPU) */}
      <section
        id="curriculum"
        style={{
          padding: '64px 24px',
          background: 'rgba(10, 18, 13, 0.6)',
          borderTop: '1px solid rgba(52, 211, 153, 0.1)',
          borderBottom: '1px solid rgba(52, 211, 153, 0.1)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.72rem',
                  color: '#f59e0b',
                  letterSpacing: '0.08em',
                  marginBottom: '10px',
                }}
              >
                [ SYLLABUS-SYNCHRONIZED LAB EXPERIMENTS ]
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                First-Year Engineering Lab Quests
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '6px' }}>
                Complete the mandatory FE-CMPN practical manual while watching your computational garden flourish.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                background: 'rgba(20, 32, 24, 0.8)',
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                fontSize: '0.82rem',
                color: '#34d399',
              }}
            >
              <span>🌱 7 Lab Practicals</span>
              <span>•</span>
              <span>⭐ 700 Total XP</span>
              <span>•</span>
              <span>🎓 20 CAS Marks</span>
            </div>
          </div>

          {/* Quest Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px',
            }}
          >
            {initialExercises.map((exercise, index) => {
              const difficultyColors: Record<number, { bg: string; text: string; border: string }> = {
                0: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399', border: 'rgba(52, 211, 153, 0.4)' },
                1: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399', border: 'rgba(52, 211, 153, 0.4)' },
                2: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
                3: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
                4: { bg: 'rgba(139, 92, 246, 0.15)', text: '#c084fc', border: 'rgba(139, 92, 246, 0.4)' },
                5: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.4)' },
                6: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.4)' },
              };
              const diff = difficultyColors[index] || difficultyColors[0];

              return (
                <div
                  key={exercise.id}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(52, 211, 153, 0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    {/* Lab Number & Concept Tag */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-pixel)',
                          fontSize: '0.62rem',
                          color: diff.text,
                          background: diff.bg,
                          border: `1px solid ${diff.border}`,
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {exercise.labExperimentNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: '#9ca3af',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {exercise.concept}
                      </span>
                    </div>

                    {/* Exercise Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '8px',
                      }}
                    >
                      {exercise.title}
                    </h3>

                    {/* Unit Reference */}
                    <p style={{ fontSize: '0.85rem', color: '#6ee7b7', fontWeight: 500, marginBottom: '12px' }}>
                      {exercise.syllabusUnit}
                    </p>

                    {/* Test Case Indicator */}
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>🧪 {exercise.testCases.length} Test Cases</span>
                      <span>•</span>
                      <span>💡 3-Tier Socratic Hints</span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <Link
                    href={`/learn/${exercise.id}`}
                    className="btn-codedex-green"
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      fontSize: '0.92rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Play Lab Quest</span>
                    <span>→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. For Professors: Continuous Assessment & LMS Export */}
      <section
        style={{
          padding: '64px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          className="glass-panel-elevated"
          style={{
            padding: '40px',
            borderRadius: '24px',
            border: '2px solid rgba(52, 211, 153, 0.35)',
            background: 'linear-gradient(135deg, rgba(16, 32, 22, 0.95) 0%, rgba(8, 16, 12, 0.98) 100%)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.68rem',
                color: '#34d399',
                letterSpacing: '0.08em',
                marginBottom: '10px',
              }}
            >
              [ FACULTY & INSTITUTIONAL B2B ENGINE ]
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '16px',
                lineHeight: 1.15,
              }}
            >
              Automate Continuous Internal Assessment in 1 Click
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Stop grading trivial syntax errors across 60+ students in 2-hour practicals.
              Code Garden calculates the official Mumbai University & SPPU Continuous Internal Assessment (CAS)
              20-mark rubric automatically based on telemetry, cognitive flow, and conceptual independence.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e5e7eb', fontSize: '0.92rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span><strong>Implementation Marks (10M):</strong> Evaluated on AST pass rate and resolved bugs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e5e7eb', fontSize: '0.92rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span><strong>Viva & Independence (5M):</strong> Penalized if Hint Dependency Ratio exceeds 25%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e5e7eb', fontSize: '0.92rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span><strong>Discipline & Flow (5M):</strong> Computed from active vs. idle problem-solving ratio</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/faculty" className="btn-codedex-yellow" style={{ padding: '11px 24px' }}>
                <span>📊</span>
                <span>Open Professor Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Interactive CAS Scorecard Preview Box */}
          <div
            style={{
              background: 'rgba(10, 18, 13, 0.85)',
              borderRadius: '16px',
              padding: '24px',
              border: '1.5px solid rgba(52, 211, 153, 0.25)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                MU Continuous Assessment Sheet
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.6rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(52, 211, 153, 0.15)',
                  color: '#34d399',
                }}
              >
                RFC 4180 CSV
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span>Cohort Monitored:</span>
                <strong style={{ color: '#ffffff' }}>First-Year Computer Eng (FE-CMPN)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span>North Star Metric:</span>
                <strong style={{ color: '#34d399' }}>13.7 Bugs Conquered / Student</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span>AI Hint Dependency Ratio:</span>
                <strong style={{ color: '#34d399' }}>18.0% (✓ Optimal &lt;25%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span>Mean Cognitive Flow:</span>
                <strong style={{ color: '#e5e7eb' }}>38m Active / 12m Idle</strong>
              </div>
              <div
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  background: 'rgba(52, 211, 153, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 600, color: '#a7f3d0' }}>Cohort CAS Average:</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                  17.1 / 20.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer & Academic Team Attribution */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid rgba(52, 211, 153, 0.15)',
          background: 'rgba(6, 12, 8, 0.95)',
          padding: '48px 24px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🌱</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                Code Garden
              </span>
              <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                — Cultivating Confident Engineers
              </span>
            </div>

            <div style={{ display: 'flex', gap: '20px', fontSize: '0.88rem' }}>
              <Link href="/learn/variable-swap-print" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Lab Workspace
              </Link>
              <Link href="/faculty" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 600 }}>
                Faculty Portal
              </Link>
              <Link href="/learn/accumulator-loop" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                75s Live Demo
              </Link>
            </div>
          </div>

          {/* Academic Project Credits */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.8rem',
              color: '#6b7280',
            }}
          >
            <div>
              <span>MDMIE03: Innovation Management & Scaling Startups • Division TE-C • Presentation 2 (25 ISA Marks)</span>
            </div>
            <div>
              <span>Founding Team: </span>
              <strong style={{ color: '#9ca3af' }}>Atharva Tayade</strong>,{' '}
              <strong style={{ color: '#9ca3af' }}>Parth Phatak</strong>,{' '}
              <strong style={{ color: '#9ca3af' }}>Rutuja Darade</strong>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
