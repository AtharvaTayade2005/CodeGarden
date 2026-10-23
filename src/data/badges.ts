/**
 * Code Garden - Achievement Badge & Viral Distribution Engine
 * Defines milestone badges, LinkedIn web share intents, and GitHub showcase markdown embeds.
 */

export interface AchievementBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
  secondaryColor: string;
  universityModule: string;
  description: string;
  criteriaSummary: string;
  celebratoryQuote: string;
  unlockedAt?: number;
}

export const MILESTONE_BADGES: AchievementBadge[] = [
  {
    id: 'syntax-survivor',
    name: 'Syntax Survivor',
    icon: '🌱',
    color: '#10b981',
    secondaryColor: '#059669',
    universityModule: 'Mumbai Univ Exp 01: Variables & Input/Output',
    description:
      'Completed foundational Input/Output, Tuple Assignment, and Variable Swapping without fatal compiler crashes.',
    criteriaSummary: 'Pass Lab Experiment 01 (variable-swap-print)',
    celebratoryQuote:
      '🌱 Just mastered foundational Python Input/Output & Variables on Code Garden! No more fatal syntax errors. Ready for semester practicals! #CodeGarden #Python #Engineering #LearnInPublic',
  },
  {
    id: 'control-flow-conquered',
    name: 'Control Flow Conquered',
    icon: '⚡',
    color: '#f59e0b',
    secondaryColor: '#d97706',
    universityModule: 'Mumbai Univ Exp 02 & 03: Control Structures & Loops',
    description:
      'Conquered branching conditionals (if/elif/else) and iterative loops without falling into off-by-one or infinite loop traps.',
    criteriaSummary: 'Pass Lab Experiments 02 or 03 (pass-fail-boundary or accumulator-loop)',
    celebratoryQuote:
      '⚡ Just conquered Python conditionals & loops on Code Garden! Diagnosed and resolved all AST boundary bugs. Ready for semester practicals! #CodeGarden #Python #Engineering #LearnInPublic',
  },
  {
    id: 'viva-ready',
    name: 'Viva Ready',
    icon: '🎓',
    color: '#8b5cf6',
    secondaryColor: '#6d28d9',
    universityModule: 'Mumbai Univ / SPPU FE-CMPN Laboratory Manual',
    description:
      'Cleared full university lab practical modules with optimal Socratic independence (<25% hint dependency ratio).',
    criteriaSummary: 'Achieve verified completion across university lab curriculum modules',
    celebratoryQuote:
      '🎓 Officially Viva Ready! Cleared university Python engineering practicals on Code Garden with a healthy code tree and <25% AI hint dependency. #CodeGarden #Engineering #Python #MumbaiUniversity',
  },
  {
    id: 'parasite-slayer',
    name: 'Parasite Slayer',
    icon: '🐛',
    color: '#38bdf8',
    secondaryColor: '#0284c7',
    universityModule: 'AST Diagnostic Profiling Engine',
    description:
      'Diagnosed and cured botanical bug parasites (Caterpillar, Fungal Blight, Strangler Vine) attached to code tree nodes.',
    criteriaSummary: 'Remediate runtime compiler exceptions into flourishing growth rings',
    celebratoryQuote:
      '🐛 Cured AST bug parasites in my Python code tree on Code Garden! Turned compiler errors into living foliage. #CodeGarden #Python #Debugging #CleanCode',
  },
];

/**
 * Retrieve all available badges
 */
export function getAllMilestoneBadges(): AchievementBadge[] {
  return MILESTONE_BADGES;
}

/**
 * Retrieve badge by unique ID
 */
export function getBadgeById(badgeId: string): AchievementBadge | undefined {
  return MILESTONE_BADGES.find((b) => b.id === badgeId);
}

/**
 * Evaluates which badges should be unlocked based on student progress
 */
export function evaluateUnlockedBadges(
  completedExerciseIds: string[],
  stats: { conqueredBugsCount?: number; hintsUsed?: number; totalAttempts?: number } = {}
): AchievementBadge[] {
  const unlocked: AchievementBadge[] = [];

  // Syntax Survivor: Completed Exp 1
  if (completedExerciseIds.includes('variable-swap-print')) {
    unlocked.push(MILESTONE_BADGES[0]);
  }

  // Control Flow Conquered: Completed Exp 2 or Exp 3
  if (completedExerciseIds.includes('pass-fail-boundary') || completedExerciseIds.includes('accumulator-loop')) {
    unlocked.push(MILESTONE_BADGES[1]);
  }

  // Viva Ready: Completed 2 or more experiments or any advanced experiment
  if (
    completedExerciseIds.length >= 2 ||
    completedExerciseIds.includes('nested-loop-matrix') ||
    completedExerciseIds.includes('recursive-tree-branch')
  ) {
    unlocked.push(MILESTONE_BADGES[2]);
  }

  // Parasite Slayer: Conquered at least 1 bug
  if ((stats.conqueredBugsCount ?? 0) > 0) {
    unlocked.push(MILESTONE_BADGES[3]);
  }

  return unlocked;
}

/**
 * Generate LinkedIn Web Share Intent URL
 */
export function generateLinkedInShareUrl(shareUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
}

/**
 * Pre-generate celebratory clipboard text for LinkedIn
 */
export function generateCelebratoryText(badge: AchievementBadge, customModuleTitle?: string): string {
  if (badge.id === 'control-flow-conquered') {
    return '🌱 Just mastered foundational Python control flow & loops on Code Garden! Diagnosed and resolved all AST boundary bugs. Ready for semester practicals! #CodeGarden #Python #Engineering #LearnInPublic';
  }
  if (badge.id === 'syntax-survivor') {
    return `🌱 Just mastered foundational Python syntax & variables on Code Garden (${customModuleTitle || 'MU Exp 01'})! Clean AST passes and zero fatal crashes. #CodeGarden #Python #Engineering #LearnInPublic`;
  }
  return badge.celebratoryQuote;
}

/**
 * Generate Embeddable GitHub Markdown Snippet
 */
export function generateGitHubBadgeMarkdown(
  userId: string,
  badgeId: string,
  originUrl = 'https://codegarden.app'
): string {
  return `[![Code Garden Progress](${originUrl}/api/badges/${userId}/${badgeId}.svg)](${originUrl})`;
}

/**
 * Generate an authentic SVG string for GitHub showcase embeds
 */
export function generateBadgeSvg(badge: AchievementBadge, userId = 'student'): string {
  const width = 420;
  const height = 130;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a140e"/>
      <stop offset="100%" stop-color="#112217"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${badge.color}"/>
      <stop offset="100%" stop-color="${badge.secondaryColor}"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Card Background -->
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="14" fill="url(#bgGrad)" stroke="${badge.color}" stroke-opacity="0.35" stroke-width="2"/>

  <!-- Left Accent Stripe -->
  <rect x="2" y="2" width="6" height="${height - 4}" rx="3" fill="url(#badgeGrad)"/>

  <!-- Icon Circle -->
  <circle cx="50" cy="50" r="26" fill="${badge.color}" fill-opacity="0.15" stroke="${badge.color}" stroke-width="1.5"/>
  <text x="50" y="58" font-family="'Segoe UI', -apple-system, sans-serif" font-size="24" text-anchor="middle">${badge.icon}</text>

  <!-- Platform Brand & Status -->
  <text x="90" y="32" font-family="'Segoe UI', -apple-system, sans-serif" font-size="11" font-weight="700" fill="#34d399" letter-spacing="1">CODE GARDEN • VERIFIED LAB MASTERY</text>

  <!-- Badge Name -->
  <text x="90" y="56" font-family="'Segoe UI', -apple-system, sans-serif" font-size="18" font-weight="800" fill="#ffffff">${badge.name}</text>

  <!-- University Module -->
  <text x="90" y="76" font-family="'Segoe UI', -apple-system, sans-serif" font-size="11.5" fill="#9ca3af">${badge.universityModule}</text>

  <!-- Verified Pill Status -->
  <rect x="90" y="90" width="135" height="22" rx="6" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1"/>
  <circle cx="102" cy="101" r="4" fill="#10b981"/>
  <text x="112" y="105" font-family="'Segoe UI', -apple-system, sans-serif" font-size="10" font-weight="700" fill="#34d399">VERIFIED PASS 100%</text>

  <!-- Student Watermark -->
  <text x="${width - 18}" y="105" font-family="'Segoe UI', -apple-system, sans-serif" font-size="9.5" fill="#4b5563" text-anchor="end">ID: ${userId} • MU CAS</text>
</svg>`;
}
