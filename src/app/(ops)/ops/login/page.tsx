'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { canAccessOps, canAccessInstitution } from '@/lib/auth/roles';

type HarnessState = 'default' | 'loading' | 'invalid' | 'locked' | 'reset';

export default function OpsLoginPage() {
  const router = useRouter();
  const [harnessState, setHarnessState] = useState<HarnessState>('default');
  const [email, setEmail] = useState<string>('operator@lexi.internal');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberSession, setRememberSession] = useState<boolean>(true);
  const [customErrorMessage, setCustomErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (harnessState === 'locked' || harnessState === 'loading') return;

    setHarnessState('loading');
    setCustomErrorMessage(null);

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
          setHarnessState('invalid');
          setCustomErrorMessage('Invalid operator credentials. Please check your credentials and retry.');
        } else if (res.status === 429) {
          setHarnessState('locked');
          setCustomErrorMessage(data?.message || 'Rate limit threshold exceeded. Please wait before retrying.');
        } else if (res.status === 503) {
          setHarnessState('invalid');
          setCustomErrorMessage('Operations Gateway is temporarily unavailable. Please retry shortly.');
        } else {
          setHarnessState('invalid');
          setCustomErrorMessage(data?.message || 'Authentication mismatch. Please try again.');
        }
        return;
      }

      if (data?.mustChangePassword) {
        setHarnessState('reset');
        router.push('/ops/change-password');
        return;
      }

      if (canAccessOps(data?.role)) {
        window.location.href = '/ops/health';
      } else if (canAccessInstitution(data?.role)) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/ops/health';
      }
    } catch {
      setHarnessState('invalid');
      setCustomErrorMessage('Network communication error. Unable to establish secure gateway session.');
    }
  };

  const isFormDisabled = harnessState === 'loading' || harnessState === 'locked';

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
        <span className="font-label-sm text-label-sm text-outline uppercase">SECURE AUTH PROTOCOL</span>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full flex-1 flex items-center justify-center p-margin">
        <div className="flex flex-col w-full items-center justify-center py-space-xl">
          {/* Interactive State Simulation Harness Bar */}
          <div className="w-full max-w-xl mb-space-lg">
            <div className="bg-surface-container-low p-1.5 rounded-lg flex flex-wrap items-center justify-between gap-1 shadow-xs">
              <div className="flex items-center gap-1.5 px-2 py-1 text-on-surface-variant font-label-sm text-label-sm uppercase">
                <span className="material-symbols-outlined text-outline text-[14px]">tune</span>
                <span>Harness States:</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setHarnessState('default')}
                  className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors duration-150 cursor-pointer ${
                    harnessState === 'default'
                      ? 'bg-surface-container text-primary font-medium shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  1. Default
                </button>
                <button
                  type="button"
                  onClick={() => setHarnessState('loading')}
                  className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors duration-150 cursor-pointer ${
                    harnessState === 'loading'
                      ? 'bg-surface-container text-primary font-medium shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  2. Loading
                </button>
                <button
                  type="button"
                  onClick={() => setHarnessState('invalid')}
                  className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors duration-150 cursor-pointer ${
                    harnessState === 'invalid'
                      ? 'bg-surface-container text-primary font-medium shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  3. Invalid
                </button>
                <button
                  type="button"
                  onClick={() => setHarnessState('locked')}
                  className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors duration-150 cursor-pointer ${
                    harnessState === 'locked'
                      ? 'bg-surface-container text-primary font-medium shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  4. Locked
                </button>
                <button
                  type="button"
                  onClick={() => setHarnessState('reset')}
                  className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors duration-150 cursor-pointer ${
                    harnessState === 'reset'
                      ? 'bg-surface-container text-primary font-medium shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  5. Rotation Req.
                </button>
              </div>
            </div>
          </div>

          {/* Main Auth Panel Container */}
          <div className="w-full max-w-xl bg-surface-container rounded-xl shadow-xl overflow-hidden relative border border-outline-variant/30">
            {/* Top System Identification Strip */}
            <div className="bg-surface-container-high px-space-lg py-3 flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-surface-container-highest text-primary">
                  <span className="material-symbols-outlined text-[14px]">terminal</span>
                </span>
                <span className="font-code-md text-code-md text-on-surface tracking-wide">ID://GATEWAY-CLUSTER-04</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">MTLS Active</span>
              </div>
            </div>

            {/* Inner Content Area */}
            <div className="p-space-xl flex flex-col gap-space-lg">
              {/* System Notice / Eyebrow Header */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-outline text-[13px]">lock</span>
                    <span className="tracking-wider uppercase font-semibold">Operations Gateway</span>
                  </div>
                  <span className="font-code-md text-code-md text-outline">v4.19.2</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
                  Sign in to Operations Console
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Internal system. Authorized Lexi &amp; Zuri engineering personnel only.
                </p>
              </div>

              {/* DYNAMIC STATE BANNERS */}
              {/* State 2 Banner: Loading Session Info */}
              {harnessState === 'loading' && (
                <div className="rounded-lg bg-surface-container-highest p-space-md flex items-start gap-3 border border-outline-variant/40">
                  <span className="material-symbols-outlined text-tertiary mt-0.5 animate-spin text-[18px]">sync</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-code-md text-code-md font-semibold text-tertiary uppercase">Authenticating Hardware Enclave</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Validating identity payload against root authority cluster...</span>
                  </div>
                </div>
              )}

              {/* State 3 Banner: Invalid Credentials */}
              {harnessState === 'invalid' && (
                <div className="rounded-lg bg-error-container/20 p-space-md flex items-start gap-3 border border-error-container/40">
                  <span className="material-symbols-outlined text-error mt-0.5 text-[18px]">warning</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-code-md text-code-md font-semibold text-error uppercase">Authentication Mismatch</span>
                    <span className="font-body-sm text-body-sm text-on-error-container">
                      {customErrorMessage || 'Invalid operator credentials. 2 attempts remaining before temporary account lockout.'}
                    </span>
                  </div>
                </div>
              )}

              {/* State 4 Banner: Account Locked */}
              {harnessState === 'locked' && (
                <div className="rounded-lg bg-error-container/30 p-space-md flex items-start gap-3 border border-error-container/50">
                  <span className="material-symbols-outlined text-error mt-0.5 text-[18px]">gpp_bad</span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-code-md text-code-md font-semibold text-error uppercase">Account Suspended</span>
                      <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm">INCIDENT #SEC-LOCK-8921</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {customErrorMessage || 'Maximum failed attempts exceeded. The identity token has been revoked. Security dispatch notified. Please contact SecOps on-call via verified PGP channel.'}
                    </span>
                  </div>
                </div>
              )}

              {/* State 5 Banner: Credential Rotation Required */}
              {harnessState === 'reset' && (
                <div className="rounded-lg bg-secondary-container/20 p-space-md flex items-start gap-3 border border-secondary-container/40">
                  <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">key_vertical</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-code-md text-code-md font-semibold text-secondary uppercase">Mandatory Credential Rotation</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Scheduled 90-day rotation policy invoked. A cryptographically signed dispatch link has been pushed to your verified hardware key.</span>
                  </div>
                </div>
              )}

              {/* Operational Login Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
                {/* Identity Email Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase font-medium" htmlFor="work-email">
                      Work Identity Email
                    </label>
                    <span className="font-code-md text-code-md text-outline">sso-domain://lexi.internal</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="work-email"
                      type="email"
                      disabled={isFormDisabled}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@lexi.internal"
                      className="w-full h-9 px-3 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded transition-colors placeholder:text-outline focus:outline-none focus:bg-surface-container-low border border-outline-variant/30 disabled:opacity-50"
                    />
                    <span className="absolute right-2.5 material-symbols-outlined text-outline pointer-events-none text-[16px]">alternate_email</span>
                  </div>
                </div>

                {/* Secret Key / Password Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase font-medium" htmlFor="secret-key">
                      Operator Secret Key
                    </label>
                    <span className="font-code-md text-code-md text-outline">ed25519-compatible</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="secret-key"
                      type={showPassword ? 'text' : 'password'}
                      disabled={isFormDisabled}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter passphrase"
                      className="w-full h-9 pl-3 pr-16 bg-surface-container-lowest text-on-surface font-code-md text-code-md rounded transition-colors placeholder:text-outline focus:outline-none focus:bg-surface-container-low border border-outline-variant/30 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      disabled={isFormDisabled}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1.5 px-2 py-0.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Workstation Persistence Toggle & Help */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={isFormDisabled}
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-surface-container-lowest text-primary accent-primary focus:outline-none cursor-pointer"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Remember workstation for 12 hours</span>
                  </label>
                  <Link href="/ops/forgot-password" className="font-label-sm text-label-sm text-tertiary hover:underline transition-all">
                    SecOps Triage?
                  </Link>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isFormDisabled}
                    className={`w-full h-10 px-4 rounded font-code-lg text-code-lg font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                      harnessState === 'locked'
                        ? 'bg-surface-container-highest text-outline cursor-not-allowed opacity-60'
                        : harnessState === 'loading'
                        ? 'bg-primary-container text-on-primary-container opacity-75 cursor-wait'
                        : 'bg-primary-container text-on-primary-container hover:bg-primary active:scale-[0.99]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${harnessState === 'loading' ? 'animate-spin' : ''}`}>
                      {harnessState === 'loading' ? 'sync' : harnessState === 'locked' ? 'lock_clock' : harnessState === 'reset' ? 'key' : 'login'}
                    </span>
                    <span>
                      {harnessState === 'loading'
                        ? 'Authenticating Session...'
                        : harnessState === 'locked'
                        ? 'Account Locked by SecOps'
                        : harnessState === 'reset'
                        ? 'Check Hardware Key'
                        : 'Sign in to Ops Console'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Explicit Boundary Notice */}
              <div className="rounded bg-surface-container-lowest p-space-md flex flex-col gap-1.5 border border-outline-variant/30">
                <div className="flex items-center gap-1.5 text-outline">
                  <span className="material-symbols-outlined text-[14px]">gavel</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Controlled Operational Environment</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Strictly for authorized Lexi &amp; Zuri operations personnel. Self-registration is disabled. All session initiation events, IP telemetry, and access vectors are cryptographically signed and stored in immutable compliance logs.
                </p>
              </div>
            </div>

            {/* Security & Trust Badges Footer Grid */}
            <div className="bg-surface-container-low px-space-lg py-space-sm flex flex-wrap items-center justify-between gap-y-2 gap-x-4 border-t border-outline-variant/30">
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>SOC 2 Type II Certified</span>
              </div>
              <span className="text-outline-variant font-code-md text-code-md">•</span>
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>ISO 27001 Enclave</span>
              </div>
              <span className="text-outline-variant font-code-md text-code-md">•</span>
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>Enterprise SSO Ready</span>
              </div>
              <span className="text-outline-variant font-code-md text-code-md">•</span>
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>Mutual-TLS Enforced</span>
              </div>
            </div>
          </div>

          {/* Operational Diagnostics Strip Below Panel */}
          <div className="w-full max-w-xl mt-space-sm px-2 flex items-center justify-between font-label-sm text-label-sm text-outline">
            <div className="flex items-center gap-3">
              <span>NODE: <span className="text-on-surface-variant font-code-md">fra-edge-09</span></span>
              <span>LATENCY: <span className="text-on-surface-variant font-code-md">11ms</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span>SESSION HASH:</span>
              <span className="font-code-md text-on-surface-variant tracking-wider">0x8F9C...31D2</span>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 px-margin py-space-sm flex items-center justify-between font-label-sm text-label-sm text-outline">
        <span>AUTHENTICATION GATEWAY // EU-CENTRAL</span>
        <span className="text-error font-medium">INTERNAL PERSONNEL ONLY</span>
      </footer>
    </div>
  );
}
