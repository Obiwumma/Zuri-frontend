'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function InstitutionForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMessage(data?.message || 'Too many recovery requests. Please wait before trying again.');
        } else if (res.status === 503) {
          setErrorMessage('Recovery service is temporarily unavailable. Please retry shortly.');
        } else {
          setErrorMessage(data?.message || 'Unable to process recovery request.');
        }
        return;
      }

      setMessage(data?.message || 'If an account matches that email, password reset instructions have been sent.');
    } catch {
      setErrorMessage('Network connection failure. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-surface-container rounded-lg border border-outline-variant shadow-sm">
      <h1 className="text-xl font-bold text-primary mb-2">Reset Password</h1>
      <p className="text-sm text-on-surface-variant mb-6">
        Enter your institutional email address to receive password recovery instructions.
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

      {message && (
        <div
          role="status"
          className="mb-4 p-3 rounded text-sm bg-secondary-container/20 border border-secondary-container/40 text-on-surface flex items-start gap-2"
        >
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">mark_email_read</span>
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="reset-email">
            Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@oxford.ac.uk"
            className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface text-sm rounded border border-outline-variant focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-block w-full text-center py-2 px-4 bg-primary text-on-primary rounded font-medium text-sm transition-opacity disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? 'Sending Instructions...' : 'Send Recovery Instructions'}
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
