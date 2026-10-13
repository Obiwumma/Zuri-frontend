'use client';

import React, { useState } from 'react';
import { KpiTile } from '@/components/ui/KpiTile';

interface DecisionLogItem {
  reqId: string;
  time: string;
  classification: string;
  tier: string;
  model: string;
  tierColor: string;
  reason: string;
  status: string;
  statusCode: string;
  statusBadgeClass: string;
  latency: string;
  latencyColor: string;
  origin: string;
  studentHash: string;
  prompt: string;
  tokens: string;
  naiveCost: string;
  billedCost: string;
  intent: string;
  confScore: string;
  confWidth: string;
  complexity: string;
  docDepth: string;
  classifierLatency: string;
  assignedTier: string;
  assignedTierClass: string;
  dispatchedNode: string;
  matchMetric: string;
  interception: string;
  policyDirective: string;
  reasonText: string;
  fallbackTriggered: string;
  fallbackTriggeredClass: string;
  circuitStatus: string;
  standbyPool: string;
  totalLatency: string;
  traceId: string;
  ingressNode: string;
  cacheKey: string;
  alternatives: Array<{ label: string; val: string; cls: string }>;
  waterfall: Array<{ label: string; val: string; pct: string; color: string }>;
}

const decisionDataset: Record<string, DecisionLogItem> = {
  req_9c14a82e: {
    reqId: 'req_9c14a82e',
    time: '15:29:12',
    classification: 'Syllabus Factoid',
    tier: 'T1 Semantic Cache',
    model: 'Qdrant NVMe [cos 0.984]',
    tierColor: 'text-primary',
    reason: 'Lowest-cost path satisfying context and quality requirements.',
    status: '200 CACHE',
    statusCode: '200 Intercepted (Cache Hit)',
    statusBadgeClass: 'bg-primary/10 border-primary/30 text-primary',
    latency: '15.4ms',
    latencyColor: 'text-primary',
    origin: 'Oxford-Central // CS-204 Algorithmic Complexity',
    studentHash: 'usr_anon_49c2a8f09',
    prompt: '“What is the late submission penalty policy for Problem Set 3 according to the syllabus?”',
    tokens: '28 tokens',
    naiveCost: '$0.00084',
    billedCost: '$0.00000 (Free)',
    intent: 'Syllabus Policy Lookup',
    confScore: '0.992',
    confWidth: '99.2%',
    complexity: 'Low (Deterministic Factoid)',
    docDepth: 'Single Document Node (<4k tokens)',
    classifierLatency: '3.2ms (Edge ONNX classifier)',
    assignedTier: 'Tier 1 // Semantic & Context Cache',
    assignedTierClass: 'bg-primary/10 border-primary/30 text-primary',
    dispatchedNode: 'Qdrant NVMe Cluster (eu-west-1b)',
    matchMetric: 'Cosine Similarity: 0.984 (Threshold >= 0.960)',
    interception: 'Intercepted before Tier 3 Frontier dispatch',
    policyDirective: 'POLICY_LEAST_COST_QUALITY_SUFFICIENT',
    reasonText:
      'Lowest-cost path satisfying context and quality requirements. Ingress embedding matched authenticated course syllabus node with 0.984 semantic fidelity. Zero LLM tokens consumed.',
    fallbackTriggered: 'No (Primary Path Nominal)',
    fallbackTriggeredClass: 'text-primary',
    circuitStatus: 'Closed (Healthy)',
    standbyPool: 'Anthropic Haiku → OpenAI mini',
    totalLatency: '15.4ms total (p95: 42ms)',
    traceId: 'trace_8fa90b41e3d09a2',
    ingressNode: 'fra-edge-09.lexi.internal',
    cacheKey: 'sha256:7c91e4a8b012...',
    alternatives: [
      { label: 'Tier 0 Rule Cache:', val: 'MISS (query phrasing varied)', cls: 'text-outline' },
      { label: 'Tier 1 Semantic Cache:', val: 'HIT (0.984 >= 0.960) → SELECTED', cls: 'text-primary font-bold' },
      { label: 'Tier 2 Local Triton 7B:', val: 'BYPASSED (T1 cache satisfied)', cls: 'text-outline' },
      { label: 'Tier 3 Claude Haiku:', val: 'BYPASSED (saved $0.00084)', cls: 'text-primary font-medium' },
      { label: 'Tier 4 Claude Sonnet:', val: 'BYPASSED', cls: 'text-outline' },
    ],
    waterfall: [
      { label: 'Ingress Envoy Gateway', val: '1.1ms', pct: '7%', color: 'bg-outline' },
      { label: 'ONNX Classification & Embedding', val: '4.2ms', pct: '27%', color: 'bg-tertiary' },
      { label: 'Qdrant Vector Cache Query', val: '8.7ms', pct: '56%', color: 'bg-primary' },
      { label: 'Payload Assembly & Egress', val: '1.4ms', pct: '9%', color: 'bg-outline' },
    ],
  },
  req_4b77f102: {
    reqId: 'req_4b77f102',
    time: '15:28:58',
    classification: 'Course Policy',
    tier: 'T0 Deterministic',
    model: 'Rule Index [Zero-Compute]',
    tierColor: 'text-primary',
    reason: 'Exact query hash matched in-memory syllabus index; bypassed LLM.',
    status: '200 CACHE',
    statusCode: '200 Exact Rule Match (T0)',
    statusBadgeClass: 'bg-primary/10 border-primary/30 text-primary',
    latency: '1.8ms',
    latencyColor: 'text-primary',
    origin: 'ETH-Zurich // PHY-101 Classical Mechanics',
    studentHash: 'usr_anon_88d31cc21',
    prompt: '“Where are Dr. Meyer’s office hours located on Thursdays?”',
    tokens: '14 tokens',
    naiveCost: '$0.00042',
    billedCost: '$0.00000 (Free)',
    intent: 'Office Hours Directory',
    confScore: '1.000',
    confWidth: '100%',
    complexity: 'Zero-Inference Index',
    docDepth: 'In-Memory Hash Node',
    classifierLatency: '0.4ms (Bypassed)',
    assignedTier: 'Tier 0 // Deterministic Rule Index',
    assignedTierClass: 'bg-primary/10 border-primary/30 text-primary',
    dispatchedNode: 'Redis L1 Memory Fabric (fra-01)',
    matchMetric: 'Exact SHA-256 Hash Match (1.000)',
    interception: 'Interception at Ingress Mesh Gateway',
    policyDirective: 'POLICY_DETERMINISTIC_CACHE_FIRST',
    reasonText:
      'Exact query hash matched in-memory syllabus index; bypassed LLM. Zero GPU or Frontier compute invoked.',
    fallbackTriggered: 'No (T0 Exact Match)',
    fallbackTriggeredClass: 'text-primary',
    circuitStatus: 'Closed (Healthy)',
    standbyPool: 'Qdrant NVMe Semantic Standby',
    totalLatency: '1.8ms total (p95: 42ms)',
    traceId: 'trace_11ab7284f09d3',
    ingressNode: 'fra-edge-02.lexi.internal',
    cacheKey: 'sha256:39bf2049d91a...',
    alternatives: [
      { label: 'Tier 0 Rule Cache:', val: 'EXACT MATCH (1.000) → SELECTED', cls: 'text-primary font-bold' },
      { label: 'Tier 1 Semantic Cache:', val: 'BYPASSED (T0 hit)', cls: 'text-outline' },
      { label: 'Tier 2 Local Triton 7B:', val: 'BYPASSED', cls: 'text-outline' },
      { label: 'Tier 3 Claude Haiku:', val: 'BYPASSED (saved $0.00042)', cls: 'text-primary font-medium' },
      { label: 'Tier 4 Claude Sonnet:', val: 'BYPASSED', cls: 'text-outline' },
    ],
    waterfall: [
      { label: 'Ingress Envoy Gateway', val: '0.8ms', pct: '44%', color: 'bg-outline' },
      { label: 'L1 Memory Hash Lookup', val: '0.6ms', pct: '33%', color: 'bg-primary' },
      { label: 'Payload Serialization', val: '0.4ms', pct: '23%', color: 'bg-tertiary' },
    ],
  },
  req_2e88a319: {
    reqId: 'req_2e88a319',
    time: '15:28:41',
    classification: 'Rubric Evaluation',
    tier: 'T2 Edge 7B',
    model: 'Triton Mistral-7B',
    tierColor: 'text-secondary',
    reason: 'Distilled 7B confidence score 0.942 met rubric assessment quality floor.',
    status: '200 OK',
    statusCode: '200 Dispatched (T2 Triton)',
    statusBadgeClass: 'bg-surface-container-high border-outline-variant/40 text-on-surface',
    latency: '112ms',
    latencyColor: 'text-tertiary',
    origin: 'Stanford // CS-106A Code in Place',
    studentHash: 'usr_anon_22ef044b1',
    prompt: '“Evaluate my Python binary search implementation against the time-complexity rubric.”',
    tokens: '340 prompt tokens',
    naiveCost: '$0.00410',
    billedCost: '$0.00012 (Edge GPU)',
    intent: 'Rubric Evaluation & Code Feedback',
    confScore: '0.942',
    confWidth: '94.2%',
    complexity: 'Moderate (Rubric Parsing)',
    docDepth: 'Dual AST Document (8k context)',
    classifierLatency: '4.1ms (Edge ONNX)',
    assignedTier: 'Tier 2 // Local Edge Triton 7B',
    assignedTierClass: 'bg-secondary/15 border-secondary/40 text-secondary',
    dispatchedNode: 'Triton VLLM Worker 14 (H100 NVLink)',
    matchMetric: 'Confidence: 0.942 >= Rubric Floor (0.90)',
    interception: 'Bypassed T3/T4 Frontier via distilled model',
    policyDirective: 'POLICY_EDGE_DISTILLED_PREFERENTIAL',
    reasonText:
      'Distilled 7B confidence score 0.942 met rubric assessment quality floor. Successfully evaluated on local Triton cluster without egress to commercial cloud.',
    fallbackTriggered: 'No (Local Model Confident)',
    fallbackTriggeredClass: 'text-primary',
    circuitStatus: 'Closed (Healthy)',
    standbyPool: 'Claude 3.5 Haiku Standby',
    totalLatency: '112ms total (p95: 42ms)',
    traceId: 'trace_9934fc0284e6a',
    ingressNode: 'us-east-edge-04.lexi.internal',
    cacheKey: 'sha256:e3119ac0340b...',
    alternatives: [
      { label: 'Tier 0 Rule Cache:', val: 'MISS (dynamic code input)', cls: 'text-outline' },
      { label: 'Tier 1 Semantic Cache:', val: 'MISS (student-authored code unique)', cls: 'text-outline' },
      { label: 'Tier 2 Local Triton 7B:', val: 'SATISFIED (score 0.942) → SELECTED', cls: 'text-secondary font-bold' },
      { label: 'Tier 3 Claude Haiku:', val: 'BYPASSED (saved $0.00398)', cls: 'text-primary font-medium' },
      { label: 'Tier 4 Claude Sonnet:', val: 'BYPASSED', cls: 'text-outline' },
    ],
    waterfall: [
      { label: 'Ingress Envoy Gateway', val: '1.2ms', pct: '2%', color: 'bg-outline' },
      { label: 'ONNX Classification', val: '4.1ms', pct: '4%', color: 'bg-tertiary' },
      { label: 'Triton Mistral-7B Inference', val: '102.5ms', pct: '91%', color: 'bg-secondary' },
      { label: 'Stream Egress Assembly', val: '4.2ms', pct: '3%', color: 'bg-outline' },
    ],
  },
  req_8d11c055: {
    reqId: 'req_8d11c055',
    time: '15:27:19',
    classification: 'Multi-Doc Synthesis',
    tier: 'T4 Frontier (Rerouted)',
    model: 'GPT-4o [Fallback]',
    tierColor: 'text-secondary',
    reason: 'Claude Sonnet rate limit 429 spike; auto-rerouted to GPT-4o fallback pool.',
    status: 'FALLBACK',
    statusCode: 'Fallback Reroute 200 (429 Rate Limit)',
    statusBadgeClass: 'bg-secondary/15 border-secondary/40 text-secondary',
    latency: '1,380ms',
    latencyColor: 'text-secondary',
    origin: 'Berkeley // EECS-189 Intro to Machine Learning',
    studentHash: 'usr_anon_67bb101e4',
    prompt:
      '“Synthesize the cross-lecture derivation between SVM dual formulation in Lecture 4 and the Kernel Trick in Lecture 7.”',
    tokens: '1,240 tokens + 42k doc context',
    naiveCost: '$0.02480',
    billedCost: '$0.02610 (OpenAI Fallback)',
    intent: 'Multi-Doc Mathematical Synthesis',
    confScore: '0.988',
    confWidth: '98.8%',
    complexity: 'Critical Frontier (Deep Math)',
    docDepth: 'Multi-Document (>40k tokens)',
    classifierLatency: '6.8ms (Deep Embedding)',
    assignedTier: 'Tier 4 // Deep Frontier (Failover Pool)',
    assignedTierClass: 'bg-secondary/15 border-secondary/40 text-secondary',
    dispatchedNode: 'OpenAI GPT-4o (us-east-1 Failover)',
    matchMetric: 'Target: Claude 3.5 Sonnet -> FAILED (HTTP 429)',
    interception: 'Autonomous Failover Circuit Triggered',
    policyDirective: 'POLICY_HIGH_AVAILABILITY_FALLBACK',
    reasonText:
      'Claude Sonnet rate limit 429 spike; auto-rerouted to GPT-4o fallback pool. Mesh circuit breaker transparently preserved student request SLA.',
    fallbackTriggered: 'Yes (Anthropic 429 RateLimitBreached)',
    fallbackTriggeredClass: 'text-secondary font-bold',
    circuitStatus: 'Degraded (Tripped Sonnet Mesh Pool)',
    standbyPool: 'Active in Fallback Secondary (GPT-4o)',
    totalLatency: '1,380ms total (p95: 42ms)',
    traceId: 'trace_ff00482b9914c',
    ingressNode: 'us-west-edge-01.lexi.internal',
    cacheKey: 'sha256:1099ff8274ac...',
    alternatives: [
      { label: 'Tier 0 Rule Cache:', val: 'MISS (novel synthesis)', cls: 'text-outline' },
      { label: 'Tier 1 Semantic Cache:', val: 'MISS (novel multi-document context)', cls: 'text-outline' },
      { label: 'Tier 2 Local Triton 7B:', val: 'INSUFFICIENT (context > 32k tokens)', cls: 'text-outline' },
      { label: 'Tier 4 Claude Sonnet:', val: 'FAILED (HTTP 429 Rate Limit Exceeded)', cls: 'text-error font-bold' },
      { label: 'Tier 4 GPT-4o Fallback:', val: 'REROUTED & DISPATCHED → SELECTED', cls: 'text-secondary font-bold' },
    ],
    waterfall: [
      { label: 'Ingress Envoy Gateway', val: '1.4ms', pct: '1%', color: 'bg-outline' },
      { label: 'Multi-Doc Vector Retrieval', val: '48.2ms', pct: '3%', color: 'bg-tertiary' },
      { label: 'Anthropic Sonnet (429 Timeout)', val: '280.0ms', pct: '20%', color: 'bg-error' },
      { label: 'Circuit Breaker Fallback to GPT-4o', val: '1050.4ms', pct: '76%', color: 'bg-secondary' },
    ],
  },
};

export default function OpsRoutingPage() {
  const [selectedReqId, setSelectedReqId] = useState<string>('req_9c14a82e');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('24h');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const selectedData = decisionDataset[selectedReqId] || decisionDataset['req_9c14a82e'];

  const allRows = Object.values(decisionDataset);
  const filteredRows = allRows.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.reqId.toLowerCase().includes(q) ||
      r.classification.toLowerCase().includes(q) ||
      r.model.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface-container-lowest">
      {/* 1. OPERATIONS CONTEXT HEADER */}
      <section className="flex flex-col border-b border-outline-variant/30 bg-surface-container-lowest px-6 py-4">
        {/* Breadcrumb & Status Pips */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant/80 tracking-widest uppercase">
            <span>OPERATIONS</span>
            <span className="text-outline-variant">//</span>
            <span>AI INFRASTRUCTURE &amp; ROUTING ENGINE</span>
            <span className="text-outline-variant">//</span>
            <span className="text-primary font-semibold">ROUTING DECISION LOG</span>
          </div>
          {/* Live Stream Indicator & Telemetry Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container border border-outline-variant/40 font-label-sm text-label-sm text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-on-surface-variant">Active Mesh:</span>
              <span className="text-primary font-medium">Envoy v1.29</span>
            </div>
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container border border-outline-variant/40 font-label-sm text-label-sm text-on-surface-variant">
              <span>Window:</span>
              <span className="text-on-surface font-medium">Real-time Ingress</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container border border-outline-variant/40 font-label-sm text-label-sm text-on-surface-variant">
              <span>Intercept Ratio:</span>
              <span className="text-primary font-medium">68.4% T0–T1</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container border border-outline-variant/40 font-label-sm text-label-sm text-on-surface-variant">
              <span>Decisions 24h:</span>
              <span className="font-code-md text-code-md text-on-surface font-semibold">1,642,890</span>
            </div>
          </div>
        </div>

        {/* Title & Action Bar */}
        <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
                AI Routing Decision Log
              </h1>
              <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/40 font-label-sm text-label-sm text-primary uppercase font-semibold">
                v2.4 Deterministic Engine
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Deterministic inspection of real-time request classification, tiered dispatch rationale, semantic cache interception, and provider failovers across the Lexi inference mesh.
            </p>
          </div>

          {/* Controls Ribbon */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex rounded border border-outline-variant/40 bg-surface-container-low p-0.5">
              {['15m', '1h', '24h', '7d'].map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-2.5 py-1 text-label-sm font-label-sm transition-colors rounded cursor-pointer ${
                    selectedTimeframe === tf
                      ? 'bg-surface-container-high text-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1.5 h-8 px-3 rounded border border-outline-variant/40 font-label-sm text-label-sm transition-colors cursor-pointer ${
                autoRefresh
                  ? 'bg-surface-container-low text-on-surface border-outline-variant'
                  : 'bg-surface-container-lowest text-outline opacity-60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-primary ${autoRefresh ? 'animate-ping' : ''}`}></span>
              <span>{autoRefresh ? 'Auto-refresh 5s' : 'Paused'}</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:border-outline transition-colors font-label-sm text-label-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Export JSONL</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 rounded bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-sm text-label-sm font-bold uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">play_arrow</span>
              <span>Simulate Route</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SUMMARY KPI RIBBON (Reusing KpiTile) */}
      <section className="p-6 bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiTile
            icon="alt_route"
            label="Classified Ingress"
            progressWidth="100%"
            subtext={
              <>
                Current Throughput: <span className="text-on-surface font-semibold">2,380 req/s</span>
              </>
            }
            trend="100% evaluated"
            trendDirection="up"
            value="1,642,890"
          />
          <KpiTile
            icon="cached"
            label="Intercepted / Cached"
            progressWidth="62.8%"
            subtext={
              <>
                Zero Frontier LLM Cost: <span className="text-primary font-semibold">+$1,842.20/day</span>
              </>
            }
            trend="62.8% T0/T1"
            trendDirection="up"
            value="1,031,735"
          />
          <KpiTile
            icon="memory"
            label="Edge / Distilled Tier 2"
            progressWidth="22.4%"
            subtext={
              <>
                Triton Cluster Mean Latency: <span className="text-tertiary font-semibold">110ms</span>
              </>
            }
            trend="22.4% local"
            trendDirection="neutral"
            value="368,000"
          />
          <KpiTile
            icon="hub"
            label="Frontier Tier 3/4 Routed"
            progressWidth="14.8%"
            subtext={
              <>
                Fallback Reroutes: <span className="text-secondary font-semibold">674 events (0.041%)</span>
              </>
            }
            trend="14.8% monitored"
            trendDirection="down"
            value="243,155"
          />
        </div>
      </section>

      {/* 3. OPERATIONAL FILTER BAR */}
      <section className="border-b border-outline-variant/30 bg-surface-container-lowest p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="xl:col-span-4 relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-outline">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search request ID (req_9c14a8...), trace, prompt or course..."
              className="w-full h-8 pl-8 pr-12 rounded bg-surface-container-low border border-outline-variant/40 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-colors"
            />
            <kbd className="absolute right-2 top-1.5 px-1 py-0.5 rounded bg-surface-container-high border border-outline-variant/40 font-label-sm text-[9px] text-on-surface-variant">
              ⌘F
            </kbd>
          </div>

          {/* Timeframe dropdown */}
          <div className="xl:col-span-2 relative">
            <div className="flex items-center justify-between h-8 px-2.5 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm font-body-sm cursor-pointer hover:border-outline">
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
                <span className="truncate">14:30 – 15:30 UTC</span>
              </div>
              <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
            </div>
          </div>

          {/* Tier dropdown */}
          <div className="xl:col-span-2">
            <select className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm font-body-sm focus:outline-none focus:border-primary">
              <option>Tier: All Tiers (T0–T4)</option>
              <option>Tier 0 Rule Index</option>
              <option>Tier 1 Semantic Cache</option>
              <option>Tier 2 Triton Edge 7B</option>
              <option>Tier 3 Mid-Frontier</option>
              <option>Tier 4 Deep Multi-Doc</option>
            </select>
          </div>

          {/* Classification dropdown */}
          <div className="xl:col-span-2">
            <select className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm font-body-sm focus:outline-none focus:border-primary">
              <option>Class: All Classifications</option>
              <option>Syllabus Factoid</option>
              <option>Assignment Q&amp;A</option>
              <option>Rubric Evaluation</option>
              <option>Multi-Doc Synthesis</option>
              <option>Code Debugging</option>
              <option>Course Policy</option>
            </select>
          </div>

          {/* Model dropdown */}
          <div className="xl:col-span-2">
            <select className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm font-body-sm focus:outline-none focus:border-primary">
              <option>Model: All Providers</option>
              <option>Zero-Compute (T0/T1)</option>
              <option>Qdrant NVMe Cache</option>
              <option>Triton Mistral-7B</option>
              <option>Claude 3.5 Haiku</option>
              <option>Claude 3.5 Sonnet</option>
              <option>GPT-4o (Fallback)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Summary */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-outline-variant/20 font-label-sm text-label-sm text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Displaying <strong className="text-on-surface">{filteredRows.length}</strong> of{' '}
              <strong className="text-on-surface">14,820</strong> logged decisions in circular buffer
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-outline">Buffer retention: 60 minutes rolling</span>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-primary hover:underline font-label-sm text-label-sm cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* 4. MASTER-DETAIL TWO-COLUMN VIEW */}
      <section className="grid grid-cols-1 xl:grid-cols-12 w-full min-h-[calc(100vh-270px)] bg-surface-container-lowest">
        {/* LEFT PANEL: Decision Log Master Table */}
        <div className="xl:col-span-7 border-r border-outline-variant/30 flex flex-col bg-surface-container-low/50 overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 h-9 px-4 items-center bg-surface-container-low border-b border-outline-variant/40 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant select-none sticky top-0 z-20">
            <div className="col-span-2">Request ID</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-2">Classification</div>
            <div className="col-span-2">Tier &amp; Model</div>
            <div className="col-span-3">Decision Reason</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-right">Latency</div>
          </div>

          {/* Table Body Rows */}
          <div className="divide-y divide-outline-variant/25 font-body-sm text-body-sm flex-1">
            {filteredRows.map((row) => {
              const isSelected = row.reqId === selectedReqId;
              return (
                <div
                  key={row.reqId}
                  onClick={() => setSelectedReqId(row.reqId)}
                  className={`decision-row cursor-pointer grid grid-cols-12 gap-2 px-4 py-2.5 items-center transition-colors ${
                    isSelected
                      ? 'bg-surface-container-high border-l-2 border-primary text-on-surface'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <div className="col-span-2 flex items-center gap-1 font-code-md text-code-md font-semibold text-primary">
                    <span className="material-symbols-outlined text-[13px] text-outline">terminal</span>
                    <span>{row.reqId}</span>
                  </div>
                  <div className="col-span-1 font-code-md text-code-md text-on-surface-variant">{row.time}</div>
                  <div className="col-span-2">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant/40 font-label-sm text-[10px] text-on-surface">
                      {row.classification}
                    </span>
                  </div>
                  <div className="col-span-2 flex flex-col">
                    <span className={`font-label-sm text-label-sm font-semibold ${row.tierColor}`}>{row.tier}</span>
                    <span className="font-code-md text-[11px] text-on-surface-variant truncate">{row.model}</span>
                  </div>
                  <div className="col-span-3 text-on-surface-variant text-[12px] leading-tight truncate">
                    {row.reason}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className={`px-1.5 py-0.5 rounded font-label-sm text-[9px] font-bold ${row.statusBadgeClass}`}>
                      {row.status}
                    </span>
                  </div>
                  <div className={`col-span-1 text-right font-code-md text-code-md font-medium ${row.latencyColor}`}>
                    {row.latency}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination & Stream Controller Footer */}
          <div className="mt-auto border-t border-outline-variant/30 bg-surface-container-low px-4 py-2 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span>Buffer Page 1 of 185</span>
              <span className="text-outline-variant">|</span>
              <span>Window size: 50 / batch</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled
                type="button"
                className="px-2 py-1 rounded bg-surface-container border border-outline-variant/40 hover:bg-surface-container-high text-on-surface disabled:opacity-40"
              >
                PREV
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded bg-surface-container border border-outline-variant/40 hover:bg-surface-container-high text-on-surface"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Detailed Inspection Drawer */}
        <div className="xl:col-span-5 flex flex-col bg-surface-container-lowest border-l border-outline-variant/30 overflow-y-auto">
          {/* Drawer Sticky Subheader */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-surface-container-low border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Routing Inspection //
              </span>
              <span className="font-code-md text-code-md text-primary font-bold">{selectedData.reqId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold ${selectedData.statusBadgeClass}`}>
                {selectedData.statusCode}
              </span>
              <button
                type="button"
                title="Copy JSON Log"
                className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </div>

          {/* Drawer Body Content */}
          <div className="p-6 space-y-6 text-body-md font-body-md">
            {/* Section 1: Ingress Request Telemetry */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                  1. Ingress Request Telemetry
                </span>
                <span className="font-code-md text-[11px] text-outline">FERPA COMPLIANT</span>
              </div>
              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30 space-y-2.5">
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Client Origin:</span>
                  <span className="font-code-md text-code-md text-on-surface">{selectedData.origin}</span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Student Identity Hash:</span>
                  <span className="font-code-md text-code-md text-outline">{selectedData.studentHash}</span>
                </div>
                <div className="pt-1">
                  <span className="text-body-sm font-body-sm text-on-surface-variant block mb-1">Ingress Prompt:</span>
                  <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/25 font-body-sm text-body-sm text-on-surface italic leading-relaxed">
                    {selectedData.prompt}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-outline-variant/20 font-label-sm text-label-sm">
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Ingress Tokens</span>
                    <span className="font-code-md text-code-md text-on-surface font-semibold">{selectedData.tokens}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Naive Cost</span>
                    <span className="font-code-md text-code-md text-secondary">{selectedData.naiveCost}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Billed Cost</span>
                    <span className="font-code-md text-code-md text-primary font-semibold">{selectedData.billedCost}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Classification Engine Analysis */}
            <div className="space-y-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                2. Classification Engine Analysis
              </span>
              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-body-sm font-body-sm">Primary Detected Intent:</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface font-semibold">
                    {selectedData.intent}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Intent Confidence:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: selectedData.confWidth }}></div>
                    </div>
                    <span className="font-code-md text-code-md text-primary font-bold">{selectedData.confScore}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Reasoning Complexity:</span>
                  <span className="font-code-md text-code-md text-on-surface">{selectedData.complexity}</span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Required Document Depth:</span>
                  <span className="font-code-md text-code-md text-on-surface-variant">{selectedData.docDepth}</span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Classifier Latency:</span>
                  <span className="font-code-md text-code-md text-tertiary">{selectedData.classifierLatency}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Routing Tier & Path Selection */}
            <div className="space-y-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                3. Routing Tier &amp; Path Selection
              </span>
              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-body-sm font-body-sm">Assigned Tier:</span>
                  <span className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-bold ${selectedData.assignedTierClass}`}>
                    {selectedData.assignedTier}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Dispatched Node:</span>
                  <span className="font-code-md text-code-md text-on-surface">{selectedData.dispatchedNode}</span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Cosine Similarity:</span>
                  <span className="font-code-md text-code-md text-primary font-bold">{selectedData.matchMetric}</span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Interception State:</span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">{selectedData.interception}</span>
                </div>
              </div>
            </div>

            {/* Section 4: Decision Reason & Policy Engine */}
            <div className="space-y-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                4. Decision Reason &amp; Policy Engine
              </span>
              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Active Policy Directive:</span>
                  <span className="font-code-md text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-tertiary">
                    {selectedData.policyDirective}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-surface-container-lowest border-l-2 border-primary font-body-sm text-body-sm text-on-surface leading-relaxed">
                  {selectedData.reasonText}
                </div>
                {/* Alternative Path Evaluation Tree */}
                <div className="pt-1">
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Evaluated Candidate Alternatives:
                  </span>
                  <div className="space-y-1 font-code-md text-[11px]">
                    {selectedData.alternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-2 py-1 rounded ${
                          alt.val.includes('SELECTED')
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-surface-container-lowest'
                        }`}
                      >
                        <span className="text-on-surface-variant">{alt.label}</span>
                        <span className={alt.cls}>{alt.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Resilience & Circuit Breaker */}
            <div className="space-y-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                5. Resilience &amp; Circuit Breaker
              </span>
              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30 space-y-2 text-body-sm font-body-sm">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Fallback Triggered:</span>
                  <span className={`font-code-md text-code-md ${selectedData.fallbackTriggeredClass}`}>
                    {selectedData.fallbackTriggered}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Circuit Breaker Status:</span>
                  <span className="flex items-center gap-1.5 font-label-sm text-label-sm text-primary">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedData.fallbackTriggered.startsWith('Yes') ? 'bg-secondary' : 'bg-primary'
                      }`}
                    ></span>
                    {selectedData.circuitStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Standby Failover Pool:</span>
                  <span className="font-code-md text-code-md text-on-surface-variant">{selectedData.standbyPool}</span>
                </div>
              </div>
            </div>

            {/* Section 6: Latency Breakdown Waterfall */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                  6. Latency Waterfall
                </span>
                <span className="font-code-md text-code-md text-primary font-bold">{selectedData.totalLatency}</span>
              </div>
              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30 space-y-2 font-code-md text-[11px]">
                {selectedData.waterfall.map((wf, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-on-surface-variant mb-1">
                      <span>{wf.label}</span>
                      <span className="text-on-surface">{wf.val}</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded overflow-hidden">
                      <div className={`h-full ${wf.color}`} style={{ width: wf.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7: Technical Metadata & Audit */}
            <div className="space-y-2 pb-6">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                7. Cryptographic Audit &amp; Metadata
              </span>
              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30 space-y-1.5 font-code-md text-[11px]">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Trace ID:</span>
                  <span className="text-on-surface select-all">{selectedData.traceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Ingress Node:</span>
                  <span className="text-on-surface">{selectedData.ingressNode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Cache Key:</span>
                  <span className="text-outline truncate max-w-[200px]" title={selectedData.cacheKey}>
                    {selectedData.cacheKey}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Mesh Security:</span>
                  <span className="text-primary font-medium">mTLS v1.3 // TLS_AES_256_GCM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
