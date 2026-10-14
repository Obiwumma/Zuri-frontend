/**
 * Zuri Backend API Endpoints Registry
 *
 * This is the ONLY place in the application where backend API paths appear.
 * Paths are verified against backend gateway routes and integration contracts.
 * All paths use hyphens (-) conforming to the Gateway router (services/gateway/internal/handler/gateway_handler.go).
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
    verifyEmail: '/api/v1/auth/verify-email',
    resendVerification: '/api/v1/auth/resend-verification',
    logout: '/api/v1/auth/logout',
    logoutAll: '/api/v1/auth/logout-all',
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
    timetableSessions: '/api/v1/academic/timetable/sessions',
    enrollCourse: '/api/v1/academic/courses/enroll',
    enrollments: '/api/v1/academic/enrollments',
    offerings: '/api/v1/academic/offerings',
    courseKnowledgeState: (courseId: string) =>
      `/api/v1/academic/courses/${courseId}/knowledge-state` as const,
    courseWeakTopics: (courseId: string) =>
      `/api/v1/academic/courses/${courseId}/weak-topics` as const,
    courseLecturerSignals: (courseId: string) =>
      `/api/v1/academic/courses/${courseId}/lecturer-signals` as const,
    coursePartnerChat: (courseId: string) =>
      `/api/v1/academic/courses/${courseId}/partner/chat` as const,
    coursePartnerHistory: (courseId: string) =>
      `/api/v1/academic/courses/${courseId}/partner/history` as const,
    institutionHierarchy: (institutionId: string) =>
      `/api/v1/academic/institutions/${institutionId}/hierarchy` as const,
  },

  // Content Service & Course Catalog Endpoints
  courses: {
    list: '/api/v1/courses',
    byId: (courseId: string) => `/api/v1/courses/${courseId}` as const,
    materials: (courseId: string) => `/api/v1/courses/${courseId}/materials` as const,
  },

  // Document & Learning Material Ingestion Endpoints
  materials: {
    list: '/api/v1/materials',
    create: '/api/v1/materials',
    byId: (materialId: string) => `/api/v1/materials/${materialId}` as const,
    presign: (materialId: string) => `/api/v1/materials/${materialId}/presign` as const,
    webhookUploaded: '/api/v1/webhooks/material-uploaded',
  },

  // Quizzes, Assessments & Flashcards Endpoints
  quizzes: {
    list: '/api/v1/quizzes',
    byId: (quizId: string) => `/api/v1/quizzes/${quizId}` as const,
    start: (quizId: string) => `/api/v1/quizzes/${quizId}/start` as const,
    attempts: '/api/v1/quiz-attempts',
    attemptById: (attemptId: string) => `/api/v1/quiz-attempts/${attemptId}` as const,
    recordAnswer: (attemptId: string) =>
      `/api/v1/quiz-attempts/${attemptId}/answers` as const,
    completeAttempt: (attemptId: string) =>
      `/api/v1/quiz-attempts/${attemptId}/complete` as const,
  },

  flashcards: {
    decks: '/api/v1/flashcard-decks',
    deckById: (deckId: string) => `/api/v1/flashcard-decks/${deckId}` as const,
  },

  // Institutional & Student Analytics Endpoints
  analytics: {
    studyStreak: '/api/v1/analytics/study-streak',
    studyStats: '/api/v1/analytics/study-stats',
    studySessions: '/api/v1/analytics/study-sessions',
    topicMastery: '/api/v1/analytics/topic-mastery',
    topicsForReview: '/api/v1/analytics/topics-for-review',
    quizHistory: '/api/v1/analytics/quiz-history',
    goals: '/api/v1/analytics/goals',
    aiUsage: '/api/v1/analytics/ai-usage',
    aiInteractions: '/api/v1/analytics/ai-interactions',
  },

  // Notification Preferences & Device Registrations
  notifications: {
    preferences: '/api/v1/notifications/preferences',
    registerDevice: '/api/v1/notifications/devices/register',
    unregisterDevice: (token: string) => `/api/v1/notifications/devices/${token}` as const,
    reminders: '/api/v1/notifications/reminders',
    history: '/api/v1/notifications/history',
  },

  // AI Pipeline, Background Jobs & Streaming Endpoints
  ai: {
    execute: '/api/v1/ai/execute',
    executeStream: '/api/v1/ai/execute/stream',
    jobs: '/api/v1/ai/jobs',
    jobById: (jobId: string) => `/api/v1/ai/jobs/${jobId}` as const,
    costs: '/api/v1/ai/analytics/costs',
  },

  // Real-Time Event Sync & WebSocket Gateway
  sync: {
    state: '/api/v1/sync/state',
    ws: '/api/v1/ws',
    ack: '/api/v1/sync/ack',
    events: '/api/v1/sync/events',
  },
} as const;

export type Endpoints = typeof ENDPOINTS;
