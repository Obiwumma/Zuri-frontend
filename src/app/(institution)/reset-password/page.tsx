'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState(() => searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!token.trim()) {
      setErrorMessage('Reset token is required.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          token: token.trim(),
          new_password: newPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMessage(data?.message || 'Too many reset attempts. Please wait before trying again.');
        } else if (res.status === 503) {
          setErrorMessage('Reset service is temporarily unavailable. Please retry shortly.');
        } else {
          setErrorMessage(data?.message || 'Invalid or expired password reset token.');
        }
        return;
      }

      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-surface-container rounded-lg border border-outline-variant shadow-sm">
      <h1 className="text-xl font-bold text-primary mb-2">Set New Password</h1>
      <p className="text-sm text-on-surface-variant mb-6">
        Enter your recovery token and specify a new secure password.
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
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="reset-token">
            Reset Token
          </label>
          <input
            id="reset-token"
            type="text"
            required
            disabled={isLoading}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste token received in email"
            className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface text-sm rounded border border-outline-variant focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="reset-pw">
            New Password (minimum 8 characters)
          </label>
          <input
            id="reset-pw"
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
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="reset-confirm-pw">
            Confirm Password
          </label>
          <input
            id="reset-confirm-pw"
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
          className="inline-block w-full text-center py-2 px-4 bg-primary text-on-primary rounded font-medium text-sm transition-opacity disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>

        <div className="text-center mt-2">
          <Link href="/login" className="text-xs text-primary hover:underline">
            ← Return to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function InstitutionResetPasswordPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto my-12 p-6 text-center text-sm">Loading recovery console...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
