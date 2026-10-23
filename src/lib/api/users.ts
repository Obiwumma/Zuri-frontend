/**
 * Users, Account & Notification Preferences API Module
 *
 * Implements live Gateway communication for user profile, active sessions,
 * and notification preferences according to contract-verified.md.
 */

import { apiClient, ApiError, RateLimitedError, ServiceUnavailableError } from './client';
import { ENDPOINTS } from './endpoints';
import type { User, ApiResponse } from './types';

export interface UserSession {
  id: string;
  deviceName: string;
  deviceType: string;
  os: string;
  browser: string;
  ipAddress: string;
  location?: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface RawBackendSession {
  id: string;
  device_name?: string;
  device_type?: string;
  os?: string;
  browser?: string;
  ip_address?: string;
  location?: string;
  last_active_at?: string;
  created_at?: string;
  is_current?: boolean;
}

export interface NotificationPreferences {
  id?: string;
  userId?: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  emailFrequency: string;
  quietHoursStart: number;
  quietHoursEnd: number;
  timezone: string;
  notifyOnQuizCompletion: boolean;
  notifyOnStreakAchievement: boolean;
  notifyOnGoalCompletion: boolean;
  notifyOnMaterialProcessed: boolean;
  notifyOnStudyReminder: boolean;
}

export interface RawNotificationPreferences {
  id?: string;
  user_id?: string;
  push_enabled?: boolean;
  email_enabled?: boolean;
  email_frequency?: string;
  quiet_hours_start?: number;
  quiet_hours_end?: number;
  timezone?: string;
  notify_on_quiz_completion?: boolean;
  notify_on_streak_achievement?: boolean;
  notify_on_goal_completion?: boolean;
  notify_on_material_processed?: boolean;
  notify_on_study_reminder?: boolean;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  school?: string;
  department?: string;
  academic_level?: string;
  timezone?: string;
}

export interface UpdateNotificationPreferencesRequest {
  push_enabled?: boolean;
  email_enabled?: boolean;
  email_frequency?: string;
  quiet_hours_start?: number;
  quiet_hours_end?: number;
  timezone?: string;
  notify_on_quiz_completion?: boolean;
  notify_on_streak_achievement?: boolean;
  notify_on_goal_completion?: boolean;
  notify_on_material_processed?: boolean;
  notify_on_study_reminder?: boolean;
}

// ============================================================================
// Sample Fallback Data (Dev Only)
// ============================================================================

export const SAMPLE_USER: User = {
  id: 'usr_admin_veritas_01',
  email: 'admin@veritas.edu.ng',
  first_name: 'Adewale',
  last_name: 'Adeyemi',
  full_name: 'Adewale Adeyemi',
  school: 'Veritas University',
  department: 'Computer Science & Academic Affairs',
  academic_level: 'faculty',
  timezone: 'Africa/Lagos',
  email_verified: true,
  role: 'institution_admin',
  created_at: '2025-09-01T08:00:00Z',
};

export const SAMPLE_SESSIONS: UserSession[] = [
  {
    id: 'sess_current_chrome_win',
    deviceName: 'Chrome on Windows 11',
    deviceType: 'desktop',
    os: 'Windows 11 Pro',
    browser: 'Chrome 129.0',
    ipAddress: '197.210.54.12',
    location: 'Abuja, Nigeria',
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    isCurrent: true,
  },
  {
    id: 'sess_safari_macos',
    deviceName: 'Safari on macOS',
    deviceType: 'desktop',
    os: 'macOS Sonoma',
    browser: 'Safari 17.5',
    ipAddress: '102.89.44.18',
    location: 'Lagos, Nigeria',
    lastActiveAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    isCurrent: false,
  },
];

export const SAMPLE_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: true,
  emailFrequency: 'immediate',
  quietHoursStart: 22,
  quietHoursEnd: 7,
  timezone: 'Africa/Lagos',
  notifyOnQuizCompletion: true,
  notifyOnStreakAchievement: true,
  notifyOnGoalCompletion: true,
  notifyOnMaterialProcessed: true,
  notifyOnStudyReminder: true,
};

// ============================================================================
// Normalization Helpers
// ============================================================================

function normalizeSession(raw: RawBackendSession): UserSession {
  return {
    id: raw.id,
    deviceName: raw.device_name || 'Unknown Device',
    deviceType: raw.device_type || 'desktop',
    os: raw.os || 'Unknown OS',
    browser: raw.browser || 'Unknown Browser',
    ipAddress: raw.ip_address || '—',
    location: raw.location,
    lastActiveAt: raw.last_active_at || new Date().toISOString(),
    createdAt: raw.created_at || new Date().toISOString(),
    isCurrent: Boolean(raw.is_current),
  };
}

function normalizePreferences(raw: RawNotificationPreferences): NotificationPreferences {
  return {
    id: raw.id,
    userId: raw.user_id,
    pushEnabled: raw.push_enabled ?? true,
    emailEnabled: raw.email_enabled ?? true,
    emailFrequency: raw.email_frequency || 'immediate',
    quietHoursStart: typeof raw.quiet_hours_start === 'number' ? raw.quiet_hours_start : 22,
    quietHoursEnd: typeof raw.quiet_hours_end === 'number' ? raw.quiet_hours_end : 7,
    timezone: raw.timezone || 'UTC',
    notifyOnQuizCompletion: raw.notify_on_quiz_completion ?? true,
    notifyOnStreakAchievement: raw.notify_on_streak_achievement ?? true,
    notifyOnGoalCompletion: raw.notify_on_goal_completion ?? true,
    notifyOnMaterialProcessed: raw.notify_on_material_processed ?? true,
    notifyOnStudyReminder: raw.notify_on_study_reminder ?? true,
  };
}

// Client-side fetch helper with typed error reconstruction
async function browserFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const rawReset = res.headers.get('x-ratelimit-reset') || res.headers.get('X-RateLimit-Reset');
    const resetTime = rawReset ? parseInt(rawReset, 10) : null;
    let data: Record<string, unknown> | null = null;
    try {
      data = await res.json();
    } catch {
      // Non-JSON error
    }

    const message = (data?.message as string) || (data?.error as string) || `Request failed with HTTP ${res.status}`;

    if (res.status === 429) {
      throw new RateLimitedError(message, resetTime, data);
    }
    if (res.status === 503) {
      throw new ServiceUnavailableError(message, data);
    }
    throw new ApiError(res.status, message, {
      code: data?.code as string | undefined,
      responseBody: data,
    });
  }

  if (res.status === 204) {
    return null as T;
  }

  return (await res.json()) as T;
}

// ============================================================================
// Live API Methods
// ============================================================================

/**
 * Retrieves the current authenticated user's profile.
 * Endpoint: GET /api/v1/users/me
 */
export async function getCurrentUser(): Promise<User> {
  if (typeof window !== 'undefined') {
    const res = await browserFetch<ApiResponse<User>>('/api/user/me');
    return res.data;
  }

  const res = await apiClient.get<ApiResponse<User>>(ENDPOINTS.users.me);
  return res.data;
}

/**
 * Updates the current authenticated user's profile attributes.
 * Endpoint: PUT /api/v1/users/me
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
  if (typeof window !== 'undefined') {
    const res = await browserFetch<ApiResponse<User>>('/api/user/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  const res = await apiClient.put<ApiResponse<User>>(ENDPOINTS.users.me, data);
  return res.data;
}

/**
 * Retrieves all active sessions for the authenticated user.
 * Endpoint: GET /api/v1/users/me/sessions
 */
export async function getActiveSessions(): Promise<UserSession[]> {
  if (typeof window !== 'undefined') {
    const res = await browserFetch<ApiResponse<RawBackendSession[]>>('/api/user/sessions');
    return (res.data || []).map(normalizeSession);
  }

  const res = await apiClient.get<ApiResponse<RawBackendSession[]>>(ENDPOINTS.users.sessions);
  return (res.data || []).map(normalizeSession);
}

/**
 * Revokes a specific active user session by session ID.
 * Endpoint: DELETE /api/v1/users/me/sessions/:id
 */
export async function revokeSession(sessionId: string): Promise<{ success: boolean; message: string }> {
  if (typeof window !== 'undefined') {
    const res = await browserFetch<{ message?: string }>(`/api/user/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    return { success: true, message: res?.message || 'Session revoked successfully' };
  }

  const res = await apiClient.delete<{ message?: string }>(ENDPOINTS.users.sessionById(sessionId));
  return { success: true, message: res?.message || 'Session revoked successfully' };
}

/**
 * Signs out from all active sessions and invalidates tokens globally.
 * Endpoint: POST /api/v1/auth/logout-all
 */
export async function signOutEverywhere(): Promise<{ success: boolean; message: string }> {
  if (typeof window !== 'undefined') {
    const res = await browserFetch<{ message?: string }>('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ all: true }),
    });
    return { success: true, message: res?.message || 'Signed out from all devices' };
  }

  const res = await apiClient.post<{ message?: string }>(ENDPOINTS.auth.logoutAll);
  return { success: true, message: res?.message || 'Signed out from all devices' };
}

/**
 * Retrieves the user's notification settings and quiet hours preferences.
 * Endpoint: GET /api/v1/notifications/preferences
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  if (typeof window !== 'undefined') {
    const res = await browserFetch<RawNotificationPreferences>('/api/user/notifications');
    return normalizePreferences(res);
  }

  const res = await apiClient.get<RawNotificationPreferences>(ENDPOINTS.notifications.preferences);
  return normalizePreferences(res);
}

/**
 * Updates the user's notification settings and quiet hours preferences.
 * Endpoint: PUT /api/v1/notifications/preferences
 */
export async function updateNotificationPreferences(
  data: UpdateNotificationPreferencesRequest
): Promise<NotificationPreferences> {
  if (typeof window !== 'undefined') {
    const res = await browserFetch<RawNotificationPreferences>('/api/user/notifications', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return normalizePreferences(res);
  }

  const res = await apiClient.put<RawNotificationPreferences>(
    ENDPOINTS.notifications.preferences,
    data
  );
  return normalizePreferences(res);
}
