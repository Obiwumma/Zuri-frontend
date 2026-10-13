/**
 * Students API Module
 *
 * Mock stub implementation housing existing student cohort data.
 * Mocks extracted from: src/app/(institution)/students/page.tsx (lines 40-185)
 */

import type { StudentRecord } from './types';

export const MOCK_STUDENTS: StudentRecord[] = [
  {
    id: 'OX-948201',
    name: 'Clara Holloway',
    email: 'clara.holloway@balliol.ox.ac.uk',
    college: 'Balliol College',
    matriculationId: 'OX-948201',
    division: 'MPLS',
    department: 'Engineering Science',
    moduleCode: 'ENG-320',
    moduleTitle: 'Fluid Dynamics',
    level: 'UG Finals (Year 3)',
    status: 'Active Matriculated',
    engagementLabel: 'Optimal (98%)',
    engagementPct: 98,
    engagementDetail: '14 Quizzes',
    tutor: 'Prof. C. Ravenscroft, FRS',
    matriculationYear: 'Michaelmas 2022 (Cohort 24)',
  },
  {
    id: 'OX-882104',
    name: 'Alistair Montgomery',
    email: 'alistair.montgomery@chch.ox.ac.uk',
    college: 'Christ Church',
    matriculationId: 'OX-882104',
    division: 'Humanities',
    department: 'Faculty of History',
    moduleCode: 'HIST-204',
    moduleTitle: 'Imperial Diplomacy',
    level: 'UG Prelims (Year 1)',
    status: 'Active Matriculated',
    engagementLabel: 'Diagnostic Review',
    engagementPct: 48,
    engagementDetail: 'Sub-threshold',
    tutor: 'Dr. H. Trevor-Roper',
    matriculationYear: 'Michaelmas 2024 (Cohort 26)',
  },
  {
    id: 'OX-729015',
    name: 'Dr. Priya Ramachandran',
    email: 'priya.ramachandran@sjc.ox.ac.uk',
    college: "St John's College",
    matriculationId: 'OX-729015',
    division: 'Medical Sciences',
    department: 'Clinical Medicine',
    moduleCode: 'BIO-410',
    moduleTitle: 'Genomic Medicine',
    level: 'DPhil Candidate',
    status: 'Active Matriculated',
    engagementLabel: 'Exceptional (100%)',
    engagementPct: 100,
    engagementDetail: '42 Queries',
    tutor: 'Prof. S. Bhattacharya',
    matriculationYear: 'Michaelmas 2021 (Cohort 23)',
  },
  {
    id: 'OX-640192',
    name: 'Julian Sterling-Cross',
    email: 'julian.sterling-cross@magd.ox.ac.uk',
    college: 'Magdalen College',
    matriculationId: 'OX-640192',
    division: 'Humanities',
    department: 'Faculty of Philosophy',
    moduleCode: 'PHIL-101',
    moduleTitle: 'Formal Logic & Dialectic',
    level: 'UG Finals (Year 2)',
    status: 'Active Matriculated',
    engagementLabel: 'Stable (84%)',
    engagementPct: 84,
    engagementDetail: '2 Actioned',
    tutor: 'Dr. A. Kenny',
    matriculationYear: 'Michaelmas 2023 (Cohort 25)',
  },
  {
    id: 'OX-518290',
    name: 'Feng Wei',
    email: 'feng.wei@trinity.ox.ac.uk',
    college: 'Trinity College',
    matriculationId: 'OX-518290',
    division: 'MPLS',
    department: 'Mathematical Institute',
    moduleCode: 'MATH-210',
    moduleTitle: 'Linear Algebra',
    level: 'MSt Candidate',
    status: 'Active Matriculated',
    engagementLabel: 'Optimal (92%)',
    engagementPct: 92,
    engagementDetail: '0 Flags',
    tutor: 'Prof. R. Penrose',
    matriculationYear: 'Michaelmas 2024 (Cohort 26)',
  },
  {
    id: 'OX-439201',
    name: 'Beatrice de Montfort',
    email: 'beatrice.demontfort@new.ox.ac.uk',
    college: 'New College',
    matriculationId: 'OX-439201',
    division: 'Social Sciences',
    department: 'Faculty of Law',
    moduleCode: 'LAW-105',
    moduleTitle: 'Jurisprudence',
    level: 'UG Finals (Year 3)',
    status: 'Active Matriculated',
    engagementLabel: 'Pre-Class Inactive',
    engagementPct: 55,
    engagementDetail: 'Missed 2',
    tutor: 'Prof. H.L.A. Hart',
    matriculationYear: 'Michaelmas 2022 (Cohort 24)',
  },
  {
    id: 'OX-382910',
    name: 'Tarik Al-Mansoor',
    email: 'tarik.almansoor@wadham.ox.ac.uk',
    college: 'Wadham College',
    matriculationId: 'OX-382910',
    division: 'MPLS',
    department: 'Computer Science',
    moduleCode: 'CS-301',
    moduleTitle: 'Distributed Systems',
    level: 'UG Prelims (Year 1)',
    status: 'Active Matriculated',
    engagementLabel: 'High Mastery (95%)',
    engagementPct: 95,
    engagementDetail: 'Problem Set',
    tutor: 'Dr. C.A.R. Hoare',
    matriculationYear: 'Michaelmas 2024 (Cohort 26)',
  },
  {
    id: 'OX-291048',
    name: 'Eleanor Finchley-Smith',
    email: 'eleanor.finchleysmith@lmh.ox.ac.uk',
    college: 'Lady Margaret Hall',
    matriculationId: 'OX-291048',
    division: 'Humanities',
    department: 'English Faculty',
    moduleCode: 'ENG-102',
    moduleTitle: 'Old English Literature',
    level: 'UG Finals (Year 2)',
    status: 'Suspended (Leave)',
    engagementLabel: 'Interrupted Term',
    engagementPct: 15,
    engagementDetail: 'Michaelmas',
    tutor: 'Dr. J.R.R. Tolkien',
    matriculationYear: 'Michaelmas 2023 (Cohort 25)',
  },
];

/**
 * Retrieves matriculated students for the active institution scope.
 */
// TODO(real): GET /api/v1/academic/courses/:id/knowledge_state
export async function getStudents(): Promise<StudentRecord[]> {
  // Uses ENDPOINTS.academic.courseKnowledgeState when transitioning to real backend
  return Promise.resolve([...MOCK_STUDENTS]);
}

/**
 * Retrieves a single student record by their matriculation identifier or system UUID.
 */
// TODO(real): GET /api/v1/users/:id
export async function getStudentById(id: string): Promise<StudentRecord | null> {
  const student = MOCK_STUDENTS.find(
    (s) => s.id === id || s.matriculationId === id
  ) || null;
  return Promise.resolve(student ? { ...student } : null);
}
