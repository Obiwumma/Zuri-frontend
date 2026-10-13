/**
 * Timetable & Document Extraction API Module
 *
 * Mock stub implementation housing document ingestion pipeline data,
 * OCR/LLM extracted academic event records, and verification metrics.
 * Mocks extracted from: src/app/(institution)/extraction/page.tsx (lines 130-600)
 */

import { ENDPOINTS } from './endpoints';
import type {
  ExtractionDocument,
  ExtractedEventRecord,
  ExtractionMetrics,
} from './types';

export const MOCK_EXTRACTION_METRICS: ExtractionMetrics = {
  ingestedSourcesCount: 42,
  cachedReUseEfficiencyPct: 88.4,
  verificationAccuracyPct: 97.2,
  pendingReviewCount: 3,
};

export const MOCK_EXTRACTION_DOCUMENTS: ExtractionDocument[] = [
  {
    id: 'doc-1',
    title: 'Balliol & Christ Church Michaelmas Exam Timetable',
    filename: 'Balliol_ChCh_Michaelmas_Exam_Timetable.pdf',
    format: 'pdf',
    fileSizeBytes: 4404019,
    fileSizeFormatted: '4.2 MB',
    ingestedTime: 'Today, 09:14 AM',
    ingestedBy: 'Registry Desk',
    division: 'Humanities & MPLS',
    status: 'Needs Review',
    confidencePct: 78,
    isCached: false,
    hasAmbiguity: true,
    flagDescription: 'Venue & room allocation ambiguities requiring dean/tutor verification',
    extractedRecordsCount: 14,
  },
  {
    id: 'doc-2',
    title: 'MPLS Engineering Lecture Matrix v4.pdf',
    filename: 'MPLS_Engineering_Lecture_Matrix_v4.pdf',
    format: 'pdf',
    fileSizeBytes: 2936012,
    fileSizeFormatted: '2.8 MB',
    ingestedTime: 'Yesterday, 16:40 PM',
    ingestedBy: 'Senior Proctor',
    division: 'MPLS Division',
    status: 'Complete',
    confidencePct: 99,
    isCached: true,
    hasAmbiguity: false,
    extractedRecordsCount: 28,
  },
  {
    id: 'doc-3',
    title: 'Balliol WhatsApp Schedule Bulletin • Week 7.txt',
    filename: 'Balliol_WhatsApp_Bulletin_Wk7.txt',
    format: 'txt',
    fileSizeBytes: 184320,
    fileSizeFormatted: '180 KB',
    ingestedTime: '2 days ago',
    ingestedBy: 'Senior Tutor Desk',
    division: 'Humanities Division',
    status: 'Complete',
    confidencePct: 94,
    isCached: false,
    hasAmbiguity: false,
    extractedRecordsCount: 8,
  },
  {
    id: 'doc-4',
    title: 'Christ Church Divinity Hall Rosters.pdf',
    filename: 'Christ_Church_Divinity_Hall_Rosters.pdf',
    format: 'pdf',
    fileSizeBytes: 5347737,
    fileSizeFormatted: '5.1 MB',
    ingestedTime: '18 Nov 2024',
    ingestedBy: 'Academic Administrator',
    division: 'Humanities Division',
    status: 'Complete',
    confidencePct: 98,
    isCached: true,
    hasAmbiguity: false,
    extractedRecordsCount: 22,
  },
  {
    id: 'doc-5',
    title: "St John's College Michaelmas Exam Roll.pdf",
    filename: 'St_Johns_Michaelmas_Exam_Roll.pdf',
    format: 'pdf',
    fileSizeBytes: 6501171,
    fileSizeFormatted: '6.2 MB',
    ingestedTime: 'Just now',
    ingestedBy: 'College Academic Office',
    division: 'Medical Sciences',
    status: 'Processing',
    confidencePct: 62,
    isCached: false,
    hasAmbiguity: false,
    extractedRecordsCount: 0,
  },
];

export const MOCK_EXTRACTED_EVENTS: Record<string, ExtractedEventRecord[]> = {
  'doc-1': [
    {
      id: 'evt-101',
      date: 'Thursday, 28 November 2024',
      courseCode: 'ENG-320',
      courseTitle: 'Advanced Fluid Dynamics',
      sittingTime: '09:30 – 12:30 GMT',
      durationHours: 3.0,
      venue: 'Examination Schools, Hall 3 (South Annex)',
      venueConfidence: '78% Low Confidence',
      isVenueFlagged: true,
      chiefExaminer: 'Prof. A. Montgomery',
      invigilators: 'Dr. H. Vance / Dr. K. Shaw',
      candidatesCount: 48,
      notes: 'Candidates must wear subfusc with caps. Desks 1-48 arranged in alphabetical order.',
    },
  ],
};

/**
 * Retrieves the list of uploaded timetable schedules, collegiate notices, and syllabi.
 */
// TODO(real): GET /api/v1/materials
export async function getExtractionDocuments(): Promise<ExtractionDocument[]> {
  // Uses ENDPOINTS.materials.list / byId when transitioning to live gateway calls
  return Promise.resolve([...MOCK_EXTRACTION_DOCUMENTS]);
}

/**
 * Retrieves metadata for a single ingested document by its identifier.
 */
// TODO(real): GET /api/v1/materials/:id
export async function getExtractionDocumentById(id: string): Promise<ExtractionDocument | null> {
  const doc = MOCK_EXTRACTION_DOCUMENTS.find((d) => d.id === id) || null;
  return Promise.resolve(doc ? { ...doc } : null);
}

/**
 * Retrieves structured timetable event records synthesized by Lexi from the document.
 */
// TODO(real): GET /api/v1/materials/:id
export async function getExtractedEventRecords(docId: string): Promise<ExtractedEventRecord[]> {
  const events = MOCK_EXTRACTED_EVENTS[docId] || MOCK_EXTRACTED_EVENTS['doc-1'] || [];
  return Promise.resolve([...events]);
}

/**
 * Retrieves aggregate ingestion pipeline KPIs (accuracy, re-use efficiency, pending triage).
 */
// TODO(real): GET /api/v1/ai/jobs
export async function getExtractionMetrics(): Promise<ExtractionMetrics> {
  // Uses ENDPOINTS.ai.jobs when transitioning to live gateway calls
  return Promise.resolve({ ...MOCK_EXTRACTION_METRICS });
}
