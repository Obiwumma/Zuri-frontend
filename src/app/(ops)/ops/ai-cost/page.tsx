'use client';

import React, { useState } from 'react';
import { KpiTile } from '@/components/ui/KpiTile';
import { DataTable, Column } from '@/components/ui/DataTable';

interface ProviderEconomicsRecord {
  id: string;
  provider: string;
  models: string;
  reqVol: string;
  inputTokens: string;
  outputTokens: string;
  grossSpend: string;
  errorRate: string;
  avgTTFT: string;
  status: string;
  isOptimal?: boolean;
  isElevated?: boolean;
}

interface ResilienceEvent {
  id: string;
  badge: string;
  badgeType: 'primary' | 'secondary' | 'normal';
  timestamp: string;
  message: string;
  detail: string;
}

export default function OpsAiCostPage() {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [resolution, setResolution] = useState<'1m' | '5m' | '1h'>('5m');

  const providerData: ProviderEconomicsRecord[] = [
    {
      id: 'prov-1',
      provider: 'Anthropic',
      models: 'Claude 3.5 Sonnet & 3.5 Haiku',
      reqVol: '182,410',
      inputTokens: '412M',
      outputTokens: '58M',
      grossSpend: '$238.50',
      errorRate: '0.02%',
      avgTTFT: '320ms',
      status: 'Healthy',
    },
    {
      id: 'prov-2',
      provider: 'OpenAI',
      models: 'GPT-4o, 4o-mini & Embeddings',
      reqVol: '148,200',
      inputTokens: '284M',
      outputTokens: '41M',
      grossSpend: '$118.20',
      errorRate: '0.01%',
      avgTTFT: '290ms',
      status: 'Healthy',
    },
    {
      id: 'prov-3',
      provider: 'Internal Triton Cluster',
      models: 'Mistral 7B / DeepSeek v3 (H100s)',
      reqVol: '368,000',
      inputTokens: '192 GPU-hrs',
      outputTokens: '—',
      grossSpend: '$42.10*',
      errorRate: '0.00%',
      avgTTFT: '85ms',
      status: 'Optimal',
      isOptimal: true,
    },
    {
      id: 'prov-4',
      provider: 'Document OCR Engine',
      models: 'Tesseract / PaddleOCR GPU Node',
      reqVol: '24,100',
      inputTokens: '89.4k pages',
      outputTokens: '—',
      grossSpend: '$19.40',
      errorRate: '0.18%',
      avgTTFT: '840ms',
      status: 'Elevated Load',
      isElevated: true,
    },
  ];

  const providerColumns: Column<ProviderEconomicsRecord>[] = [
    {
      header: 'Provider / Cluster Pool',
      accessor: (row) => (
        <div>
          <div className="font-code-md text-code-md text-on-surface font-semibold">{row.provider}</div>
          <div className="text-outline text-label-sm font-label-sm">{row.models}</div>
        </div>
      ),
    },
    {
      header: 'Req Vol',
      accessor: (row) => (
        <div className="text-right font-code-md text-code-md text-on-surface">{row.reqVol}</div>
      ),
    },
    {
      header: 'Input Tokens',
      accessor: (row) => (
        <div className={`text-right font-code-md text-code-md ${row.inputTokens.includes('GPU') || row.inputTokens.includes('pages') ? 'text-outline' : 'text-on-surface'}`}>
          {row.inputTokens}
        </div>
      ),
    },
    {
      header: 'Output Tokens',
      accessor: (row) => (
        <div className="text-right font-code-md text-code-md text-on-surface">{row.outputTokens}</div>
      ),
    },
    {
      header: 'Gross Spend',
      accessor: (row) => (
        <div className={`text-right font-code-md text-code-md font-bold ${row.isOptimal ? 'text-primary' : 'text-on-surface'}`}>
          {row.grossSpend}
        </div>
      ),
    },
    {
      header: 'Fallback / Err',
      accessor: (row) => (
        <div className={`text-right font-code-md text-code-md ${row.isElevated ? 'text-secondary font-medium' : 'text-primary'}`}>
          {row.errorRate}
        </div>
      ),
    },
    {
      header: 'Avg TTFT',
      accessor: (row) => (
        <div className={`text-right font-code-md text-code-md ${row.isOptimal ? 'text-primary font-semibold' : 'text-on-surface'}`}>
          {row.avgTTFT}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <div className="text-right">
          <span
            className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold ${
              row.isElevated
                ? 'bg-secondary/10 text-secondary'
                : 'bg-surface-container text-primary'
            }`}
          >
            {row.status}
          </span>
        </div>
      ),
    },
  ];

  const resilienceEvents: ResilienceEvent[] = [
    {
      id: 'res-1',
      badge: 'REROUTE RESOLVED',
      badgeType: 'primary',
      timestamp: '14m ago',
      message: 'Claude Sonnet rate limit 429 spike → Auto-rerouted 342 reqs to GPT-4o fallback pool.',
      detail: 'Mesh reaction: 1.4s • Zero user error responses',
    },
    {
      id: 'res-2',
      badge: 'SPILLOVER',
      badgeType: 'normal',
      timestamp: '1h 22m ago',
      message: 'Triton worker pod-04 GPU VRAM pressure → Dynamic spillover to Haiku Tier-2 pool.',
      detail: '128 queries redirected • Model pool load equalized',
    },
    {
      id: 'res-3',
      badge: 'EVICTION SWEEP',
      badgeType: 'normal',
      timestamp: '3h 45m ago',
      message: 'Embedding cache eviction sweep triggered → 4.2GB warm cache repopulated from S3 tiered storage.',
      detail: 'Hit recovery latency: 120ms • 100% vector integrity',
    },
    {
      id: 'res-4',
      badge: 'CIRCUIT BREAKER',
      badgeType: 'secondary',
      timestamp: '6h 12m ago',
      message: 'Circuit breaker probe on OpenAI audio API returned 503 → Temporarily disabled Tier 3 voice transcription route.',
      detail: 'Auto-recovered after 4 healthy synthetic heartbeats',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* CONTROL BAR & BREADCRUMB HEADER */}
      <section className="bg-surface-container-low px-6 py-4 flex flex-col gap-3 border-b border-outline-variant/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-outline uppercase tracking-wider">
              <span>OPERATIONS</span>
              <span className="text-surface-container-highest">/</span>
              <span>AI INFRASTRUCTURE &amp; ROUTING ENGINE</span>
              <span className="text-surface-container-highest">/</span>
              <span className="text-primary font-semibold">METRICS &amp; UNIT COST</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface tracking-tight">
                AI Cost &amp; Request Telemetry
              </h1>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-outline text-label-sm font-label-sm font-medium uppercase tracking-wider">
                Mesh Core 0.9.4
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl">
              Cluster routing efficiency, semantic cache savings, tiered dispatch breakdown, and provider unit economics across active ingress gateways.
            </p>
          </div>

          {/* Action & Filter Ribbon */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Time Range Selector */}
            <div className="flex items-center bg-surface-container-lowest rounded p-0.5 border border-outline-variant/30">
              {(['1h', '6h', '24h', '7d', '30d'] as const).map((tr) => (
                <button
                  key={tr}
                  type="button"
                  onClick={() => setTimeRange(tr)}
                  className={`px-2.5 py-1 text-label-sm font-label-sm transition-colors rounded cursor-pointer ${
                    timeRange === tr
                      ? 'bg-surface-container-high text-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>

            {/* Granularity Selector */}
            <div className="flex items-center bg-surface-container-lowest rounded p-0.5 border border-outline-variant/30">
              <span className="px-2 text-outline text-label-sm font-label-sm">RES:</span>
              {(['1m', '5m', '1h'] as const).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`px-2 py-1 text-label-sm font-label-sm rounded cursor-pointer ${
                    resolution === res
                      ? 'bg-surface-container-high text-on-surface font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>

            {/* Auto Refresh */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest rounded text-on-surface text-label-sm font-label-sm border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>AUTO-REFRESH 10s</span>
            </div>

            {/* Export CTA */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded font-code-md text-code-md transition-colors cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px] text-outline">file_download</span>
              <span>Ledger (CSV/JSON)</span>
            </button>
          </div>
        </div>

        {/* Global Zero Inference Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-surface-container-high rounded mt-1 border border-outline-variant/30">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span className="font-code-md text-code-md text-on-surface font-medium">Global Zero-Inference Interception Rate:</span>
            <span className="font-code-md text-code-md font-bold text-primary">68.4%</span>
            <span className="text-on-surface-variant font-body-sm text-body-sm">(Tiers 0–1 bypass frontier LLMs completely)</span>
          </div>
          <div className="flex items-center gap-4 text-outline font-label-sm text-label-sm">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Ingress Healthy
            </span>
            <span>•</span>
            <span className="font-code-md text-code-md text-on-surface">627.5k deterministic</span>
            <span>•</span>
            <span className="font-code-md text-code-md text-on-surface">404.1k semantic</span>
            <span>•</span>
            <span className="text-primary font-semibold">-$1,842.20 vs naive raw API</span>
          </div>
        </div>
      </section>

      {/* 1. TOP KPI TELEMETRY LEDGER (5 Cards via KpiTile) */}
      <section className="p-6 bg-surface-container-lowest">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          <KpiTile
            label="Total Volume (30d)"
            value="48.2M reqs"
            trend="+8.4%"
            trendDirection="up"
            icon="bar_chart"
            subtext="p95 Latency 142ms"
          />
          <KpiTile
            label="Today's Ingress"
            value="1,642,890"
            trend="LIVE"
            trendDirection="up"
            icon="trending_up"
            subtext="Throughput 2,380 req/s (pk 3,140)"
          />
          <KpiTile
            label="Composite Hit Rate"
            value="62.8%"
            trend="+3.2% vs target"
            trendDirection="up"
            icon="target"
            subtext="Saved Invocations: 1,031,735"
          />
          <KpiTile
            label="Provider Fallback"
            value="0.041%"
            trend="Nominal"
            trendDirection="neutral"
            icon="alt_route"
            subtext="Reroutes (24h): 674 events"
          />
          <KpiTile
            label="AI Spend Run Rate"
            value="$418.20"
            trend="-$18.4k Save"
            trendDirection="up"
            icon="payments"
            subtext="Projected Month: $12,850/mo"
          />
        </div>
      </section>

      {/* 2. MAIN ROUTING EFFICIENCY & TIERED DISPATCH */}
      <section className="px-6 pb-6 bg-surface-container-lowest flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[20px]">alt_route</span>
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
              Routing Efficiency &amp; Tiered Dispatch Telemetry
            </h2>
          </div>
          <div className="flex items-center gap-3 font-code-md text-code-md flex-wrap">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-2.5 h-2.5 rounded bg-primary"></span>
              <span>T0: Rule (38.2%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-2.5 h-2.5 rounded bg-tertiary"></span>
              <span>T1: Vector (24.6%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-2.5 h-2.5 rounded bg-primary-container"></span>
              <span>T2: Edge 7B (22.4%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-2.5 h-2.5 rounded bg-secondary"></span>
              <span>T3: Mid (11.8%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-2.5 h-2.5 rounded bg-error"></span>
              <span>T4: Frontier (3.0%)</span>
            </div>
          </div>
        </div>

        {/* Telemetry Multi-pane Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Stacked Area / Distribution Chart Visualizer */}
          <div className="lg:col-span-5 bg-surface-container-low p-4 rounded flex flex-col justify-between border border-outline-variant/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">24-Hour Tier Ingress Distribution</span>
                <span className="font-body-sm text-body-sm text-outline">Hourly stacked request volume (k reqs/hour)</span>
              </div>
              <span className="font-code-md text-code-md text-on-surface-variant">Peak: 124.8k/hr</span>
            </div>

            {/* Stacked Telemetry Bars (24h) */}
            <div className="w-full h-52 bg-surface-container-lowest rounded p-3 flex flex-col justify-end border border-outline-variant/30">
              <div className="h-40 w-full flex items-end justify-between gap-1">
                {[62, 55, 48, 42, 40, 47, 58, 70, 82, 92, 98, 100, 96, 91, 94, 89, 85, 80, 74, 72, 68, 65, 61, 58].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col-reverse rounded-t overflow-hidden gap-[1px]" style={{ height: `${h}%` }}>
                    <div className="bg-primary h-[39%]"></div>
                    <div className="bg-tertiary h-[24%]"></div>
                    <div className="bg-primary-container h-[22%]"></div>
                    <div className="bg-secondary h-[11%]"></div>
                    <div className="bg-error h-[4%]"></div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-outline font-code-md text-code-md mt-2 pt-1 border-t border-surface-container">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00 PEAK</span>
                <span>18:00</span>
                <span>NOW</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-surface-container rounded flex items-center justify-between border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">query_stats</span>
                <span className="font-body-sm text-body-sm text-on-surface">Efficiency Invariant:</span>
              </div>
              <span className="font-code-md text-code-md text-primary font-semibold">85.2% Traffic ≤ Tier 2 (Saved +$782.40/day)</span>
            </div>
          </div>

          {/* Right: Tier Breakdown Table */}
          <div className="lg:col-span-7 bg-surface-container-low rounded overflow-hidden flex flex-col justify-between border border-outline-variant/30">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container font-label-sm text-label-sm text-outline uppercase tracking-wider border-b border-outline-variant/30">
                    <th className="py-2.5 px-4 font-semibold">Tier &amp; Mechanism</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Volume</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Share</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Latency</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Unit Cost</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Efficiency Reduction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
                  <tr className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded bg-primary"></span>
                        <div>
                          <span className="font-code-md text-code-md text-on-surface font-semibold">Tier 0</span>
                          <span className="text-outline text-label-sm font-label-sm ml-1.5">Deterministic &amp; Rule Cache</span>
                        </div>
                      </div>
                      <div className="text-outline text-label-sm font-label-sm pl-4">Exact query hash, syllabus index, template response</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">627.5k</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-primary font-semibold">38.2%</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">1.8ms</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">$0.00000</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-code-md text-code-md font-semibold">100% Free</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded bg-tertiary"></span>
                        <div>
                          <span className="font-code-md text-code-md text-on-surface font-semibold">Tier 1</span>
                          <span className="text-outline text-label-sm font-label-sm ml-1.5">Semantic Vector &amp; Context Cache</span>
                        </div>
                      </div>
                      <div className="text-outline text-label-sm font-label-sm pl-4">Qdrant NVMe, score ≥ 0.96, shared institutional knowledge</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">404.1k</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-tertiary font-semibold">24.6%</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">18ms</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">$0.00002</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-tertiary font-code-md text-code-md">99.2% Reduced</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded bg-primary-container"></span>
                        <div>
                          <span className="font-code-md text-code-md text-on-surface font-semibold">Tier 2</span>
                          <span className="text-outline text-label-sm font-label-sm ml-1.5">Edge Classifier / Distilled 7B</span>
                        </div>
                      </div>
                      <div className="text-outline text-label-sm font-label-sm pl-4">Local Triton cluster, fast intent triage &amp; rubric evaluation</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">368.0k</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-primary-container font-semibold">22.4%</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">110ms</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">$0.00018</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-code-md text-code-md">91.0% Reduced</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded bg-secondary"></span>
                        <div>
                          <span className="font-code-md text-code-md text-on-surface font-semibold">Tier 3</span>
                          <span className="text-outline text-label-sm font-label-sm ml-1.5">Mid Frontier Reasoner</span>
                        </div>
                      </div>
                      <div className="text-outline text-label-sm font-label-sm pl-4">Claude 3.5 Haiku / GPT-4o-mini academic feedback</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">193.8k</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-secondary font-semibold">11.8%</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">480ms</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">$0.00140</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-md text-code-md">Standard</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded bg-error"></span>
                        <div>
                          <span className="font-code-md text-code-md text-on-surface font-semibold">Tier 4</span>
                          <span className="text-outline text-label-sm font-label-sm ml-1.5">Frontier Deep Synthesis</span>
                        </div>
                      </div>
                      <div className="text-outline text-label-sm font-label-sm pl-4">Claude 3.5 Sonnet / GPT-4o multi-doc curriculum reasoning</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">49.3k</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-error font-semibold">3.0%</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">1,420ms</td>
                    <td className="py-2.5 px-3 text-right font-code-md text-code-md text-on-surface">$0.00620</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-error/10 text-error font-code-md text-code-md font-semibold">Monitored</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-surface-container flex items-center justify-between text-outline font-label-sm text-label-sm border-t border-outline-variant/30">
              <span>SUM 24H: 1,642,890 REQUESTS DISPATCHED</span>
              <span className="font-code-md text-code-md text-on-surface">Avg Ingress Overhead: 3.4ms | Routing Mesh v2.4</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED CACHE MODULE (5 Sub-Engines) */}
      <section className="p-6 bg-surface-container-lowest">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
            <div>
              <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
                Semantic &amp; Pipeline Cache Architecture
              </h2>
              <p className="font-body-sm text-body-sm text-outline">
                Multi-tier memory, embedding deduplication, and AST document processing cache nodes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-surface-container text-primary font-code-md text-code-md font-medium border border-outline-variant/30">
              Active Cache Layer: 5/5 Synchronized
            </span>
          </div>
        </div>

        {/* 5 High-Density Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          {/* Cache Node 1 */}
          <div className="bg-surface-container-low p-4 rounded flex flex-col justify-between border border-outline-variant/30 hover:bg-surface-container/60 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">1. Ingress Request Cache</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-headline-md text-headline-md font-bold text-on-surface font-code-lg">28.4%</span>
                <span className="font-code-md text-code-md text-on-surface-variant">466.5k reqs</span>
              </div>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-surface-container font-code-md text-code-md">
              <div className="flex justify-between text-outline text-label-sm font-label-sm">
                <span>Interval</span>
                <span className="text-on-surface">15m sliding</span>
              </div>
              <div className="flex justify-between text-outline text-label-sm font-label-sm">
                <span>Efficiency</span>
                <span className="text-primary font-semibold">Zero GPU compute</span>
              </div>
            </div>
          </div>

          {/* Cache Node 2 */}
          <div className="bg-surface-container-low p-4 rounded flex flex-col justify-between border border-outline-variant/30 hover:bg-surface-container/60 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">2. Retrieval Cache (Qdrant)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-headline-md text-headline-md font-bold text-primary font-code-lg">71.2%</span>
                <span className="font-code-md text-code-md text-on-surface-variant">1.16M lookups</span>
              </div>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-surface-container font-code-md text-code-md">
              <div className="flex justify-between text-outline text-label-sm font-label-sm">
                <span>Footprint</span>
                <span className="text-on-surface">18.4 GB NVMe</span>
              </div>
              <div className="flex justify-between text-outline text-label-sm font-label-sm">
                <span>Vector Savings</span>
                <span className="text-primary font-semibold">-$142/day</span>
              </div>
            </div>
          </div>

          {/* Cache Node 3 */}
          <div className="bg-surface-container-low p-4 rounded flex flex-col justify-between border border-outline-variant/30 hover:bg-surface-container/60 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">3. Embedding Token Cache</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-headline-md text-headline-md font-bold text-primary font-code-lg">84.6%</span>
                <span className="font-code-md text-code-md text-on-surface-variant">1.38M tokens</span>
              </div>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-surface-container font-code-md text-code-md">
              <div className="flex justify-between text-outline text-label-sm font-label-sm">
                <span>Target Model</span>
                <span className="text-on-surface">text-embed-3-sm</span>
              </div>
              <div className="flex justify-between text-outline text-label-sm font-label-sm">
                <span>Reuse Level</span>
                <span className="text-primary font-semibold">99.8% Near-Peak</span>
              </div>
            </div>
          </div>

          {/* Cache Node 4 */}
          <div className="bg-surface-container-low p-4 rounded flex flex-col justify-between border border-outline-variant/30 hover:bg-surface-container/60 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">4. Doc &amp; OCR AST Cache</span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-headline-md text-headline-md font-bold text-on-surface font-code-lg">59.1%</span>
                <span className="font-code-md text-code-md text-on-surface-variant">14.2k slices</span>
              </div>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-surface-container font-code-md text-code-md">
              <div className="flex justify-between text-outline text-label-sm font-label-sm">
                <span>OCR Queue Offset</span>
                <span className="text-on-surface">-42% load</span>
              </div>
              <div className="flex justify-between text-outline text-label-sm font-label-sm">
                <span>State</span>
                <span className="text-secondary font-semibold">Bottleneck Prevented</span>
              </div>
            </div>
          </div>

          {/* Cache Node 5 */}
          <div className="bg-surface-container-low p-4 rounded flex flex-col justify-between border border-outline-variant/30 hover:bg-surface-container/60 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">5. Shared Knowledge Reuse</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-headline-md text-headline-md font-bold text-on-surface font-code-lg">43.7%</span>
                <span className="font-code-md text-code-md text-on-surface-variant">717.9k dedup</span>
              </div>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-surface-container font-code-md text-code-md">
              <div className="flex justify-between text-outline text-label-sm font-label-sm">
                <span>Boundary</span>
                <span className="text-on-surface">Cryptographic</span>
              </div>
              <div className="flex justify-between text-outline text-label-sm font-label-sm">
                <span>Impact</span>
                <span className="text-primary font-semibold">Reduces Redundant LLM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COST & PROVIDER UNIT ECONOMICS + RESILIENCE LOG */}
      <section className="p-6 bg-surface-container-lowest">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Provider Ledger Table (Col 8 via DataTable) */}
          <div className="xl:col-span-8 bg-surface-container-low rounded overflow-hidden flex flex-col justify-between border border-outline-variant/30 shadow-xs">
            <DataTable
              title="Provider Unit Economics & Ingress Ledger"
              subtitle="Active Ingress Tokens: 696M / 24h • Gross Spend Incurred: $418.20 / 24h"
              columns={providerColumns}
              data={providerData}
              keyExtractor={(item) => item.id}
            />
          </div>

          {/* Fallback & Resilience Event Stream (Col 4) */}
          <div className="xl:col-span-4 bg-surface-container-low rounded overflow-hidden flex flex-col justify-between border border-outline-variant/30 shadow-xs">
            <div>
              <div className="px-4 py-3 bg-surface-container flex items-center justify-between border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[18px]">security_update_warning</span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface uppercase tracking-wider">
                    Fallback &amp; Resilience Stream
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-primary"></span>
              </div>
              <div className="divide-y divide-surface-container font-body-sm text-body-sm">
                {resilienceEvents.map((evt) => (
                  <div key={evt.id} className="p-3.5 hover:bg-surface-container transition-colors">
                    <div className="flex items-center justify-between mb-1.5 font-label-sm text-label-sm">
                      <span
                        className={`px-1.5 py-0.5 rounded font-code-md font-semibold ${
                          evt.badgeType === 'primary'
                            ? 'bg-primary/10 text-primary'
                            : evt.badgeType === 'secondary'
                            ? 'bg-secondary/10 text-secondary'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {evt.badge}
                      </span>
                      <span className="font-code-md text-code-md text-outline">{evt.timestamp}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface leading-snug">{evt.message}</p>
                    <div className="text-outline font-code-md text-code-md mt-1">{evt.detail}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 bg-surface-container flex items-center justify-between text-outline font-label-sm text-label-sm border-t border-outline-variant/30">
              <span>FAILOVER LATENCY BUDGET: 2,500ms</span>
              <span className="text-primary font-code-md text-code-md">CIRCUIT MESH: NOMINAL</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
