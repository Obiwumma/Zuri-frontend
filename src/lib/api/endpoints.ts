/**
 * Zuri Backend API Endpoints Registry
 *
 * This is the ONLY place in the application where backend API paths appear.
 * Paths are verified against backend gateway routes and integration contracts.
 */

export const ENDPOINTS = {
  // Authentication & Session Endpoints
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    refresh: '/api/v1/auth/refresh',
    publicKey: '/api/v1/auth/public-key',
    forgotPassword: '/api/v1/auth/forgot-password',
    resetPassword: '/api/v1/auth/reset-password',
    verifyEmail: '/api/v1/auth/verify_email',
    resendVerification: '/api/v1/auth/resend_verification',
    logoutAll: '/api/v1/auth/logout_all',
  },

  // User Profile, Sessions & Institution Scope Endpoints
  users: {
    me: '/api/v1/users/me',
    changePassword: '/api/v1/users/me/change-password',
    memberships: '/api/v1/users/me/memberships',
    switchInstitution: '/api/v1/users/me/switch-institution',
    sessions: '/api/v1/users/me/sessions',
    sessionById: (sessionId: string) => `/api/v1/users/me/sessions/${sessionId}` as const,
  },

  // Academic Intelligence & Student Telemetry Endpoints
  academic: {
    today: '/api/v1/academic/today',
    actIntervention: (interventionId: string) =>
      `/api/v1/academic/today/interventions/${interventionId}/act` as const,
    dismissIntervention: (interventionId: string) =>
      `/api/v1/academic/today/interventions/${interventionId}/dismiss` as const,
    timetable: '/api/v1/academic/timetable',
    timetableNext: '/api/v1/academic/timetable/next',
    timetableSlots: '/api/v1/academic/timetable/slots',
    enrollCourse: '/api/v1/academic/courses/enroll',
    courseKnowledgeState: (courseId: string) =>
      `/api/v1/academic/courses/${courseId}/knowledge_state` as const,
    courseWeakTopics: (courseId: string) =>
      `/api/v1/academic/courses/${courseId}/weak_topics` as const,
    courseLecturerSignals: (courseId: string) =>
      `/api/v1/academic/courses/${courseId}/lecturer_signals` as const,
    coursePartnerChat: (courseId: string) =>
      `/api/v1/academic/courses/${courseId}/partner/chat` as const,
    coursePartnerHistory: (courseId: string) =>
      `/api/v1/academic/courses/${courseId}/partner/history` as const,
  },

  // Content Service & Course Catalog Endpoints
  courses: {
    list: '/api/v1/courses',
    byId: (courseId: string) => `/api/v1/courses/${courseId}` as const,
  },

  // Document & Learning Material Ingestion Endpoints
  materials: {
    create: '/api/v1/materials',
    byId: (materialId: string) => `/api/v1/materials/${materialId}` as const,
    webhookUploaded: '/api/v1/webhooks/material_uploaded',
  },

  // Quizzes, Assessments & Flashcards Endpoints
  quizzes: {
    list: '/api/v1/quizzes',
    start: (quizId: string) => `/api/v1/quizzes/${quizId}/start` as const,
    recordAnswer: (attemptId: string) =>
      `/api/v1/quiz_attempts/${attemptId}/answers` as const,
    completeAttempt: (attemptId: string) =>
      `/api/v1/quiz_attempts/${attemptId}/complete` as const,
    attemptById: (attemptId: string) => `/api/v1/quiz_attempts/${attemptId}` as const,
  },

  flashcards: {
    decks: '/api/v1/flashcard_decks',
    deckById: (deckId: string) => `/api/v1/flashcard_decks/${deckId}` as const,
  },

  // Institutional & Student Analytics Endpoints
  analytics: {
    studyStreak: '/api/v1/analytics/study_streak',
    studyStats: '/api/v1/analytics/study_stats',
    topicMastery: '/api/v1/analytics/topic_mastery',
    aiUsage: '/api/v1/analytics/ai_usage',
  },

  // Notification Preferences & Device Registrations
  notifications: {
    preferences: '/api/v1/notifications/preferences',
    registerDevice: '/api/v1/notifications/devices/register',
  },

  // AI Pipeline, Background Jobs & Streaming Endpoints
  ai: {
    execute: '/api/v1/ai/execute',
    executeStream: '/api/v1/ai/execute/stream',
    jobs: '/api/v1/ai/jobs',
    jobById: (jobId: string) => `/api/v1/ai/jobs/${jobId}` as const,
  },

  // Real-Time Event Sync & WebSocket Gateway
  sync: {
    state: '/api/v1/sync/state',
    ws: '/api/v1/ws',
  },
} as const;

export type Endpoints = typeof ENDPOINTS;
