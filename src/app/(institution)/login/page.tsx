'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { canAccessInstitution, canAccessOps } from '@/lib/auth/roles';

export default function InstitutionLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMessage('Invalid email or password');
        } else if (res.status === 429) {
          setErrorMessage(data?.message || 'Too many login attempts. Please wait before trying again.');
        } else if (res.status === 503) {
          setErrorMessage('Authentication service is temporarily unavailable. Please retry shortly.');
        } else {
          setErrorMessage(data?.message || 'An error occurred during authentication. Please try again.');
        }
        return;
      }

      // Route by forced password flag or user role
      if (data?.mustChangePassword) {
        router.push('/change-password');
      } else if (canAccessInstitution(data?.role)) {
        router.push('/dashboard');
      } else if (canAccessOps(data?.role)) {
        router.push('/ops/health');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setErrorMessage('Network connection failure. Please check your connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-surface-container rounded-lg border border-outline-variant shadow-sm">
      <h1 className="text-xl font-bold text-primary mb-4">Institution Login</h1>
      <p className="text-sm text-on-surface-variant mb-6">
        Sign in to access your institutional console.
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="inst-email">
            Email Address
          </label>
          <input
            id="inst-email"
            type="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@oxford.ac.uk"
            className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface text-sm rounded border border-outline-variant focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="inst-password">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="inst-password"
            type="password"
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface text-sm rounded border border-outline-variant focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-block w-full text-center py-2 px-4 bg-primary text-on-primary rounded font-medium text-sm transition-opacity disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
