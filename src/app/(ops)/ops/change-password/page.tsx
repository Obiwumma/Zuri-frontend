'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OpsChangePasswordPage() {
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
      setErrorMessage('New secret key must be at least 8 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passphrases do not match.');
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
          setErrorMessage('Current secret key is incorrect or session token has expired.');
        } else if (res.status === 429) {
          setErrorMessage(data?.message || 'Rate limit threshold exceeded. Please retry later.');
        } else if (res.status === 503) {
          setErrorMessage('Operations Gateway is temporarily unavailable.');
        } else {
          setErrorMessage(data?.message || 'Failed to update credentials. Please verify requirements.');
        }
        return;
      }

      setSuccessMessage('Credentials rotated successfully. Initializing console...');
      setTimeout(() => {
        router.push('/ops/health');
      }, 1200);
    } catch {
      setErrorMessage('Network communication error with cluster gateway.');
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
        <span className="font-label-sm text-label-sm text-outline uppercase">MANDATORY CREDENTIAL ROTATION</span>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full flex-1 flex items-center justify-center p-margin">
        <div className="w-full max-w-xl bg-surface-container rounded-xl shadow-xl overflow-hidden relative border border-outline-variant/30">
          {/* Top System Identification Strip */}
          <div className="bg-surface-container-high px-space-lg py-3 flex items-center justify-between border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-surface-container-highest text-secondary">
                <span className="material-symbols-outlined text-[14px]">key_vertical</span>
              </span>
              <span className="font-code-md text-code-md text-on-surface tracking-wide">POLICY://90-DAY-ROTATION-ENFORCED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Rotation Required</span>
            </div>
          </div>

          <div className="p-space-xl flex flex-col gap-space-lg">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                Rotate Operator Credentials
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Your credentials have expired or administrative rotation has been triggered. Update your passphrase to continue.
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-error-container/20 p-space-md flex items-start gap-3 border border-error-container/40">
                <span className="material-symbols-outlined text-error mt-0.5 text-[18px]">warning</span>
                <span className="font-body-sm text-body-sm text-on-error-container">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg bg-secondary-container/20 p-space-md flex items-start gap-3 border border-secondary-container/40">
                <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">check_circle</span>
                <span className="font-body-sm text-body-sm text-on-surface">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase font-medium" htmlFor="ops-cur-pw">
                  Current Passphrase
                </label>
                <input
                  id="ops-cur-pw"
                  type="password"
                  required
                  disabled={isLoading}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current passphrase"
                  className="w-full h-9 px-3 bg-surface-container-lowest text-on-surface font-code-md text-code-md rounded border border-outline-variant/30 focus:outline-none focus:bg-surface-container-low disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase font-medium" htmlFor="ops-new-pw">
                  New Passphrase (min. 8 characters)
                </label>
                <input
                  id="ops-new-pw"
                  type="password"
                  required
                  disabled={isLoading}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new passphrase"
                  className="w-full h-9 px-3 bg-surface-container-lowest text-on-surface font-code-md text-code-md rounded border border-outline-variant/30 focus:outline-none focus:bg-surface-container-low disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase font-medium" htmlFor="ops-conf-pw">
                  Confirm New Passphrase
                </label>
                <input
                  id="ops-conf-pw"
                  type="password"
                  required
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new passphrase"
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
                    {isLoading ? 'sync' : 'key'}
                  </span>
                  <span>{isLoading ? 'Updating Enclave Key...' : 'Rotate Credentials'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 px-margin py-space-sm flex items-center justify-between font-label-sm text-label-sm text-outline">
        <span>AUTHENTICATION GATEWAY // SECURE PASS-RESET</span>
        <span className="text-secondary font-medium">ENCLAVE ENFORCED</span>
      </footer>
    </div>
  );
}
