'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import { FormField } from '@/components/ui/FormField';
import { DevStateLens, type DevStateOption } from '@/components/ui/DevStateLens';
import {
  getCurrentUser,
  updateProfile,
  getActiveSessions,
  revokeSession,
  signOutEverywhere,
  getNotificationPreferences,
  updateNotificationPreferences,
  SAMPLE_USER,
  SAMPLE_SESSIONS,
  SAMPLE_NOTIFICATION_PREFERENCES,
  type UserSession,
  type NotificationPreferences,
} from '@/lib/api/users';
import { RateLimitedError, ServiceUnavailableError, ApiError } from '@/lib/api/client';
import type { User } from '@/lib/api/types';
import { parseZuriDate } from '@/lib/api/dates';

// ============================================================================
// Types & Helper Models
// ============================================================================

type DataSourceMode = 'live' | 'sample';

interface RateLimitState {
  isLimited: boolean;
  secondsRemaining: number;
  message?: string;
}

interface ServiceUnavailableState {
  isUnavailable: boolean;
  message?: string;
}

export default function SettingsPage() {
  const firstNameId = useId();
  const lastNameId = useId();
  const schoolId = useId();
  const departmentId = useId();
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();
  const emailFrequencyId = useId();
  const quietStartId = useId();
  const quietEndId = useId();

  // Dev state & Data source
  const [dataSource, setDataSource] = useState<DataSourceMode>('live');
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  // Simulated errors for DevStateLens
  const [simulatedError, setSimulatedError] = useState<'none' | '429' | '503' | 'empty_sessions'>('none');

  // Loading States
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);

  // Global Error & Banner States
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    isLimited: false,
    secondsRemaining: 0,
  });
  const [serviceState, setServiceState] = useState<ServiceUnavailableState>({
    isUnavailable: false,
  });

  // User Profile State
  const [user, setUser] = useState<User | null>(null);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    school: '',
    department: '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Sessions State
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [isSigningOutEverywhere, setIsSigningOutEverywhere] = useState(false);
  const [showSignOutAllModal, setShowSignOutAllModal] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [sessionsSuccessMessage, setSessionsSuccessMessage] = useState<string | null>(null);

  // Notification Preferences State
  const [preferences, setPreferences] = useState<NotificationPreferences>(SAMPLE_NOTIFICATION_PREFERENCES);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferencesSuccessMessage, setPreferencesSuccessMessage] = useState<string | null>(null);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);

  // Rate limit countdown timer
  useEffect(() => {
    if (!rateLimitState.isLimited || rateLimitState.secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setRateLimitState((prev) => {
        if (prev.secondsRemaining <= 1) {
          return { isLimited: false, secondsRemaining: 0 };
        }
        return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimitState.isLimited, rateLimitState.secondsRemaining]);

  // Handle typed errors
  const handleGenericError = useCallback((err: unknown, fallbackMessage: string): string => {
    if (err instanceof RateLimitedError) {
      const remaining = err.resetTime
        ? Math.max(1, Math.ceil(err.resetTime - Date.now() / 1000))
        : 30;
      setRateLimitState({
        isLimited: true,
        secondsRemaining: remaining,
        message: err.message || `Rate limit reached. Please wait ${remaining}s before retrying.`,
      });
      return `Rate limit exceeded. Try again in ${remaining}s.`;
    }

    if (err instanceof ServiceUnavailableError) {
      setServiceState({
        isUnavailable: true,
        message: err.message || 'Downstream service is temporarily unavailable (circuit breaker open).',
      });
      return 'Service temporarily unavailable. Please retry shortly.';
    }

    if (err instanceof ApiError) {
      return err.message;
    }

    if (err instanceof Error) {
      return err.message;
    }

    return fallbackMessage;
  }, []);

  // Fetch initial profile
  const loadUser = useCallback(async (mode: DataSourceMode) => {
    setIsLoadingUser(true);
    setProfileError(null);

    if (simulatedError === '429') {
      setIsLoadingUser(false);
      setRateLimitState({ isLimited: true, secondsRemaining: 25, message: 'Simulated 429 Rate Limit' });
      return;
    }
    if (simulatedError === '503') {
      setIsLoadingUser(false);
      setServiceState({ isUnavailable: true, message: 'Simulated 503 Circuit Breaker Open' });
      return;
    }

    if (mode === 'sample') {
      setUser(SAMPLE_USER);
      setProfileForm({
        firstName: SAMPLE_USER.first_name || '',
        lastName: SAMPLE_USER.last_name || '',
        school: SAMPLE_USER.school || '',
        department: SAMPLE_USER.department || '',
      });
      setIsLoadingUser(false);
      return;
    }

    try {
      const data = await getCurrentUser();
      setUser(data);
      setProfileForm({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        school: data.school || '',
        department: data.department || '',
      });
    } catch (err) {
      const msg = handleGenericError(err, 'Failed to load user profile');
      setProfileError(msg);
      // Fallback to sample user in development if live call fails
      if (process.env.NODE_ENV !== 'production') {
        setUser(SAMPLE_USER);
        setProfileForm({
          firstName: SAMPLE_USER.first_name || '',
          lastName: SAMPLE_USER.last_name || '',
          school: SAMPLE_USER.school || '',
          department: SAMPLE_USER.department || '',
        });
      }
    } finally {
      setIsLoadingUser(false);
    }
  }, [handleGenericError, simulatedError]);

  // Fetch active sessions
  const loadSessions = useCallback(async (mode: DataSourceMode) => {
    setIsLoadingSessions(true);
    setSessionsError(null);

    if (simulatedError === 'empty_sessions') {
      setSessions([SAMPLE_SESSIONS[0]]); // Only current session
      setIsLoadingSessions(false);
      return;
    }

    if (mode === 'sample') {
      setSessions(SAMPLE_SESSIONS);
      setIsLoadingSessions(false);
      return;
    }

    try {
      const data = await getActiveSessions();
      setSessions(data);
    } catch (err) {
      const msg = handleGenericError(err, 'Failed to load active sessions');
      setSessionsError(msg);
      if (process.env.NODE_ENV !== 'production') {
        setSessions(SAMPLE_SESSIONS);
      }
    } finally {
      setIsLoadingSessions(false);
    }
  }, [handleGenericError, simulatedError]);

  // Fetch notification preferences
  const loadPreferences = useCallback(async (mode: DataSourceMode) => {
    setIsLoadingPreferences(true);
    setPreferencesError(null);

    if (mode === 'sample') {
      setPreferences(SAMPLE_NOTIFICATION_PREFERENCES);
      setIsLoadingPreferences(false);
      return;
    }

    try {
      const data = await getNotificationPreferences();
      setPreferences(data);
    } catch (err) {
      const msg = handleGenericError(err, 'Failed to load notification preferences');
      setPreferencesError(msg);
      if (process.env.NODE_ENV !== 'production') {
        setPreferences(SAMPLE_NOTIFICATION_PREFERENCES);
      }
    } finally {
      setIsLoadingPreferences(false);
    }
  }, [handleGenericError]);

  // Primary loader triggered when data source or simulated error changes
  useEffect(() => {
    loadUser(dataSource);
    loadSessions(dataSource);
    loadPreferences(dataSource);
  }, [dataSource, loadUser, loadSessions, loadPreferences]);

  // ============================================================================
  // Action Handlers
  // ============================================================================

  // 1. Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccessMessage(null);

    try {
      if (dataSource === 'sample') {
        await new Promise((r) => setTimeout(r, 600));
        setUser((prev) =>
          prev
            ? {
                ...prev,
                first_name: profileForm.firstName,
                last_name: profileForm.lastName,
                full_name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
                school: profileForm.school,
                department: profileForm.department,
              }
            : null
        );
      } else {
        const updated = await updateProfile({
          first_name: profileForm.firstName,
          last_name: profileForm.lastName,
          school: profileForm.school,
          department: profileForm.department,
        });
        setUser(updated);
      }
      setProfileSuccessMessage('Profile information saved successfully.');
      setTimeout(() => setProfileSuccessMessage(null), 4000);
    } catch (err) {
      const msg = handleGenericError(err, 'Unable to update profile');
      setProfileError(msg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 2. Change Password
  const passwordCriteria = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    symbol: /[^A-Za-z0-9]/.test(newPassword),
  };
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const passwordsMatch = newPassword === confirmPassword;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setPasswordError('Please satisfy all password criteria before submitting.');
      return;
    }
    if (!passwordsMatch) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccessMessage(null);

    try {
      if (dataSource === 'sample') {
        await new Promise((r) => setTimeout(r, 700));
      } else {
        const res = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          if (res.status === 429) {
            throw new RateLimitedError(data.message || 'Rate limited', data.retryAfter);
          }
          if (res.status === 503) {
            throw new ServiceUnavailableError(data.message || 'Service unavailable');
          }
          throw new ApiError(res.status, data.message || 'Password update failed');
        }
      }

      setPasswordSuccessMessage('Your password has been changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMessage(null), 5000);
    } catch (err) {
      const msg = handleGenericError(err, 'Failed to change password');
      setPasswordError(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 3. Revoke Session
  const handleRevokeSession = async (sessionId: string) => {
    setRevokingSessionId(sessionId);
    setSessionsError(null);

    try {
      if (dataSource === 'sample') {
        await new Promise((r) => setTimeout(r, 500));
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } else {
        await revokeSession(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      }
      setSessionsSuccessMessage('Session revoked successfully.');
      setTimeout(() => setSessionsSuccessMessage(null), 3000);
    } catch (err) {
      const msg = handleGenericError(err, 'Failed to revoke session');
      setSessionsError(msg);
    } finally {
      setRevokingSessionId(null);
    }
  };

  // 4. Sign Out Everywhere
  const handleSignOutEverywhere = async () => {
    setIsSigningOutEverywhere(true);
    setSessionsError(null);

    try {
      if (dataSource === 'sample') {
        await new Promise((r) => setTimeout(r, 800));
        setSessions((prev) => prev.filter((s) => s.isCurrent));
      } else {
        await signOutEverywhere();
        // Redirect to login after remote revocation
        window.location.href = '/institution/login';
        return;
      }
      setShowSignOutAllModal(false);
      setSessionsSuccessMessage('All other active sessions have been terminated.');
      setTimeout(() => setSessionsSuccessMessage(null), 4000);
    } catch (err) {
      const msg = handleGenericError(err, 'Failed to terminate all sessions');
      setSessionsError(msg);
    } finally {
      setIsSigningOutEverywhere(false);
    }
  };

  // 5. Notification Preferences Update
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPreferences(true);
    setPreferencesError(null);
    setPreferencesSuccessMessage(null);

    try {
      if (dataSource === 'sample') {
        await new Promise((r) => setTimeout(r, 500));
      } else {
        const updated = await updateNotificationPreferences({
          push_enabled: preferences.pushEnabled,
          email_enabled: preferences.emailEnabled,
          email_frequency: preferences.emailFrequency,
          quiet_hours_start: preferences.quietHoursStart,
          quiet_hours_end: preferences.quietHoursEnd,
          timezone: preferences.timezone,
          notify_on_quiz_completion: preferences.notifyOnQuizCompletion,
          notify_on_streak_achievement: preferences.notifyOnStreakAchievement,
          notify_on_goal_completion: preferences.notifyOnGoalCompletion,
          notify_on_material_processed: preferences.notifyOnMaterialProcessed,
          notify_on_study_reminder: preferences.notifyOnStudyReminder,
        });
        setPreferences(updated);
      }
      setPreferencesSuccessMessage('Notification settings updated.');
      setTimeout(() => setPreferencesSuccessMessage(null), 4000);
    } catch (err) {
      const msg = handleGenericError(err, 'Failed to update preferences');
      setPreferencesError(msg);
    } finally {
      setIsSavingPreferences(false);
    }
  };

  // DevStateLens Options
  const devStateOptions: DevStateOption[] = [
    {
      id: 'live_data',
      label: 'Data: Live Gateway API',
      onClick: () => {
        setSimulatedError('none');
        setDataSource('live');
        setRateLimitState({ isLimited: false, secondsRemaining: 0 });
        setServiceState({ isUnavailable: false });
      },
    },
    {
      id: 'sample_data',
      label: 'Data: Sample Mock Payload',
      onClick: () => {
        setSimulatedError('none');
        setDataSource('sample');
        setRateLimitState({ isLimited: false, secondsRemaining: 0 });
        setServiceState({ isUnavailable: false });
      },
    },
    {
      id: 'sim_429',
      label: 'Simulate 429 Rate Limit (25s)',
      onClick: () => {
        setSimulatedError('429');
        setRateLimitState({
          isLimited: true,
          secondsRemaining: 25,
          message: 'Simulated 429 Rate Limit. Please wait before retrying.',
        });
      },
    },
    {
      id: 'sim_503',
      label: 'Simulate 503 Circuit Breaker',
      onClick: () => {
        setSimulatedError('503');
        setServiceState({
          isUnavailable: true,
          message: 'Simulated 503 Circuit Breaker. Downstream gateway cluster isolated.',
        });
      },
    },
    {
      id: 'sim_empty_sessions',
      label: 'Simulate Single / Empty Sessions',
      onClick: () => {
        setSimulatedError('empty_sessions');
        loadSessions('sample');
      },
    },
  ];

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl">
      {/* 429 Rate Limit Countdown Banner */}
      {rateLimitState.isLimited && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/40 text-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-2xl animate-pulse">timer</span>
            <div>
              <h4 className="font-semibold text-sm text-amber-100">Rate Limit Exceeded (HTTP 429)</h4>
              <p className="text-xs text-amber-300/90 mt-0.5">
                {rateLimitState.message || 'Too many requests dispatched.'} Retrying enabled in{' '}
                <span className="font-mono font-bold text-amber-200 text-sm">{rateLimitState.secondsRemaining}s</span>
              </p>
            </div>
          </div>
          <button
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 transition-colors cursor-pointer"
            onClick={() => setRateLimitState({ isLimited: false, secondsRemaining: 0 })}
            type="button"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 503 Circuit Breaker Banner */}
      {serviceState.isUnavailable && (
        <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400 text-2xl">cloud_off</span>
            <div>
              <h4 className="font-semibold text-sm text-red-100">Downstream Service Unavailable (HTTP 503)</h4>
              <p className="text-xs text-red-300/90 mt-0.5">
                {serviceState.message || 'Downstream gateway circuit breaker open. Backend undergoing automatic failover.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-100 transition-colors cursor-pointer flex items-center gap-1"
              onClick={() => {
                setServiceState({ isUnavailable: false });
                loadUser(dataSource);
                loadSessions(dataSource);
                loadPreferences(dataSource);
              }}
              type="button"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Retry
            </button>
            <button
              className="text-xs font-semibold px-2 py-1.5 text-red-300 hover:text-red-100 transition-colors cursor-pointer"
              onClick={() => setServiceState({ isUnavailable: false })}
              type="button"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-space-md">
        {/* Main Header with Institutional Context */}
        <div className="pb-4 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold">
              Institution Settings
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1">
              Configure institutional parameters, security credentials, active sessions, and communication preferences.
            </p>
          </div>

          {/* Dev-Only Live / Sample Badge */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-container-high/80 border border-outline-variant/50 p-1.5 rounded-full shadow-xs">
              <span className="text-[10px] font-label-caps uppercase tracking-wider text-on-surface-variant px-2 font-semibold">
                Source:
              </span>
              <button
                className={`text-[11px] font-ui-functional font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                  dataSource === 'live'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
                onClick={() => setDataSource('live')}
                title="Switch to Live Gateway Calls"
                type="button"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200"></span>
                Live
              </button>
              <button
                className={`text-[11px] font-ui-functional font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                  dataSource === 'sample'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
                onClick={() => setDataSource('sample')}
                title="Switch to Sample Data"
                type="button"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-200"></span>
                Sample
              </button>
            </div>
          )}
        </div>

        {/* Existing SSO & Data Privacy Institutional Cards (Preserved) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-gutter)] mt-2">
          <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-xl p-5 flex flex-col gap-3">
            <h2 className="font-serif text-lg font-bold text-primary">Single Sign-On (SSO) Federation</h2>
            <p className="text-xs text-on-surface-variant/80">
              InCommon / Shibboleth SAML 2.0 Identity Provider configuration for Oxford SSO.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-semibold text-primary">InCommon Active (99.8% Sync)</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-xl p-5 flex flex-col gap-3">
            <h2 className="font-serif text-lg font-bold text-primary">Data Privacy & Retention</h2>
            <p className="text-xs text-on-surface-variant/80">
              Governs student interaction telemetry and AI supervision data retention schedules.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-mono bg-surface-container px-2 py-1 rounded text-on-surface">
                365 Day Audit Log Retention
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* ACCOUNT & SECURITY SECTION */}
        {/* ==================================================================== */}

        <div className="mt-8 pt-6 border-t border-outline-variant/30 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-2xl">shield_person</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">Account & Security</h2>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant/80 mt-1">
                Manage personal profile details, authentication password, active devices, and notifications.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/25 self-start">
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-surface-container-highest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveTab('profile')}
                type="button"
              >
                Profile & Details
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-surface-container-highest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveTab('security')}
                type="button"
              >
                Password & Sessions
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'bg-surface-container-highest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveTab('notifications')}
                type="button"
              >
                Preferences & Quiet Hours
              </button>
            </div>
          </div>

          {/* TAB 1: PROFILE FORM */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card Form */}
              <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/25 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/20">
                  <div>
                    <h3 className="font-serif text-base font-bold text-primary">Personal & Academic Profile</h3>
                    <p className="text-xs text-on-surface-variant/80 mt-0.5">
                      Information associated with your institutional administrator account.
                    </p>
                  </div>
                  {isLoadingUser && (
                    <span className="material-symbols-outlined text-primary animate-spin text-lg">sync</span>
                  )}
                </div>

                {profileSuccessMessage && (
                  <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                    <span>{profileSuccessMessage}</span>
                  </div>
                )}

                {profileError && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400 text-base">error</span>
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="First Name">
                      <input
                        id={firstNameId}
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        disabled={isLoadingUser || isSavingProfile}
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                        placeholder="First Name"
                        required
                      />
                    </FormField>

                    <FormField label="Last Name">
                      <input
                        id={lastNameId}
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        disabled={isLoadingUser || isSavingProfile}
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                        placeholder="Last Name"
                        required
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="School / College / Institution">
                      <input
                        id={schoolId}
                        type="text"
                        value={profileForm.school}
                        onChange={(e) => setProfileForm({ ...profileForm, school: e.target.value })}
                        disabled={isLoadingUser || isSavingProfile}
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                        placeholder="e.g. Oxford University / School of Medicine"
                      />
                    </FormField>

                    <FormField label="Department / Faculty Division">
                      <input
                        id={departmentId}
                        type="text"
                        value={profileForm.department}
                        onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                        disabled={isLoadingUser || isSavingProfile}
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                        placeholder="e.g. Computer Science & AI"
                      />
                    </FormField>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isLoadingUser || isSavingProfile || rateLimitState.isLimited}
                      className="bg-primary text-on-primary font-ui-functional font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {isSavingProfile && (
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      )}
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Read-Only Account Details Card */}
              <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-primary mb-1">Identity & Scope</h3>
                  <p className="text-xs text-on-surface-variant/80 mb-4">
                    Cryptographic tokens and governance roles assigned by your institution.
                  </p>

                  <div className="space-y-3">
                    <div className="bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/20">
                      <div className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Email Address
                      </div>
                      <div className="text-xs font-mono font-medium text-on-surface mt-1 flex items-center gap-1.5">
                        <span>{user?.email || 'admin@veritas.edu.ng'}</span>
                        <span className="material-symbols-outlined text-emerald-500 text-sm" title="Verified Email">
                          verified
                        </span>
                      </div>
                    </div>

                    <div className="bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/20">
                      <div className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Administrative Role
                      </div>
                      <div className="mt-1">
                        <span className="inline-block bg-primary/10 text-primary border border-primary/25 text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize">
                          {user?.role?.replace('_', ' ') || 'Institution Admin'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/20">
                      <div className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Default Timezone
                      </div>
                      <div className="text-xs text-on-surface mt-1">
                        {user?.timezone || 'Africa/Lagos (UTC+1)'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20 text-[11px] text-on-surface-variant/70 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>Institutional permissions verified by RS256 token</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASSWORD & SESSIONS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Row 1: Change Password Card */}
              <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-2xl p-6 shadow-xs">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary text-xl">password</span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-primary">Change Password</h3>
                      <p className="text-xs text-on-surface-variant/80">
                        Update your credential. Must satisfy strict security criteria (8+ characters, uppercase, number, symbol).
                      </p>
                    </div>
                  </div>

                  {passwordSuccessMessage && (
                    <div className="my-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg p-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                      <span>{passwordSuccessMessage}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="my-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg p-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-400 text-base">error</span>
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                    <FormField label="Current Password">
                      <div className="relative">
                        <input
                          id={currentPasswordId}
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          disabled={isChangingPassword}
                          className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 pr-10 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Enter your existing password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showCurrentPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </FormField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="New Password">
                        <div className="relative">
                          <input
                            id={newPasswordId}
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isChangingPassword}
                            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 pr-10 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            placeholder="At least 8 chars"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {showNewPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </FormField>

                      <FormField label="Confirm New Password">
                        <input
                          id={confirmPasswordId}
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isChangingPassword}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-1 ${
                            confirmPassword && !passwordsMatch
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-outline-variant/40 focus:border-primary focus:ring-primary'
                          }`}
                          placeholder="Repeat new password"
                          required
                        />
                      </FormField>
                    </div>

                    {/* Criteria Checklist */}
                    <div className="bg-surface-container-low/70 border border-outline-variant/20 rounded-xl p-3.5 space-y-2">
                      <div className="text-[11px] font-semibold text-on-surface uppercase tracking-wider mb-1">
                        Password Criteria Checklist:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`material-symbols-outlined text-base ${
                              passwordCriteria.length ? 'text-emerald-500' : 'text-on-surface-variant/40'
                            }`}
                          >
                            {passwordCriteria.length ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span className={passwordCriteria.length ? 'text-on-surface font-medium' : 'text-on-surface-variant/70'}>
                            8+ characters
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`material-symbols-outlined text-base ${
                              passwordCriteria.uppercase ? 'text-emerald-500' : 'text-on-surface-variant/40'
                            }`}
                          >
                            {passwordCriteria.uppercase ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span className={passwordCriteria.uppercase ? 'text-on-surface font-medium' : 'text-on-surface-variant/70'}>
                            At least one uppercase letter (A-Z)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`material-symbols-outlined text-base ${
                              passwordCriteria.number ? 'text-emerald-500' : 'text-on-surface-variant/40'
                            }`}
                          >
                            {passwordCriteria.number ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span className={passwordCriteria.number ? 'text-on-surface font-medium' : 'text-on-surface-variant/70'}>
                            At least one number (0-9)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`material-symbols-outlined text-base ${
                              passwordCriteria.symbol ? 'text-emerald-500' : 'text-on-surface-variant/40'
                            }`}
                          >
                            {passwordCriteria.symbol ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span className={passwordCriteria.symbol ? 'text-on-surface font-medium' : 'text-on-surface-variant/70'}>
                            At least one symbol (!@#$%^&*)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={
                          isChangingPassword ||
                          !isPasswordValid ||
                          !passwordsMatch ||
                          !currentPassword ||
                          rateLimitState.isLimited
                        }
                        className="bg-primary text-on-primary font-ui-functional font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {isChangingPassword && (
                          <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        )}
                        <span>Update Password</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Row 2: Sessions List */}
              <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-outline-variant/20 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">devices</span>
                      <h3 className="font-serif text-base font-bold text-primary">Active Sessions & Devices</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant/80 mt-0.5">
                      Devices currently authorized with valid refresh tokens.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => loadSessions(dataSource)}
                      disabled={isLoadingSessions}
                      className="p-1.5 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs flex items-center gap-1 cursor-pointer"
                      title="Refresh session list"
                    >
                      <span className={`material-symbols-outlined text-sm ${isLoadingSessions ? 'animate-spin' : ''}`}>
                        refresh
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSignOutAllModal(true)}
                      disabled={isSigningOutEverywhere || sessions.length <= 1}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>Sign Out Everywhere</span>
                    </button>
                  </div>
                </div>

                {sessionsSuccessMessage && (
                  <div className="my-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                    <span>{sessionsSuccessMessage}</span>
                  </div>
                )}

                {sessionsError && (
                  <div className="my-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400 text-base">error</span>
                    <span>{sessionsError}</span>
                  </div>
                )}

                {/* Loading Skeleton */}
                {isLoadingSessions ? (
                  <div className="py-6 space-y-3">
                    {[1, 2].map((n) => (
                      <div
                        key={n}
                        className="bg-surface-container-low/50 animate-pulse rounded-xl p-4 flex items-center justify-between border border-outline-variant/15"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container-high/80"></div>
                          <div className="space-y-2">
                            <div className="w-36 h-3.5 bg-surface-container-high/80 rounded"></div>
                            <div className="w-48 h-2.5 bg-surface-container-high/60 rounded"></div>
                          </div>
                        </div>
                        <div className="w-16 h-7 bg-surface-container-high/60 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : sessions.length === 0 ? (
                  /* Empty State */
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
                      devices_off
                    </span>
                    <h4 className="text-sm font-semibold text-on-surface">No Active Sessions</h4>
                    <p className="text-xs text-on-surface-variant/80 mt-1 max-w-sm">
                      There are no active devices recorded for this account.
                    </p>
                  </div>
                ) : (
                  /* Sessions List */
                  <div className="divide-y divide-outline-variant/15 mt-2">
                    {sessions.map((sess) => {
                      const parsedLastActive = parseZuriDate(sess.lastActiveAt);
                      const displayDate = parsedLastActive
                        ? parsedLastActive.toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : sess.lastActiveAt;

                      return (
                        <div
                          key={sess.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="p-2 rounded-xl bg-surface-container text-primary border border-outline-variant/20 mt-0.5">
                              <span className="material-symbols-outlined text-xl">
                                {sess.deviceType === 'mobile'
                                  ? 'smartphone'
                                  : sess.deviceType === 'tablet'
                                  ? 'tablet'
                                  : 'laptop_mac'}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs sm:text-sm text-on-surface">
                                  {sess.deviceName}
                                </span>
                                {sess.isCurrent && (
                                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    This Device
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-on-surface-variant/80 mt-0.5 flex flex-wrap items-center gap-x-2">
                                <span>{sess.browser}</span>
                                <span>•</span>
                                <span>{sess.os}</span>
                                <span>•</span>
                                <span className="font-mono">{sess.ipAddress}</span>
                                {sess.location && (
                                  <>
                                    <span>•</span>
                                    <span>{sess.location}</span>
                                  </>
                                )}
                              </p>
                              <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
                                Last active: {displayDate}
                              </p>
                            </div>
                          </div>

                          <div className="self-end sm:self-center">
                            {sess.isCurrent ? (
                              <span className="text-[11px] font-medium text-on-surface-variant/60 italic pr-2">
                                Current active session
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRevokeSession(sess.id)}
                                disabled={revokingSessionId === sess.id}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                              >
                                {revokingSessionId === sess.id ? (
                                  <span className="material-symbols-outlined text-sm animate-spin">
                                    progress_activity
                                  </span>
                                ) : (
                                  <span className="material-symbols-outlined text-[14px]">close</span>
                                )}
                                <span>Revoke</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATION PREFERENCES & QUIET HOURS */}
          {activeTab === 'notifications' && (
            <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-2xl p-6 shadow-xs max-w-3xl">
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">notifications_active</span>
                    <h3 className="font-serif text-base font-bold text-primary">Notification Preferences & Quiet Hours</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant/80 mt-0.5">
                    Customize your alerts, delivery channels, and scheduled quiet hours.
                  </p>
                </div>
                {isLoadingPreferences && (
                  <span className="material-symbols-outlined text-primary animate-spin text-lg">sync</span>
                )}
              </div>

              {preferencesSuccessMessage && (
                <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg p-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                  <span>{preferencesSuccessMessage}</span>
                </div>
              )}

              {preferencesError && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg p-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-base">error</span>
                  <span>{preferencesError}</span>
                </div>
              )}

              <form onSubmit={handleSavePreferences} className="space-y-6">
                {/* Delivery Channels */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider">Communication Channels</div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/20">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-on-surface">Push Notifications</div>
                      <div className="text-[11px] text-on-surface-variant/80">
                        Receive instant browser and desktop alerts.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.pushEnabled}
                        onChange={(e) => setPreferences({ ...preferences, pushEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/20">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-on-surface">Email Notifications</div>
                      <div className="text-[11px] text-on-surface-variant/80">
                        Receive critical administrative alerts and digests.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.emailEnabled}
                        onChange={(e) => setPreferences({ ...preferences, emailEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <FormField label="Email Digest Cadence">
                    <select
                      id={emailFrequencyId}
                      value={preferences.emailFrequency}
                      onChange={(e) => setPreferences({ ...preferences, emailFrequency: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="immediate">Immediate (Real-time alert dispatch)</option>
                      <option value="daily_digest">Daily Digest (Summarized at 08:00)</option>
                      <option value="weekly_digest">Weekly Digest (Monday morning)</option>
                    </select>
                  </FormField>
                </div>

                {/* Quiet Hours Section */}
                <div className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant/25 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-lg">bedtime</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-primary">Quiet Hours Policy</h4>
                      <p className="text-[11px] text-on-surface-variant/80">
                        Non-critical alerts are held and dispatched after the quiet window closes.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Quiet Hours Start (Hour)">
                      <select
                        id={quietStartId}
                        value={preferences.quietHoursStart}
                        onChange={(e) =>
                          setPreferences({ ...preferences, quietHoursStart: parseInt(e.target.value, 10) })
                        }
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                      >
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={i}>
                            {String(i).padStart(2, '0')}:00 {i >= 12 ? 'PM' : 'AM'}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Quiet Hours End (Hour)">
                      <select
                        id={quietEndId}
                        value={preferences.quietHoursEnd}
                        onChange={(e) =>
                          setPreferences({ ...preferences, quietHoursEnd: parseInt(e.target.value, 10) })
                        }
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                      >
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={i}>
                            {String(i).padStart(2, '0')}:00 {i >= 12 ? 'PM' : 'AM'}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <div className="text-[11px] text-on-surface-variant/70 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>
                      Window: {String(preferences.quietHoursStart).padStart(2, '0')}:00 to{' '}
                      {String(preferences.quietHoursEnd).padStart(2, '0')}:00 ({preferences.timezone || 'UTC'})
                    </span>
                  </div>
                </div>

                {/* Event Notification Toggles */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider">Administrative Event Alerts</div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                      <span className="text-xs text-on-surface">Material Ingestion & AI Processing Ready</span>
                      <input
                        type="checkbox"
                        checked={preferences.notifyOnMaterialProcessed}
                        onChange={(e) =>
                          setPreferences({ ...preferences, notifyOnMaterialProcessed: e.target.checked })
                        }
                        className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                      <span className="text-xs text-on-surface">Student Quiz Completion & Submissions</span>
                      <input
                        type="checkbox"
                        checked={preferences.notifyOnQuizCompletion}
                        onChange={(e) =>
                          setPreferences({ ...preferences, notifyOnQuizCompletion: e.target.checked })
                        }
                        className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                      <span className="text-xs text-on-surface">Syllabus Goal & Milestone Attainment</span>
                      <input
                        type="checkbox"
                        checked={preferences.notifyOnGoalCompletion}
                        onChange={(e) =>
                          setPreferences({ ...preferences, notifyOnGoalCompletion: e.target.checked })
                        }
                        className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingPreferences || rateLimitState.isLimited}
                    className="bg-primary text-on-primary font-ui-functional font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isSavingPreferences && (
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    )}
                    <span>Save Preferences</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Sign Out Everywhere */}
      {showSignOutAllModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="font-serif text-lg font-bold text-on-surface">Sign Out from All Devices?</h3>
            </div>
            <p className="text-xs text-on-surface-variant/90 leading-relaxed">
              This will revoke all active refresh tokens and terminate all sessions across all phones, tablets, and desktop
              browsers. You will be redirected to the login screen.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignOutAllModal(false)}
                disabled={isSigningOutEverywhere}
                className="text-xs font-semibold px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOutEverywhere}
                disabled={isSigningOutEverywhere}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isSigningOutEverywhere && (
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                )}
                <span>Confirm Sign Out All</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DevStateLens Floating Controls in Development Mode */}
      <DevStateLens
        label="Account & Security Lens"
        options={devStateOptions}
        activeId={
          simulatedError === '429'
            ? 'sim_429'
            : simulatedError === '503'
            ? 'sim_503'
            : simulatedError === 'empty_sessions'
            ? 'sim_empty_sessions'
            : dataSource === 'live'
            ? 'live_data'
            : 'sample_data'
        }
        onSelect={() => {}}
      />
    </div>
  );
}
