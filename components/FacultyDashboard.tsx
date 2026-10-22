'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  StudentSessionMetric,
  SEED_STUDENT_SESSIONS,
  generateUniversityLmsCsv,
  downloadCsvFile,
  calculateHintDependencyRatio,
  calculateCognitiveFlow,
} from '@/lib/facultyAnalytics';

export default function FacultyDashboard() {
  const [sessions, setSessions] = useState<StudentSessionMetric[]>(SEED_STUDENT_SESSIONS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedExp, setSelectedExp] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeModalSession, setActiveModalSession] = useState<StudentSessionMetric | null>(null);
  const [showCsvPreview, setShowCsvPreview] = useState<boolean>(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Filter sessions based on search and dropdown selectors
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch =
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.labExperimentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.labExperimentTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDivision =
        selectedDivision === 'ALL' || s.division === selectedDivision;

      const matchesExp = selectedExp === 'ALL' || s.labExperimentId === selectedExp;

      const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;

      return matchesSearch && matchesDivision && matchesExp && matchesStatus;
    });
  }, [sessions, searchQuery, selectedDivision, selectedExp, selectedStatus]);

  // Aggregate Cohort Metrics
  const aggregateStats = useMemo(() => {
    const totalCount = filteredSessions.length;
    if (totalCount === 0) {
      return {
        totalStudents: 0,
        totalBugs: 0,
        avgBugs: 0,
        avgHintRatio: 0,
        avgActiveMins: 0,
        avgIdleMins: 0,
        avgFlowPct: 0,
        avgTotalMarks: 0,
        optimalHintCount: 0,
      };
    }

    const totalBugs = filteredSessions.reduce((acc, s) => acc + s.weeklyBugsConquered, 0);
    const sumHintRatio = filteredSessions.reduce((acc, s) => acc + s.hintDependencyRatio, 0);
    const sumActiveMins = filteredSessions.reduce((acc, s) => acc + s.activeMinutes, 0);
    const sumIdleMins = filteredSessions.reduce((acc, s) => acc + s.idleMinutes, 0);
    const sumFlowPct = filteredSessions.reduce((acc, s) => acc + s.cognitiveFlowPercentage, 0);
    const sumTotalMarks = filteredSessions.reduce(
      (acc, s) => acc + s.assessmentMarks.totalOutOf20,
      0
    );
    const optimalHintCount = filteredSessions.filter((s) => s.hintDependencyRatio < 0.25).length;

    return {
      totalStudents: totalCount,
      totalBugs,
      avgBugs: Math.round((totalBugs / totalCount) * 10) / 10,
      avgHintRatio: Math.round((sumHintRatio / totalCount) * 1000) / 10,
      avgActiveMins: Math.round(sumActiveMins / totalCount),
      avgIdleMins: Math.round(sumIdleMins / totalCount),
      avgFlowPct: Math.round(sumFlowPct / totalCount),
      avgTotalMarks: Math.round((sumTotalMarks / totalCount) * 10) / 10,
      optimalHintCount,
    };
  }, [filteredSessions]);

  // Handle University LMS CSV Export
  const handleExportCsv = () => {
    const csvData = generateUniversityLmsCsv(filteredSessions, {
      academicYear: '2024-2025',
      courseCode: 'FEC105',
      courseName: 'Python Programming Lab (FE Computer Engineering)',
      divisionFilter: selectedDivision,
    });

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `MU_Continuous_Assessment_FE_Python_${selectedDivision}_${dateStr}.csv`;
    downloadCsvFile(csvData, fileName);

    setDownloadSuccessToast(
      `✓ Exported "${fileName}" matching Mumbai University / SPPU internal marks rubrics!`
    );
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 6000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'radial-gradient(circle at 50% 0%, #0d1e16 0%, #060a08 100%)' }}>
      {/* Top University LMS Header Navigation */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 15, 12, 0.95)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: '1700px',
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Logo & University Credentials */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.6rem' }}>🌿</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f3f4f6', letterSpacing: '-0.02em' }}>
                Code Garden
              </span>
            </Link>

            <span style={{ color: '#4b5563' }}>|</span>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(52, 211, 153, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                  }}
                >
                  FACULTY COCKPIT
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>
                  Mumbai University (MU) & SPPU Continuous Internal Assessment (CAS)
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Course: FEC105 Python Programming Lab &bull; Semester I &bull; Academic Year 2024-2025
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Primary LMS CSV Export Button (Requirement 2) */}
            <button
              onClick={handleExportCsv}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
                cursor: 'pointer',
              }}
              title="Download official continuous assessment marks sheet matching Mumbai University rubrics"
            >
              <span>📥</span>
              <span>Export for University LMS (CSV)</span>
            </button>

            <button
              onClick={() => setShowCsvPreview(!showCsvPreview)}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <span>👁️</span>
              <span>{showCsvPreview ? 'Hide CSV Preview' : 'Preview LMS Format'}</span>
            </button>

            <Link
              href="/learn/variable-swap-print"
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
            >
              <span>💻</span>
              <span>Student Workspace</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Success Download Toast */}
      {downloadSuccessToast && (
        <div
          style={{
            padding: '10px 24px',
            background: 'rgba(16, 185, 129, 0.2)',
            borderBottom: '1px solid #10b981',
            color: '#a7f3d0',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '60px',
            zIndex: 35,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✅</span>
            <span>{downloadSuccessToast}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessToast(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Faculty Dashboard Body */}
      <main style={{ maxWidth: '1700px', margin: '0 auto', padding: '24px', width: '100%', flex: 1 }}>
        {/* Course & Presentation Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '18px 24px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.4) 100%)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.2rem' }}>🎓</span>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f3f4f6', letterSpacing: '-0.02em', margin: 0 }}>
                  Professor Summary Dashboard & LMS Termwork Export Module
                </h1>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '850px', margin: '4px 0 0', lineHeight: 1.5 }}>
                Aggregating real-time student session telemetry across weekly lab experiments. Automatically calculates the
                <strong> Hint Dependency Ratio (&lt;25% Guardrail)</strong>, <strong>Weekly Bugs Conquered</strong>, and
                <strong> Cognitive Flow Time</strong> to output official Mumbai University / SPPU Continuous Assessment Sheets.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Institutional Pilot:</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
                  SPIT • VJTI • COEP Pune
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 KPI Summary Stat Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* KPI 1: Active Student Cohort */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
                Active Student Sessions
              </span>
              <span style={{ fontSize: '1.2rem' }}>👥</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60a5fa', margin: '6px 0 2px' }}>
              {aggregateStats.totalStudents} Logged
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              FE-CMPN Divisions A, B & C
            </div>
          </div>

          {/* KPI 2: Weekly Bugs Conquered (North Star Metric) */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
                Weekly Bugs Conquered
              </span>
              <span style={{ fontSize: '1.2rem' }}>🛡️</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', margin: '6px 0 2px' }}>
              {aggregateStats.avgBugs} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/ student avg</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>
              {aggregateStats.totalBugs} Total AST exceptions remediated
            </div>
          </div>

          {/* KPI 3: Hint Dependency Ratio (<25% Guardrail) */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
                Hint Dependency Ratio
              </span>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: aggregateStats.avgHintRatio < 25 ? '#34d399' : '#fbbf24', margin: '6px 0 2px' }}>
              {aggregateStats.avgHintRatio}%
            </div>
            <div style={{ fontSize: '0.75rem', color: aggregateStats.avgHintRatio < 25 ? '#34d399' : '#fbbf24' }}>
              {aggregateStats.avgHintRatio < 25 ? '✓ Passing Critical Guardrail (<25%)' : '⚠️ Elevated Hint Dependency'}
            </div>
          </div>

          {/* KPI 4: Cognitive Flow Time */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
                Mean Cognitive Flow Time
              </span>
              <span style={{ fontSize: '1.2rem' }}>⏱️</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c084fc', margin: '6px 0 2px' }}>
              {aggregateStats.avgActiveMins}m <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>vs {aggregateStats.avgIdleMins}m idle</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {aggregateStats.avgFlowPct}% Active typing flow engagement
            </div>
          </div>

          {/* KPI 5: Continuous Assessment Mean Marks */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #ec4899' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
                Continuous Assessment
              </span>
              <span style={{ fontSize: '1.2rem' }}>📝</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f472b6', margin: '6px 0 2px' }}>
              {aggregateStats.avgTotalMarks} / 20
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Internal Termwork Grade Average
            </div>
          </div>
        </div>

        {/* Real-time CSV LMS Format Preview Drawer */}
        {showCsvPreview && (
          <div
            className="glass-panel"
            style={{
              padding: '16px 20px',
              marginBottom: '24px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>📄</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
                  Continuous Assessment Sheet (CAS) Preview &bull; Mumbai University Rubric Schema
                </span>
              </div>
              <button
                onClick={handleExportCsv}
                className="btn-primary"
                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
              >
                Download CSV
              </button>
            </div>
            <pre
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '12px',
                color: '#cbd5e1',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                maxHeight: '180px',
                overflowX: 'auto',
                whiteSpace: 'pre',
              }}
            >
              {generateUniversityLmsCsv(filteredSessions.slice(0, 3), {
                divisionFilter: selectedDivision,
              })}
            </pre>
          </div>
        )}

        {/* Search & Filtering Toolbar */}
        <div
          className="glass-panel"
          style={{
            padding: '14px 20px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Search bar */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '0.85rem' }}>
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll no, or experiment ID..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: '#f3f4f6',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Dropdown Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Division Selector */}
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              style={{
                padding: '8px 12px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Divisions</option>
              <option value="FE-CMPN-A">Division FE-CMPN-A</option>
              <option value="FE-CMPN-B">Division FE-CMPN-B</option>
              <option value="FE-CMPN-C">Division FE-CMPN-C</option>
            </select>

            {/* Experiment Selector */}
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              style={{
                padding: '8px 12px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Lab Experiments</option>
              <option value="MU_Python_Exp_01">MU Exp 1: Variable Swap</option>
              <option value="MU_Python_Exp_02">MU Exp 2: Pass/Fail Boundary</option>
              <option value="MU_Python_Exp_03">MU Exp 3: Loop Accumulator</option>
              <option value="MU_Python_Exp_04">MU Exp 4: Safe Divider</option>
              <option value="MU_Python_Exp_05">MU Exp 5: List Traversal</option>
              <option value="MU_Python_Exp_06">MU Exp 6: String Palindrome</option>
              <option value="MU_Python_Exp_07">MU Exp 7: Factorial Recursion</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Needs Review">Needs Review</option>
            </select>
          </div>
        </div>

        {/* Aggregated Student Sessions Table */}
        <div
          className="glass-panel"
          style={{
            overflowX: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.82rem',
            }}
          >
            <thead>
              <tr
                style={{
                  background: 'rgba(10, 15, 12, 0.9)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#9ca3af',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <th style={{ padding: '12px 16px' }}>Student & Division</th>
                <th style={{ padding: '12px 16px' }}>Lab Experiment</th>
                <th style={{ padding: '12px 16px' }}>Weekly Bugs Conquered</th>
                <th style={{ padding: '12px 16px' }}>Hint Dependency Ratio</th>
                <th style={{ padding: '12px 16px' }}>Cognitive Flow Time</th>
                <th style={{ padding: '12px 16px' }}>CAS Marks (/20)</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Audit Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#6b7280' }}>
                    No student sessions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((sess, idx) => {
                  const hintRatioData = calculateHintDependencyRatio(sess.hintsUsed, sess.totalAttempts);
                  const flowData = calculateCognitiveFlow(sess.activeMinutes, sess.idleMinutes);

                  return (
                    <tr
                      key={sess.sessionId}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
                        transition: 'background 0.2s',
                      }}
                    >
                      {/* 1. Student Name & Roll No / Division */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#f3f4f6', fontSize: '0.88rem' }}>
                          {sess.studentName}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{sess.rollNo}</span>
                          <span>&bull;</span>
                          <span
                            style={{
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: 'rgba(255, 255, 255, 0.06)',
                              color: '#cbd5e1',
                              fontSize: '0.68rem',
                            }}
                          >
                            {sess.division}
                          </span>
                        </div>
                      </td>

                      {/* 2. Lab Experiment ID & Title */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                          {sess.labExperimentId}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#cbd5e1', maxWidth: '200px' }}>
                          {sess.labExperimentTitle}
                        </div>
                      </td>

                      {/* 3. Weekly Bugs Conquered (Resolved AST exceptions) */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                            {sess.weeklyBugsConquered}
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#6ee7b7',
                              fontWeight: 600,
                            }}
                          >
                            🛡️ Remediated
                          </span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                          {sess.totalAttempts} Sandbox runs
                        </div>
                      </td>

                      {/* 4. Hint Dependency Ratio (hints / attempts %) */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              color: hintRatioData.isOptimal ? '#34d399' : '#fbbf24',
                            }}
                          >
                            {hintRatioData.formatted}
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: hintRatioData.isOptimal ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                              color: hintRatioData.isOptimal ? '#34d399' : '#fbbf24',
                              fontWeight: 600,
                            }}
                          >
                            {hintRatioData.isOptimal ? '< 25% Guardrail' : 'High Dependency'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                          {sess.hintsUsed} hints used / {sess.totalAttempts} total attempts
                        </div>
                      </td>

                      {/* 5. Cognitive Flow Time (total active minutes vs. idle minutes) */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
                          <span style={{ color: '#38bdf8' }}>{sess.activeMinutes}m active</span> /{' '}
                          <span style={{ color: '#94a3b8' }}>{sess.idleMinutes}m idle</span>
                        </div>
                        {/* Mini progress bar showing active flow percentage */}
                        <div
                          style={{
                            width: '120px',
                            height: '6px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '999px',
                            overflow: 'hidden',
                            marginTop: '4px',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${flowData.flowPercentage}%`,
                              background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                              borderRadius: '999px',
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                          {flowData.flowPercentage}% cognitive flow ratio
                        </div>
                      </td>

                      {/* 6. Assessment Marks (/20) */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f472b6' }}>
                          {sess.assessmentMarks.totalOutOf20} / 20
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: '2px' }}>
                          Perf: {sess.assessmentMarks.performanceOutOf10} | Viva: {sess.assessmentMarks.vivaUnderstandingOutOf5} | Time: {sess.assessmentMarks.timelyCompletionOutOf5}
                        </div>
                      </td>

                      {/* 7. Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background:
                              sess.status === 'Completed'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : sess.status === 'In Progress'
                                ? 'rgba(59, 130, 246, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                            color:
                              sess.status === 'Completed'
                                ? '#34d399'
                                : sess.status === 'In Progress'
                                ? '#60a5fa'
                                : '#f87171',
                            border: `1px solid ${
                              sess.status === 'Completed'
                                ? 'rgba(16, 185, 129, 0.3)'
                                : sess.status === 'In Progress'
                                ? 'rgba(59, 130, 246, 0.3)'
                                : 'rgba(239, 68, 68, 0.3)'
                            }`,
                          }}
                        >
                          {sess.status}
                        </span>
                      </td>

                      {/* 8. Audit Action */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => setActiveModalSession(sess)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#e2e8f0',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Audit Telemetry &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Student Audit Detail Modal */}
      {activeModalSession && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 50,
          }}
          onClick={() => setActiveModalSession(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '650px',
              width: '100%',
              padding: '24px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '14px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🔍</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
                    Student Session Telemetry Audit
                  </h3>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {activeModalSession.studentName} &bull; Roll: {activeModalSession.rollNo} ({activeModalSession.division})
                </div>
              </div>
              <button
                onClick={() => setActiveModalSession(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Metrics Breakdown Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Lab Experiment</div>
                <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.85rem' }}>
                  {activeModalSession.labExperimentId}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                  {activeModalSession.labExperimentTitle}
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Weekly Bugs Conquered</div>
                <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1.1rem' }}>
                  {activeModalSession.weeklyBugsConquered} AST Exceptions
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Across {activeModalSession.totalAttempts} total compilation attempts
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Hint Dependency Ratio</div>
                <div style={{ fontWeight: 800, color: activeModalSession.hintDependencyRatio < 0.25 ? '#34d399' : '#fbbf24', fontSize: '1.1rem' }}>
                  {(activeModalSession.hintDependencyRatio * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {activeModalSession.hintsUsed} hints used (Guardrail threshold: &lt;25%)
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Cognitive Flow Engagement</div>
                <div style={{ fontWeight: 800, color: '#c084fc', fontSize: '1.1rem' }}>
                  {activeModalSession.activeMinutes}m active / {activeModalSession.idleMinutes}m idle
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {activeModalSession.cognitiveFlowPercentage}% active keyboard burst density
                </div>
              </div>
            </div>

            {/* Primary Misconception */}
            <div
              style={{
                padding: '12px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                Identified AST Node Misconception:
              </div>
              <div style={{ fontSize: '0.85rem', color: '#fef3c7' }}>
                {activeModalSession.primaryMisconception || 'No persistent misconceptions detected.'}
              </div>
            </div>

            {/* Continuous Assessment Breakdown */}
            <div
              style={{
                padding: '12px',
                background: 'rgba(236, 72, 153, 0.08)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#f472b6', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                Mumbai University Termwork Marks Breakdown:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', textAlign: 'center', fontSize: '0.75rem' }}>
                <div>
                  <div style={{ color: '#94a3b8' }}>Performance</div>
                  <strong style={{ color: '#f3f4f6' }}>{activeModalSession.assessmentMarks.performanceOutOf10} / 10</strong>
                </div>
                <div>
                  <div style={{ color: '#94a3b8' }}>Viva</div>
                  <strong style={{ color: '#f3f4f6' }}>{activeModalSession.assessmentMarks.vivaUnderstandingOutOf5} / 5</strong>
                </div>
                <div>
                  <div style={{ color: '#94a3b8' }}>Timeliness</div>
                  <strong style={{ color: '#f3f4f6' }}>{activeModalSession.assessmentMarks.timelyCompletionOutOf5} / 5</strong>
                </div>
                <div>
                  <div style={{ color: '#f472b6', fontWeight: 700 }}>Total Marks</div>
                  <strong style={{ color: '#f472b6', fontSize: '0.9rem' }}>{activeModalSession.assessmentMarks.totalOutOf20} / 20</strong>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setActiveModalSession(null)}
                className="btn-primary"
                style={{ padding: '6px 16px', fontSize: '0.8rem' }}
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
