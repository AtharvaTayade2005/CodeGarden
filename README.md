# Code Garden 🌱
### MVP Validation, Semantic Error Profiling & Institutional Scale-Up Pitch
> **A living computational ecosystem where student code nurtures a botanical tree.**  
> Built for First-Year Computer Engineering Undergraduates (FE-CMPN) across **Mumbai University (MU)** & **SPPU (Pune)**.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tests Passing](https://img.shields.io/badge/Tests-51%2F51%20Passed-emerald?style=for-the-badge&logo=vitest)](https://github.com/AtharvaTayade2005/CodeGarden)
[![Syllabus Aligned](https://img.shields.io/badge/Curriculum-Mumbai%20Univ%20%7C%20SPPU-orange?style=for-the-badge)](https://mu.ac.in/)
[![ISA Presentation](https://img.shields.io/badge/MDMIE03-25%20ISA%20Marks%20(TE--C)-purple?style=for-the-badge)](#founding-team--academic-context)

---

## 📌 Table of Contents
- [Executive Overview](#executive-overview)
- [Founding Team & Academic Context](#founding-team--academic-context)
- [The Problem & Empirical Evidence](#the-problem--empirical-evidence)
- [Core Platform Pillars](#core-platform-pillars)
  - [1. The Living Code Tree (Visual AST)](#1-the-living-code-tree-visual-ast)
  - [2. Visual Bug Parasites (Zero Intimidating Traces)](#2-visual-bug-parasites-zero-intimidating-traces)
  - [3. Calibrated 3-Tier Socratic AI Fading](#3-calibrated-3-tier-socratic-ai-fading)
  - [4. Dendrochronology Rings (Authentic Growth)](#4-dendrochronology-rings-authentic-growth)
  - [5. University Lab Synchronized Practicals](#5-university-lab-synchronized-practicals)
  - [6. Faculty Continuous Assessment (LMS Gradebook)](#6-faculty-continuous-assessment-lms-gradebook)
- [Traction, Growth & Guardrail Metrics](#traction-growth--guardrail-metrics)
- [System Architecture & Sandbox Security](#system-architecture--sandbox-security)
- [Automated Test Suite (51/51 Passing)](#automated-test-suite-5151-passing)
- [Getting Started & Local Setup](#getting-started--local-setup)
- [Repository Structure](#repository-structure)
- [License & Institutional Attribution](#license--institutional-attribution)

---

## 🌟 Executive Overview

**Code Garden** transforms beginner programming frustration into structured academic mastery. When first-year engineering students encounter Python exceptions, traditional compilers output cryptic, red terminal stack traces that intimidate beginners and cause early abandonment.

Code Garden intercepts compiler errors and maps them to **botanical parasites** attached to an interactive **Code Tree**:
- Syntactic and boundary mistakes sprout diagnosable caterpillars, fungal blights, and strangler vines.
- Clicking a parasite initiates a **3-tier Socratic dialogue** that guides students through problem-solving without leaking answers.
- Keystroke trajectories are etched into **concentric tree rings (dendrochronology)**.
- College professors can monitor student cognitive flow and export official **20-Mark Continuous Assessment Sheets (CAS)** formatted for Moodle LMS and university ERPs.

---

## 👥 Founding Team & Academic Context

- **Course**: `MDMIE03` – Innovation Management & Scaling Startups
- **Evaluation**: Presentation 2 (25 ISA Marks)
- **Class / Division**: Third-Year Computer Engineering (`TE-C`) · October 2026

| Founding Member | Roll Number | Role | Core Responsibility |
| :--- | :--- | :--- | :--- |
| **Atharva Tayade** | `24102C0018` | Product & Engine Lead | AST Parser, State Machine & Sandbox Engine |
| **Parth Phatak** | `24102C0084` | Curriculum & Pilot Lead | MU/SPPU Lab Manual Alignment & Faculty LMS Module |
| **Rutuja Darade** | `25102C2010` | Testing & Analytics Lead | Telemetry, Scaffolding Guardrails & Continuous Assessment |

---

## 🔍 The Problem & Empirical Evidence

### Observed Pain Points (Slide 3):
- *"Compiler error stack traces look like gibberish; LeetCode is intimidating, and watching YouTube videos does not help me clear lab vivas."*
- **11 of 14 observed students** quit within 6 minutes on traditional terminal compilers.
- **78% of syntax abandonments** stemmed specifically from loop index and boundary confusion.
- **Cognitive Fatigue**: Peaked at 12 minutes of continuous debugging, prompting our redesign into 8-minute micro-sprints.

### The A/B Growth Experiment (Slide 8):
- **Hypothesis**: Titling challenges after official university lab practicals (rather than generic game quests) will lift 3-day repeat practice completion by 40% due to urgent academic relevance.
- **Cohort Tested**: 40 FE-CMPN Undergraduates (20 Control, 20 Test).
- **Result**: **65% repeat rate** on the syllabus-mapped cohort vs. **28% on generic quests** (**+132% lift**).

---

## 🌿 Core Platform Pillars

### 1. The Living Code Tree (Visual AST)
- Located at [`components/TreeCanvas.tsx`](components/TreeCanvas.tsx) and powered by [`lib/treeEngine.ts`](lib/treeEngine.ts).
- As students write correct code, AST nodes fuel tree growth across 4 distinct botanical stages:
  1. **Seedling** (0–49 XP)
  2. **Sprout** (50–99 XP)
  3. **Sapling** (100–149 XP)
  4. **Blossoming Tree** (150+ XP)
- Features a **calibrated HP Floor (20 HP)** to prevent demoralization while maintaining learning accountability.

### 2. Visual Bug Parasites (Zero Intimidating Traces)
Instead of red terminal errors, runtime exceptions attach anatomically to the tree:
- 🐛 **Caterpillar (`ParasiteType.CATERPILLAR`)**: Appears on branch tips for `IndexError` and loop boundary violations.
- 🍄 **Fungal Blight (`ParasiteType.FUNGAL_BLIGHT`)**: Appears at branch junctions for `ZeroDivisionError` and `TypeError`.
- 🌿 **Strangler Vine (`ParasiteType.STRANGLER_VINE`)**: Wraps the central trunk when code triggers an infinite loop or execution timeout (>2.5s).

### 3. Calibrated 3-Tier Socratic AI Fading
Implemented in [`lib/scaffoldingEngine.ts`](lib/scaffoldingEngine.ts) with strict pedagogical guardrails:
- **Tier 1 (Socratic Question)**: Formulates an investigative question without mentioning code keywords.
- **Tier 2 (Logic Blueprint)**: Delivers a 3-step structural pseudocode plan.
- **Tier 3 (Code Skeleton)**: Provides a fill-in-the-blanks template (`___`).
- **Zero-Tolerance Redactor**: Automatically sanitizes working functions and blocks complete code disclosure.

### 4. Dendrochronology Rings (Authentic Growth)
- Located at [`components/DendrochronologyVisualizer.tsx`](components/DendrochronologyVisualizer.tsx) and [`lib/dendrochronologyEngine.ts`](lib/dendrochronologyEngine.ts).
- Logs an authentic trajectory of problem-solving attempts:
  - **Wide Lush Green Rings**: Flawless, clean test passes.
  - **Thin Dark Rings**: Conquered bugs and resolved compiler exceptions.
  - **Drought / Thrashing Patterns**: Consecutive compilation failures occurring within < 45 seconds.
  - **Interactive Scrubbing Slider**: Allows students and professors to replay the attempt history step-by-step.

### 5. University Lab Synchronized Practicals
Fully synchronized with Mumbai University & SPPU First-Year Computer Engineering syllabi ([`lib/curriculumData.ts`](lib/curriculumData.ts)):
1. **`MU_Python_Exp_01`**: Variable Swap & Formatted Output (`/learn/variable-swap-print`)
2. **`MU_Python_Exp_02`**: Pass/Fail Conditional Grade Evaluation (`/learn/pass-fail-boundary`)
3. **`MU_Python_Exp_03`**: Range Accumulator & Loop Logic (`/learn/accumulator-loop`)
4. **`MU_Python_Exp_04`**: ZeroDivision Defensive Exception Guard (`/learn/nested-loop-matrix`)
5. **`MU_Python_Exp_05`**: Bounded List Traversal & Boundary Guard (`/learn/string-slicing-filter`)
6. **`MU_Python_Exp_06`**: String Slicing & Palindrome Verification (`/learn/recursive-tree-branch`)
7. **`MU_Python_Exp_07`**: Modular Functions & Recursion Logic (`/learn/dictionary-lookup-safe`)

### 6. Faculty Continuous Assessment (LMS Gradebook)
- Route: [`app/faculty/page.tsx`](app/faculty/page.tsx) | Component: [`components/FacultyDashboard.tsx`](components/FacultyDashboard.tsx).
- Computes internal marks matching the official **Mumbai University & SPPU Continuous Internal Assessment (CAS)** 20-mark rubric:
  - **Practical Implementation (10 Marks)**: Evaluated based on test passes and AST bugs remediated.
  - **Viva & Understanding (5 Marks)**: Scaled by student independence (full marks if Hint Ratio $< 25\%$).
  - **Discipline & Timely Completion (5 Marks)**: Scaled by active vs. idle cognitive flow time.
- **University LMS (CSV) Export**: Generates RFC 4180-compliant CSV files ready for Moodle Gradebook and ERP import.

---

## 📈 Traction, Growth & Guardrail Metrics

| Metric | Target / Guardrail | Observed Cohort Performance | Purpose |
| :--- | :--- | :--- | :--- |
| **North Star Metric** | 15 Conquered Bugs / User | **13.7 Conquered Bugs / User** | Measures true misconception remediation over passive screen time. |
| **Critical Guardrail** | **Hint Dependency Ratio $< 25\%$** | **18.0% Class Average** | Ensures students solve challenges independently without copy-pasting hints. |
| **Cognitive Flow Time** | $\ge 60\%$ Active Ratio | **76% Active Engagement (38m active / 12m idle)** | Tracks focus and prevents students from idling or getting stuck in loops. |
| **Cohort Retention Lift** | $+40\%$ Repeat Rate | **$+132\%$ Lift (65% vs 28%)** | Proves high academic relevance drives sustained student retention. |

---

## 🛡️ System Architecture & Sandbox Security

Code Garden executes untrusted student Python code safely using a multi-tiered security perimeter ([`lib/pythonRunner.ts`](lib/pythonRunner.ts)):
1. **Pre-Flight Static AST & Regex Inspection**: Rejects forbidden modules (`os`, `sys`, `subprocess`, `socket`, `shutil`) and dangerous builtins (`eval`, `exec`, `open`, `compile`) before execution.
2. **Deterministic Watchdog Timeout**: A strict 2.5–3.5s timeout prevents infinite while loops or CPU starvation.
3. **Execution Sandbox**: Runs in isolated containers with non-root privileges, read-only file access, and `--net=none` disabled networking.

---

## 🧪 Automated Test Suite (51/51 Passing)

All platform features are covered by comprehensive unit and integration tests:

```bash
npm test
```

```text
====================================================
  Code Garden Test Suite Results
====================================================
✓ Phase 1 Engine Tests (HP degradation, stages, bug lifecycles)   [12/12 PASS]
✓ Phase 2 Python Runner Tests (Sandbox timeout, security blocks)    [6/6 PASS]
✓ Phase 3 Scaffolding Tests (3-tier hint fading, solution strip)    [6/6 PASS]
✓ Phase 4 Dendrochronology Tests (Rings, thrashing detection)       [5/5 PASS]
✓ Phase 5 Parasite Diagnostics Tests (AST localization, prompts)  [15/15 PASS]
✓ Phase 6 Faculty Analytics & LMS Tests (CAS rubrics, CSV RFC4180)  [7/7 PASS]
----------------------------------------------------
TOTAL: 51 / 51 TESTS PASSED (100% GREEN)
```

Individual test runners:
- `npm run test:engine`
- `npm run test:runner`
- `npm run test:scaffolding`
- `npm run test:dendro`
- `npm run test:parasites`
- `npm run test:faculty`

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- [npm](https://www.npmjs.com/) (v9.0.0 or later)
- Python 3.10+ (for local Python execution environment)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AtharvaTayade2005/CodeGarden.git
   cd CodeGarden
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   - **Student Adventure Portal**: `http://localhost:3000`
   - **Interactive Coding Workspace**: `http://localhost:3000/learn/variable-swap-print`
   - **Faculty Dashboard & LMS Export**: `http://localhost:3000/faculty`

---

## 📂 Repository Structure

```text
CodeGarden/
├── app/
│   ├── layout.tsx                     # Root layout & Google Fonts integration
│   ├── globals.css                    # Design tokens & retro 3D button styling
│   ├── page.tsx                       # Codédex-inspired adventure landing page
│   ├── faculty/
│   │   └── page.tsx                   # Dedicated Faculty Portal route
│   ├── learn/
│   │   └── [exerciseId]/page.tsx      # Dynamic lab exercise route
│   └── api/
│       ├── execute/route.ts           # Python code runner API
│       └── hint/route.ts              # 3-tier Socratic hint generator API
├── components/
│   ├── TreeCanvas.tsx                 # Botanical Code Tree SVG engine & parasites
│   ├── DendrochronologyVisualizer.tsx # Cross-section tree rings & time-lapse
│   ├── DiagnosticTerminal.tsx         # Socratic error guidance terminal
│   ├── FacultyDashboard.tsx           # Professor dashboard, filters & CAS export
│   └── LearnWorkspaceClient.tsx       # Integrated student IDE workspace
├── lib/
│   ├── treeEngine.ts                  # AST tree state, HP floor & parasite models
│   ├── pythonRunner.ts                # Sandbox runner & security regex
│   ├── scaffoldingEngine.ts           # 3-tier fading Socratic guidance
│   ├── dendrochronologyEngine.ts      # Tree ring state machine & telemetry
│   ├── curriculumData.ts              # MU/SPPU First-Year Lab Exercises
│   └── facultyAnalytics.ts            # Continuous Assessment marks & CSV generator
├── public/
│   └── hero-garden-pixel.jpg          # 16-bit retro hero meadow illustration
└── tests/
    ├── test_engine.ts                 # Botanical tree engine tests
    ├── test_runner.ts                 # Python sandbox security tests
    ├── test_scaffolding.ts            # Socratic hint & solution stripping tests
    ├── test_dendrochronology.ts       # Tree ring & thrashing state tests
    ├── test_parasites.ts              # Visual bug parasite localization tests
    └── test_faculty_analytics.ts      # Faculty LMS continuous assessment tests
```

---

## 📜 License & Institutional Attribution

This project is submitted for academic assessment under **MDMIE03: Innovation Management & Scaling Startups** at the Department of Computer Engineering, University of Mumbai.

Developed with pride by **Atharva Tayade**, **Parth Phatak**, and **Rutuja Darade** (Class: TE-C · 2026).
All rights reserved © 2026 Code Garden.
