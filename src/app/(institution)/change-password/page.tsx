'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstitutionChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMessage('Current password is incorrect or session has expired.');
        } else if (res.status === 429) {
          setErrorMessage(data?.message || 'Too many attempts. Please wait before retrying.');
        } else if (res.status === 503) {
          setErrorMessage('Password service is temporarily unavailable. Please retry shortly.');
        } else {
          setErrorMessage(data?.message || 'Failed to change password. Please verify requirements.');
        }
        return;
      }

      setSuccessMessage('Password changed successfully! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-surface-container rounded-lg border border-outline-variant shadow-sm">
      <h1 className="text-xl font-bold text-primary mb-2">Change Password</h1>
      <p className="text-sm text-on-surface-variant mb-6">
        A password change is required for your account before proceeding.
      </p>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 p-3 rounded text-sm bg-error-container/20 border border-error-container/40 text-on-surface flex items-start gap-2"
        >
          <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mb-4 p-3 rounded text-sm bg-secondary-container/20 border border-secondary-container/40 text-on-surface flex items-start gap-2"
        >
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="current-pw">
            Current Password
          </label>
          <input
            id="current-pw"
            type="password"
            required
            disabled={isLoading}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface text-sm rounded border border-outline-variant focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="new-pw">
            New Password (minimum 8 characters)
          </label>
          <input
            id="new-pw"
            type="password"
            required
            disabled={isLoading}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface text-sm rounded border border-outline-variant focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="confirm-pw">
            Confirm New Password
          </label>
          <input
            id="confirm-pw"
            type="password"
            required
            disabled={isLoading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface text-sm rounded border border-outline-variant focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-block w-full text-center py-2 px-4 bg-primary text-on-primary rounded font-medium text-sm transition-opacity disabled:opacity-60 cursor-pointer mt-2"
        >
          {isLoading ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
