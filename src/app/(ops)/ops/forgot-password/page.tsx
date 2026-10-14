'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OpsForgotPasswordPage() {
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
          setErrorMessage(data?.message || 'Rate limit threshold exceeded. Please wait before retrying.');
        } else if (res.status === 503) {
          setErrorMessage('Operations Gateway is temporarily unavailable.');
        } else {
          setErrorMessage(data?.message || 'Unable to process recovery request.');
        }
        return;
      }

      setMessage(data?.message || 'If identity is verified in cluster registry, dispatch token has been issued.');
    } catch {
      setErrorMessage('Network communication error with gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col justify-between antialiased">
      {/* HEADER BAR */}
      <header className="w-full h-14 border-b border-outline-variant/30 bg-surface-container-low px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="font-headline-md text-headline-md font-semibold tracking-tight text-on-surface">LEXI</span>
          <span className="px-1.5 py-0.5 bg-surface-container-highest border border-outline-variant/50 font-label-sm text-label-sm text-on-surface-variant uppercase">
            Operations
          </span>
        </div>
        <span className="font-label-sm text-label-sm text-outline uppercase">IDENTITY RECOVERY DISPATCH</span>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full flex-1 flex items-center justify-center p-margin">
        <div className="w-full max-w-xl bg-surface-container rounded-xl shadow-xl overflow-hidden relative border border-outline-variant/30">
          <div className="bg-surface-container-high px-space-lg py-3 flex items-center justify-between border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-surface-container-highest text-tertiary">
                <span className="material-symbols-outlined text-[14px]">lock_reset</span>
              </span>
              <span className="font-code-md text-code-md text-on-surface tracking-wide">ENCLAVE://IDENTITY-TRIAGE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">SecOps Channel</span>
            </div>
          </div>

          <div className="p-space-xl flex flex-col gap-space-lg">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                Request Credential Recovery
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Enter your authorized work identity email. If registered in the operator directory, recovery instructions will be transmitted via secure dispatch.
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-error-container/20 p-space-md flex items-start gap-3 border border-error-container/40">
                <span className="material-symbols-outlined text-error mt-0.5 text-[18px]">warning</span>
                <span className="font-body-sm text-body-sm text-on-error-container">{errorMessage}</span>
              </div>
            )}

            {message && (
              <div className="rounded-lg bg-secondary-container/20 p-space-md flex items-start gap-3 border border-secondary-container/40">
                <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">mark_email_read</span>
                <span className="font-body-sm text-body-sm text-on-surface">{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase font-medium" htmlFor="ops-forgot-email">
                  Operator Work Email
                </label>
                <input
                  id="ops-forgot-email"
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@lexi.internal"
                  className="w-full h-9 px-3 bg-surface-container-lowest text-on-surface font-code-md text-code-md rounded border border-outline-variant/30 focus:outline-none focus:bg-surface-container-low disabled:opacity-50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 px-4 rounded font-code-lg text-code-lg font-semibold tracking-wider uppercase flex items-center justify-center gap-2 bg-primary-container text-on-primary-container hover:bg-primary transition-all shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isLoading ? 'sync' : 'send'}
                  </span>
                  <span>{isLoading ? 'Dispatching Token...' : 'Dispatch Recovery Token'}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <Link href="/ops/login" className="font-label-sm text-label-sm text-tertiary hover:underline">
                  ← Return to Operations Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 px-margin py-space-sm flex items-center justify-between font-label-sm text-label-sm text-outline">
        <span>AUTHENTICATION GATEWAY // SECURE TRIAGE</span>
        <span className="text-outline font-medium">DISPATCH SERVICE</span>
      </footer>
    </div>
  );
}
