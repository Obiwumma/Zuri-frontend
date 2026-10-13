/**
 * Analytics & Telemetry API Module
 *
 * Mock stub implementation housing institutional AI usage metrics and intervention telemetry.
 * Mocks extracted from:
 * - src/app/(institution)/analytics/ai-usage/page.tsx (lines 47-125)
 * - src/app/(institution)/analytics/interventions/page.tsx (lines 45-101)
 */

import type { DepartmentLedgerRow, CourseLedgerRow } from './types';

export const MOCK_DEPARTMENT_AI_USAGE: DepartmentLedgerRow[] = [
  {
    department: 'Faculty of History',
    division: 'Humanities Division',
    coursesCount: 42,
    lecturesProcessed: 312,
    syllabusCoveredPct: 94,
    quizzesGenerated: 1140,
    quizDetail: '8,240 questions',
    chatSessions: 6820,
    chatDetail: '89% undergrad reach',
    researchQueries: 4210,
    researchDetail: 'Manuscripts cited',
    totalActivity: 12482,
    activityGrowth: '+11.8%',
  },
  {
    department: 'Department of Engineering Science',
    division: 'MPLS Division',
    coursesCount: 38,
    lecturesProcessed: 284,
    syllabusCoveredPct: 91,
    quizzesGenerated: 1420,
    quizDetail: '11,400 calculations',
    chatSessions: 7940,
    chatDetail: '94% undergrad reach',
    researchQueries: 2650,
    researchDetail: 'IEEE citations indexed',
    totalActivity: 12294,
    activityGrowth: '+8.4%',
    isBrightRow: true,
  },
  {
    department: 'Medical Sciences (Clinical Medicine)',
    division: 'Medical Sciences Division',
    coursesCount: 29,
    lecturesProcessed: 360,
    syllabusCoveredPct: 98,
    quizzesGenerated: 1680,
    quizDetail: '14,200 clinical cases',
    chatSessions: 5120,
    chatDetail: '96% clinical cohorts',
    researchQueries: 3890,
    researchDetail: 'PubMed/Cochrane refs',
    totalActivity: 11050,
    activityGrowth: '+14.2%',
  },
  {
    department: 'Faculty of Philosophy',
    division: 'Humanities Division',
    coursesCount: 18,
    lecturesProcessed: 198,
    syllabusCoveredPct: 88,
    quizzesGenerated: 780,
    quizDetail: '3,900 logic premises',
    chatSessions: 4310,
    chatDetail: '82% tutorial turnout',
    researchQueries: 2140,
    researchDetail: 'Primary philosophical texts',
    totalActivity: 7428,
    activityGrowth: '+5.1%',
    isBrightRow: true,
  },
  {
    department: 'Mathematical Institute',
    division: 'MPLS Division',
    coursesCount: 34,
    lecturesProcessed: 328,
    syllabusCoveredPct: 92,
    quizzesGenerated: 820,
    quizDetail: '4,920 theorem proofs',
    chatSessions: 4460,
    chatDetail: '87% student reach',
    researchQueries: 1420,
    researchDetail: 'arXiv citation graphs',
    totalActivity: 7028,
    activityGrowth: '+9.3%',
  },
];

export const MOCK_COURSE_INTERVENTIONS: CourseLedgerRow[] = [
  {
    title: 'Late Imperial Diplomacy',
    code: 'HIST-204 • Michaelmas Option',
    department: 'Faculty of History',
    interventions: 482,
    accepted: 418,
    rate: '86.7%',
    isHighRate: true,
    trend: '+6.2% Wk/Wk',
    isTrendUp: true,
  },
  {
    title: 'Cellular Signalling & Genomic Medicine',
    code: 'BIO-410 • Advanced Core',
    department: 'Medical Sciences Division',
    interventions: 540,
    accepted: 442,
    rate: '81.8%',
    isHighRate: true,
    trend: '+3.5% Wk/Wk',
    isTrendUp: true,
  },
  {
    title: 'Formal Logic & Dialectic',
    code: 'PHIL-101 • Introductory Mods',
    department: 'Faculty of Philosophy',
    interventions: 398,
    accepted: 322,
    rate: '80.9%',
    isHighRate: true,
    trend: '+8.1% Wk/Wk',
    isTrendUp: true,
  },
  {
    title: 'Advanced Fluid Dynamics & Navier-Stokes',
    code: 'ENG-320 • Part II Specialization',
    department: 'Department of Engineering Science',
    interventions: 315,
    accepted: 230,
    rate: '73.0%',
    isHighRate: false,
    trend: 'Steady',
    isTrendUp: false,
  },
  {
    title: 'Linear Algebra & Matrix Decompositions',
    code: 'MATH-210 • Year 2 Foundation',
    department: 'Mathematical Institute',
    interventions: 610,
    accepted: 458,
    rate: '75.1%',
    isHighRate: true,
    trend: '+1.8% Wk/Wk',
    isTrendUp: true,
  },
];

/**
 * Retrieves department-level AI query volume, quiz generations, and model reach.
 */
// TODO(real): GET /api/v1/analytics/ai_usage
export async function getDepartmentAiUsageLedger(): Promise<DepartmentLedgerRow[]> {
  // Uses ENDPOINTS.analytics.aiUsage when transitioning to live gateway calls
  return Promise.resolve([...MOCK_DEPARTMENT_AI_USAGE]);
}

/**
 * Retrieves pedagogical interventions, prerequisite alerts, and acceptance rates across courses.
 */
// TODO(real): GET /api/v1/academic/today
export async function getCourseInterventionsLedger(): Promise<CourseLedgerRow[]> {
  // Uses ENDPOINTS.academic.today when transitioning to live gateway calls
  return Promise.resolve([...MOCK_COURSE_INTERVENTIONS]);
}
