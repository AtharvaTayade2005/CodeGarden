/**
 * Code Garden - Automated Test Suite: Theory Deck & Achievement Sharing System
 * Tests concepts data model, milestone badge evaluation, LinkedIn share intents,
 * and GitHub embeddable SVG badges.
 */

import { CONCEPTS_DATA, getConceptById, getConceptForExercise } from '../src/data/concepts';
import {
  MILESTONE_BADGES,
  getBadgeById,
  evaluateUnlockedBadges,
  generateLinkedInShareUrl,
  generateCelebratoryText,
  generateGitHubBadgeMarkdown,
  generateBadgeSvg,
} from '../src/data/badges';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✗ [FAIL] ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ [PASS] ${message}`);
}

console.log('====================================================');
console.log('  Running Code Garden Theory & Badges Test Suite');
console.log('====================================================\n');

// ----------------------------------------------------
// Test Group 1: Foundational Programming Theory Deck
// ----------------------------------------------------
console.log('Test 1: Foundational Concepts Data Model Integrity');

assert(CONCEPTS_DATA.length >= 5, '1a. Contains at least 5 foundational programming topics');

const requiredTopicIds = [
  'input-output',
  'variables-data-types',
  'conditional-logic',
  'loops-iteration',
  'functions-modularity',
];

for (const topicId of requiredTopicIds) {
  const topic = getConceptById(topicId);
  assert(!!topic, `1b. Found required topic '${topicId}'`);
  assert(topic!.title.length > 0, `1c. Topic '${topicId}' has a descriptive title`);
  assert(topic!.theory.length > 20, `1d. Topic '${topicId}' has concise intuition theory`);
  assert(topic!.syntax.includes('\n') || topic!.syntax.length > 10, `1e. Topic '${topicId}' contains formatted syntax structure`);
  assert(topic!.runnableExample.length > 10, `1f. Topic '${topicId}' contains a runnable minimal example`);
  assert(topic!.expectedOutput.length > 0, `1g. Topic '${topicId}' contains expected stdout output`);
}

// Exercise to Concept Mapping
const exp1Concept = getConceptForExercise('variable-swap-print', 'Variables & Tuples');
assert(exp1Concept.id === 'variables-data-types' || exp1Concept.id === 'input-output', '1h. Variable swap maps to Variables or I/O concept');

const exp2Concept = getConceptForExercise('pass-fail-boundary', 'if/else Conditionals');
assert(exp2Concept.id === 'conditional-logic', '1i. Pass/fail boundary maps to conditional logic');

const exp3Concept = getConceptForExercise('accumulator-loop', 'Loops & Iterations');
assert(exp3Concept.id === 'loops-iteration', '1j. Range accumulator maps to loops iteration');

console.log('\nTest 2: Achievement Badge Engine & Milestone Evaluation');

// ----------------------------------------------------
// Test Group 2: Achievement Badges & Milestones
// ----------------------------------------------------
const syntaxSurvivor = getBadgeById('syntax-survivor');
const controlFlow = getBadgeById('control-flow-conquered');
const vivaReady = getBadgeById('viva-ready');

assert(!!syntaxSurvivor, '2a. Syntax Survivor badge is defined');
assert(!!controlFlow, '2b. Control Flow Conquered badge is defined');
assert(!!vivaReady, '2c. Viva Ready badge is defined');

// Progress Milestone evaluation
const initialBadges = evaluateUnlockedBadges([]);
assert(initialBadges.length === 0, '2d. Fresh student has zero unlocked badges initially');

const afterExp1 = evaluateUnlockedBadges(['variable-swap-print']);
assert(afterExp1.some((b) => b.id === 'syntax-survivor'), '2e. Completing Exp 1 unlocks "Syntax Survivor" badge');

const afterExp2 = evaluateUnlockedBadges(['variable-swap-print', 'pass-fail-boundary']);
assert(afterExp2.some((b) => b.id === 'control-flow-conquered'), '2f. Completing Conditionals unlocks "Control Flow Conquered" badge');
assert(afterExp2.some((b) => b.id === 'viva-ready'), '2g. Completing 2 practicals unlocks "Viva Ready" badge');

const bugSlayer = evaluateUnlockedBadges([], { conqueredBugsCount: 2 });
assert(bugSlayer.some((b) => b.id === 'parasite-slayer'), '2h. Resolving compiler exceptions unlocks "Parasite Slayer" badge');

console.log('\nTest 3: Viral Distribution Loops (LinkedIn & GitHub)');

// ----------------------------------------------------
// Test Group 3: Viral Sharing (LinkedIn & GitHub)
// ----------------------------------------------------
const shareUrl = 'https://codegarden.app/learn/accumulator-loop';
const linkedInUrl = generateLinkedInShareUrl(shareUrl);

assert(linkedInUrl.startsWith('https://www.linkedin.com/sharing/share-offsite/?url='), '3a. Generates valid LinkedIn Web Share intent URL');
assert(linkedInUrl.includes(encodeURIComponent(shareUrl)), '3b. URL parameter is properly URI encoded');

const celebratoryText = generateCelebratoryText(controlFlow!, 'Nested Loops');
assert(celebratoryText.includes('#CodeGarden'), '3c. Celebratory text contains #CodeGarden hashtag');
assert(celebratoryText.includes('Python'), '3d. Celebratory text mentions Python');

const githubMarkdown = generateGitHubBadgeMarkdown('student_101', 'control-flow-conquered', 'https://codegarden.app');
assert(githubMarkdown.includes('https://codegarden.app/api/badges/student_101/control-flow-conquered.svg'), '3e. Generates standard embeddable markdown with SVG badge source');
assert(githubMarkdown.startsWith('[![Code Garden Progress]('), '3f. Markdown conforms to GitHub shield/badge syntax');

const svgMarkup = generateBadgeSvg(controlFlow!, 'student_101');
assert(svgMarkup.startsWith('<svg'), '3g. Produces valid SVG markup starting with <svg');
assert(svgMarkup.includes('Control Flow Conquered'), '3h. SVG includes badge title');
assert(svgMarkup.includes('Mumbai Univ'), '3i. SVG includes University Module');
assert(svgMarkup.includes('VERIFIED PASS 100%'), '3j. SVG includes verified completion status');

console.log('\n====================================================');
console.log('  ALL THEORY & BADGES TEST SUITES PASSED! (20/20)');
console.log('====================================================\n');
