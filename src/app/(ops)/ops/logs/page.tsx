'use client';

import React, { useState } from 'react';
import { KpiTile } from '@/components/ui/KpiTile';

interface LogEntry {
  id: string;
  timestamp: string;
  ms: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRIT';
  service: string;
  serviceColor: string;
  message: React.ReactNode;
  reqId: string;
  statusCode: string;
  statusColor: string;
  rawJson: string;
  diagnosticNote: string;
  traceId: string;
  pod: string;
  host: string;
  region: string;
  routePath: string;
  method: string;
  clientOrigin: string;
  ip: string;
  latency: string;
  attributes: Record<string, string>;
}

const mockLogs: LogEntry[] = [
  {
    id: 'req_8d11c055',
    timestamp: '15:29:44',
    ms: '.812',
    level: 'ERROR',
    service: 'ai-routing.router',
    serviceColor: 'bg-tertiary/70 text-tertiary',
    message: (
      <>
        <span className="text-secondary font-medium">Claude Sonnet rate limit (429) hit;</span> automated circuit breaker engaged -&gt; rerouted to GPT-4o fallback pool
      </>
    ),
    reqId: 'req_8d11c055',
    statusCode: '429',
    statusColor: 'text-secondary',
    diagnosticNote: 'Claude Sonnet rate limit (429) hit; automated circuit breaker engaged -> rerouted to GPT-4o fallback pool',
    traceId: 'trace_8fa90b41',
    pod: 'pod-routing-7f89d-21',
    host: 'fra-edge-09.ops.lan',
    region: 'eu-central-1 (Frankfurt)',
    routePath: '/v1/chat/completions/academic-routing',
    method: 'POST (HTTP/2)',
    clientOrigin: 'Oxford-Central // CS-204',
    ip: '10.240.44.18',
    latency: '1,380ms',
    attributes: {
      cache_layer: 'bypass_unmet_threshold',
      fallback_target: 'openai.gpt-4o.academic',
      memory_rss: '412MB',
      client_tls: 'TLS_1.3_AES_256_GCM',
      environment: 'prod-cluster-a',
    },
    rawJson: `{
  "timestamp": "2025-05-18T15:29:44.812Z",
  "level": "ERROR",
  "service": "ai-routing.router",
  "request_id": "req_8d11c055",
  "trace_id": "trace_8fa90b41",
  "status": 429,
  "message": "Claude Sonnet rate limit (429) hit; automated circuit breaker engaged -> rerouted to GPT-4o fallback pool",
  "attributes": {
    "upstream": "anthropic.claude-3-5-sonnet",
    "fallback": "openai.gpt-4o.academic",
    "retry_after_sec": 4,
    "tokens_requested": 1840
  }
}`,
  },
  {
    id: 'req_29a00cf1',
    timestamp: '15:29:43',
    ms: '.904',
    level: 'CRIT',
    service: 'db-postgres.replica-2',
    serviceColor: 'bg-error text-error',
    message: (
      <>
        WAL replay lag exceeded threshold: <span className="text-error font-medium">1,480ms (&gt;1000ms max)</span>. Read traffic reallocated to replica-1
      </>
    ),
    reqId: 'req_db_rep02',
    statusCode: '503',
    statusColor: 'text-error',
    diagnosticNote: 'PostgreSQL replica-2 WAL replay threshold exceeded. Auto-failover triggered to replica-1.',
    traceId: 'trace_db9924a1',
    pod: 'pod-pg-replica-02',
    host: 'fra-db-node-02.ops.lan',
    region: 'eu-central-1 (Frankfurt)',
    routePath: '/internal/db/wal-stream',
    method: 'STREAM (gRPC)',
    clientOrigin: 'Internal Postgres Mesh',
    ip: '10.240.12.98',
    latency: '1,480ms',
    attributes: {
      wal_lag_bytes: '42.8MB',
      replica_state: 'degraded',
      failover_node: 'db-postgres.replica-1',
    },
    rawJson: `{
  "timestamp": "2025-05-18T15:29:43.904Z",
  "level": "CRIT",
  "service": "db-postgres.replica-2",
  "request_id": "req_db_rep02",
  "trace_id": "trace_db9924a1",
  "status": 503,
  "message": "WAL replay lag exceeded threshold: 1,480ms (>1000ms max). Read traffic reallocated to replica-1"
}`,
  },
  {
    id: 'req_9b4e112a',
    timestamp: '15:29:42',
    ms: '.118',
    level: 'WARN',
    service: 'ocr-extractor.pipeline',
    serviceColor: 'bg-secondary text-secondary',
    message: (
      <>PDF rasterizer memory soft-ceiling (820MB/1024MB); triggering garbage compaction on worker-04</>
    ),
    reqId: 'req_9b4e112a',
    statusCode: '200',
    statusColor: 'text-on-surface-variant',
    diagnosticNote: 'PDF rasterizer worker memory high watermark reached. Garbage collection executed successfully.',
    traceId: 'trace_ocr7741f',
    pod: 'pod-ocr-worker-04',
    host: 'fra-gpu-worker-04.ops.lan',
    region: 'eu-central-1 (Frankfurt)',
    routePath: '/api/v1/extract/ocr-pdf',
    method: 'POST',
    clientOrigin: 'Document Pipeline Client',
    ip: '10.240.18.42',
    latency: '410ms',
    attributes: {
      memory_rss: '820MB',
      gc_reclaimed: '340MB',
      worker_id: 'ocr-worker-04',
    },
    rawJson: `{
  "timestamp": "2025-05-18T15:29:42.118Z",
  "level": "WARN",
  "service": "ocr-extractor.pipeline",
  "request_id": "req_9b4e112a",
  "status": 200
}`,
  },
  {
    id: 'req_14cd8890',
    timestamp: '15:29:41',
    ms: '.650',
    level: 'INFO',
    service: 'api-gateway.ingress',
    serviceColor: 'bg-outline text-outline',
    message: <>POST /v1/chat/completions/academic-routing - HTTP/2 TLS 1.3 Oxford-Central 204ms</>,
    reqId: 'req_14cd8890',
    statusCode: '200',
    statusColor: 'text-primary',
    diagnosticNote: 'Successful API ingress request dispatched to academic routing engine.',
    traceId: 'trace_gw1029ab',
    pod: 'pod-envoy-ingress-11',
    host: 'fra-edge-01.ops.lan',
    region: 'eu-central-1 (Frankfurt)',
    routePath: '/v1/chat/completions/academic-routing',
    method: 'POST (HTTP/2)',
    clientOrigin: 'Oxford-Central // CS-204',
    ip: '10.240.44.18',
    latency: '204ms',
    attributes: {
      proto: 'HTTP/2',
      cipher: 'TLS_AES_256_GCM',
    },
    rawJson: `{
  "timestamp": "2025-05-18T15:29:41.650Z",
  "level": "INFO",
  "service": "api-gateway.ingress",
  "request_id": "req_14cd8890",
  "status": 200
}`,
  },
  {
    id: 'req_55fa4310',
    timestamp: '15:29:40',
    ms: '.231',
    level: 'INFO',
    service: 'auth-vault.enclave',
    serviceColor: 'bg-outline text-outline',
    message: <>HMAC token exchange verified for scope [academic:citations:read] tenant:cambridge-uk</>,
    reqId: 'req_55fa4310',
    statusCode: '200',
    statusColor: 'text-primary',
    diagnosticNote: 'Auth vault verified HMAC token scope for Cambridge UK tenant.',
    traceId: 'trace_vault081e',
    pod: 'pod-vault-enclave-02',
    host: 'fra-sec-02.ops.lan',
    region: 'eu-central-1 (Frankfurt)',
    routePath: '/internal/auth/token-verify',
    method: 'POST',
    clientOrigin: 'Cambridge-UK Federation',
    ip: '10.240.11.04',
    latency: '8.4ms',
    attributes: {
      scope: 'academic:citations:read',
      tenant: 'cambridge-uk',
    },
    rawJson: `{
  "timestamp": "2025-05-18T15:29:40.231Z",
  "level": "INFO",
  "service": "auth-vault.enclave",
  "status": 200
}`,
  },
  {
    id: 'req_aa9012cd',
    timestamp: '15:29:39',
    ms: '.702',
    level: 'ERROR',
    service: 'worker-temporal.jobs',
    serviceColor: 'bg-tertiary/70 text-tertiary',
    message: (
      <>
        Activity timeout on <span className="text-error font-medium">ExtractVectorEmbeddings</span> attempt #3. Non-retryable error signaled
      </>
    ),
    reqId: 'req_aa9012cd',
    statusCode: '504',
    statusColor: 'text-error',
    diagnosticNote: 'Temporal worker background embedding job timed out on attempt 3.',
    traceId: 'trace_temp9042',
    pod: 'pod-temporal-worker-18',
    host: 'fra-worker-08.ops.lan',
    region: 'eu-central-1 (Frankfurt)',
    routePath: '/temporal/activity/ExtractVectorEmbeddings',
    method: 'RPC',
    clientOrigin: 'Temporal Workflow Engine',
    ip: '10.240.32.19',
    latency: '5,000ms',
    attributes: {
      attempt: '3',
      workflow_id: 'wf_embed_9941a',
    },
    rawJson: `{
  "timestamp": "2025-05-18T15:29:39.702Z",
  "level": "ERROR",
  "service": "worker-temporal.jobs",
  "status": 504
}`,
  },
];

export default function OpsLogsPage() {
  const [viewState, setViewState] = useState<number>(1); // 1: Stream+Drawer, 2: Full-Width, 3: Filtered Empty, 4: Error, 5: Loading
  const [isLiveTailing, setIsLiveTailing] = useState<boolean>(true);
  const [selectedLogId, setSelectedLogId] = useState<string>('req_8d11c055');
  const [searchQuery, setSearchQuery] = useState<string>('service:ai-routing.router fallback OR status>=400');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('ai-routing.router');
  const [timeframe, setTimeframe] = useState<string>('1H');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const selectedLog = mockLogs.find((l) => l.id === selectedLogId) || mockLogs[0];

  const filteredLogs = mockLogs.filter((log) => {
    if (viewState === 3) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.id.toLowerCase().includes(q) ||
      log.service.toLowerCase().includes(q) ||
      log.level.toLowerCase().includes(q) ||
      log.statusCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface font-body-md text-on-surface select-none">
      {/* 1. TOP CONSOLE SUB-HEADER & REAL-TIME CONTROLS */}
      <div className="w-full bg-surface-container-low px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-outline-variant/30">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              OPERATIONS INFRASTRUCTURE
            </span>
            <span className="font-label-sm text-label-sm text-outline-variant">/</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              DISTRIBUTED TELEMETRY &amp; LOGGING
            </span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="font-headline-md text-headline-md font-semibold text-on-surface">Logs</h1>
            <div className="flex items-center gap-2 px-2 py-0.5 bg-surface-container rounded">
              <span className="relative flex h-2 w-2">
                {isLiveTailing && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isLiveTailing ? 'bg-primary' : 'bg-outline'
                  }`}
                ></span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface">
                {isLiveTailing ? 'Live Tail Active' : 'Tail Paused'}
              </span>
              <span className="font-label-sm text-label-sm text-outline-variant">•</span>
              <span className="font-label-sm text-label-sm text-primary font-medium">4,820 events/sec</span>
            </div>
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 bg-surface-container rounded text-outline">
              <span className="material-symbols-outlined text-[14px]">memory</span>
              <span className="font-label-sm text-label-sm">Ring Buffer: 50,000 / 50,000 intact</span>
            </div>
          </div>
        </div>

        {/* Right-Hand Header Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Live Tail Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsLiveTailing(!isLiveTailing);
              triggerToast(isLiveTailing ? 'Live tail paused' : 'Live tail resumed');
            }}
            className="h-8 px-2.5 bg-surface-container hover:bg-surface-container-high rounded text-on-surface flex items-center gap-1.5 font-label-md text-label-md transition-colors cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[16px] ${isLiveTailing ? 'text-primary' : 'text-outline'}`}>
              {isLiveTailing ? 'pause' : 'play_arrow'}
            </span>
            <span>{isLiveTailing ? 'PAUSE TAIL' : 'RESUME TAIL'}</span>
          </button>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-surface-container rounded p-0.5 text-on-surface-variant">
            {['15M', '1H', '24H'].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-label-sm font-label-sm rounded transition-colors cursor-pointer ${
                  timeframe === tf ? 'bg-surface-container-highest text-primary font-semibold' : 'hover:text-on-surface'
                }`}
              >
                {tf}
              </button>
            ))}
            <button
              type="button"
              className="px-2 py-1 text-label-sm font-label-sm rounded hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>UTC</span>
              <span className="material-symbols-outlined text-[12px]">calendar_today</span>
            </button>
          </div>

          {/* Export Actions Group */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => triggerToast('Exporting NDJSON stream...')}
              className="h-8 px-2.5 bg-surface-container hover:bg-surface-container-high rounded text-on-surface flex items-center gap-1 font-label-md text-label-md transition-colors cursor-pointer"
              title="Export as NDJSON"
            >
              <span className="material-symbols-outlined text-[15px] text-outline">download</span>
              <span>NDJSON</span>
            </button>
            <button
              type="button"
              onClick={() => triggerToast('Exporting CSV ledger...')}
              className="h-8 px-2 bg-surface-container hover:bg-surface-container-high rounded text-on-surface flex items-center gap-1 font-label-md text-label-md transition-colors cursor-pointer"
              title="Export as CSV"
            >
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={() => triggerToast('Copied LogQL expression')}
              className="h-8 px-2 bg-surface-container hover:bg-surface-container-high rounded text-on-surface flex items-center gap-1 font-label-md text-label-md transition-colors cursor-pointer"
              title="Copy LogQL Expression"
            >
              <span className="material-symbols-outlined text-[14px] text-outline">terminal</span>
              <span>LogQL</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SEVERITY OVERVIEW & INGESTION TELEMETRY STRIP (Reusing KpiTile) */}
      <section className="p-6 bg-surface-container border-b border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <KpiTile
            icon="graphic_eq"
            label="Window Volume (1h)"
            progressWidth="100%"
            subtext={<>Ring buffer capacity: <span className="text-on-surface font-semibold">100% intact</span></>}
            trend="1h window"
            trendDirection="neutral"
            value="2,841,920"
          />
          <KpiTile
            icon="info"
            label="INFO Severity"
            progressWidth="95.5%"
            subtext={<>Nominal operational logs: <span className="text-on-surface font-semibold">95.5%</span></>}
            trend="95.5%"
            trendDirection="up"
            value="2,714,080"
          />
          <KpiTile
            icon="warning"
            label="WARN Severity"
            progressWidth="3.9%"
            subtext={<>Soft limits & latency spikes: <span className="text-secondary font-semibold">3.9%</span></>}
            trend="3.9%"
            trendDirection="neutral"
            value="112,450"
          />
          <KpiTile
            icon="error"
            label="ERROR Severity"
            progressWidth="0.52%"
            subtext={<>Non-fatal exception events: <span className="text-error font-semibold">0.52%</span></>}
            trend="0.52%"
            trendDirection="down"
            value="14,890"
          />
          <KpiTile
            icon="dangerous"
            label="CRITICAL Severity"
            progressWidth="0.017%"
            subtext={<>Replica disconnect & HA events: <span className="text-on-error-container font-semibold">500</span></>}
            trend="0.017%"
            trendDirection="down"
            value="500"
          />
        </div>
      </section>

      {/* 3. QA / DEMO STATE SWITCHER HARNESS */}
      <div className="w-full bg-surface-container-highest px-6 py-1.5 flex items-center justify-between gap-2 overflow-x-auto border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">tune</span>
            QA VIEW STATES:
          </span>
          <div className="flex items-center gap-1">
            {[
              { id: 1, label: '1: Stream + Drawer (Default)' },
              { id: 2, label: '2: Full-Width Table' },
              { id: 3, label: '3: Filtered Empty' },
              { id: 4, label: '4: Daemon Ingestion Error' },
              { id: 5, label: '5: Loading State' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setViewState(st.id)}
                className={`px-2 py-0.5 rounded font-label-sm text-label-sm transition-colors cursor-pointer ${
                  viewState === st.id
                    ? 'bg-surface-container text-primary font-semibold'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1 font-label-sm text-label-sm text-outline">
          <span>Active Target:</span>
          <span className="font-code-md text-code-md text-on-surface-variant">prod-fra-cluster-01</span>
        </div>
      </div>

      {/* 4. OPERATIONAL MULTI-FACETED FILTER BAR */}
      <div className="w-full bg-surface-container-low px-6 py-3 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 border-b border-outline-variant/30">
        {/* Freeform Query Input */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by message, trace_id, req_*, or raw string... ⌘K"
            className="w-full h-8 pl-8 pr-12 bg-surface font-body-md text-body-md text-on-surface rounded placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-surface-container text-outline font-label-sm text-label-sm rounded pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Dropdown Select Matrix */}
        <div className="flex items-center flex-wrap gap-1.5">
          <div
            className="h-8 px-2.5 bg-surface rounded flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant"
            title="Current Query Time Window"
          >
            <span className="material-symbols-outlined text-[14px] text-outline">schedule</span>
            <span className="font-code-md text-code-md text-on-surface">14:30:00 - 15:30:00 UTC</span>
          </div>

          <div className="relative">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="h-8 pl-2 pr-6 bg-surface text-on-surface font-label-sm text-label-sm rounded appearance-none focus:outline-none cursor-pointer"
            >
              <option value="All">Severity: All (4)</option>
              <option value="CRIT">Critical &amp; Error Only</option>
              <option value="WARN">Warn, Error, Critical</option>
              <option value="INFO">Info Only</option>
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-outline text-[14px] pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="relative">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="h-8 pl-2 pr-6 bg-surface text-on-surface font-label-sm text-label-sm rounded appearance-none focus:outline-none cursor-pointer"
            >
              <option value="All">Service: All (18)</option>
              <option value="ai-routing.router">ai-routing.router</option>
              <option value="api-gateway.ingress">api-gateway.ingress</option>
              <option value="auth-vault.enclave">auth-vault.enclave</option>
              <option value="ocr-extractor.pipeline">ocr-extractor.pipeline</option>
              <option value="db-postgres.replica-2">db-postgres.replica-2</option>
              <option value="worker-temporal.jobs">worker-temporal.jobs</option>
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-outline text-[14px] pointer-events-none">
              expand_more
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedSeverity('All');
              setSelectedService('All');
              setViewState(1);
              triggerToast('Filters reset to default telemetry stream');
            }}
            className="h-8 px-2 bg-surface hover:bg-surface-container rounded text-outline hover:text-on-surface flex items-center gap-1 font-label-sm text-label-sm transition-colors cursor-pointer"
            title="Reset all applied filters"
          >
            <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
            <span>Reset</span>
          </button>

          <span className="font-label-sm text-label-sm text-on-surface-variant px-1.5 py-1 bg-surface-container rounded">
            Showing <span className="font-code-md text-code-md text-primary font-medium">{filteredLogs.length}</span> of{' '}
            <span className="font-code-md text-code-md text-on-surface">14,890</span> events
          </span>
        </div>
      </div>

      {/* 5. MAIN OPERATIONAL CONTENT AREA */}
      <div className="w-full flex-1 flex relative overflow-hidden min-h-[580px]">
        {/* VIEWSTATES 1 & 2: LOG STREAM TABLE */}
        {(viewState === 1 || viewState === 2) && (
          <div className="flex-1 flex flex-col min-w-0 bg-surface">
            {/* TABLE HEADER */}
            <div className="w-full bg-surface-container-low grid grid-cols-12 items-center px-6 py-1.5 font-label-sm text-label-sm text-outline uppercase tracking-wider select-none border-b border-outline-variant/30">
              <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-on-surface">
                <span>TIMESTAMP (UTC)</span>
                <span className="material-symbols-outlined text-[13px]">arrow_downward</span>
              </div>
              <div className="col-span-1">LEVEL</div>
              <div className="col-span-2">SERVICE</div>
              <div className="col-span-4 lg:col-span-5">MESSAGE / STRUCTURED EVENT</div>
              <div className="col-span-2 hidden md:block">REQ / TRACE ID</div>
              <div className="col-span-1 text-right">STATUS</div>
            </div>

            {/* LOG ENTRIES LIST */}
            <div className="flex-1 flex flex-col overflow-y-auto divide-y divide-outline-variant/10">
              {filteredLogs.map((log) => {
                const isSelected = log.id === selectedLogId;
                return (
                  <div
                    key={log.id}
                    onClick={() => {
                      setSelectedLogId(log.id);
                      if (viewState === 2) setViewState(1);
                    }}
                    className={`log-row grid grid-cols-12 items-center px-6 py-2 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-surface-container-low border-l-2 border-primary'
                        : 'bg-surface hover:bg-surface-container'
                    }`}
                  >
                    <div className="col-span-2 font-code-md text-code-md text-on-surface flex items-center gap-1">
                      <span className="text-outline">{log.timestamp}</span>
                      <span className="text-on-surface font-semibold">{log.ms}</span>
                    </div>

                    <div className="col-span-1">
                      <span
                        className={`px-1.5 py-0.5 rounded font-label-sm text-label-sm font-semibold inline-block ${
                          log.level === 'CRIT'
                            ? 'bg-error-container/40 text-on-error-container font-bold'
                            : log.level === 'ERROR'
                            ? 'bg-error/15 text-error'
                            : log.level === 'WARN'
                            ? 'bg-secondary/15 text-secondary'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {log.level}
                      </span>
                    </div>

                    <div className="col-span-2 font-body-sm text-body-sm text-on-surface-variant truncate flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-sm shrink-0 ${log.serviceColor}`}></span>
                      <span className="truncate">{log.service}</span>
                    </div>

                    <div className="col-span-4 lg:col-span-5 font-body-sm text-body-sm text-on-surface truncate pr-2">
                      {log.message}
                    </div>

                    <div className="col-span-2 hidden md:flex items-center gap-1 font-code-md text-code-md text-on-surface-variant">
                      <span className="bg-surface-container px-1 py-0.5 rounded text-outline hover:text-primary">
                        {log.reqId}
                      </span>
                    </div>

                    <div className={`col-span-1 text-right font-code-md text-code-md font-semibold ${log.statusColor}`}>
                      {log.statusCode}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEWSTATE 3: FILTERED-EMPTY STATE */}
        {viewState === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-surface text-center">
            <div className="w-12 h-12 bg-surface-container rounded flex items-center justify-center text-outline mb-4">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-1">
              No Matching Log Events
            </h3>
            <p className="font-body-md text-body-md text-outline max-w-md mb-6">
              No log entries matched your current filter criteria in the selected 1-hour UTC window. Try broadening the severity levels, clearing token queries, or expanding the time scope.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setViewState(1);
                }}
                className="h-8 px-4 bg-primary text-on-primary font-label-md text-label-md rounded font-bold uppercase transition-colors hover:bg-primary-fixed cursor-pointer"
              >
                Reset Filter Matrix
              </button>
              <button
                type="button"
                onClick={() => setViewState(1)}
                className="h-8 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded transition-colors cursor-pointer"
              >
                View Recent Stream
              </button>
            </div>
          </div>
        )}

        {/* VIEWSTATE 4: STREAM INGESTION ERROR */}
        {viewState === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-surface text-center">
            <div className="w-14 h-14 bg-error-container/20 rounded flex items-center justify-center text-error mb-4">
              <span className="material-symbols-outlined text-[32px]">cloud_off</span>
            </div>
            <div className="px-2 py-0.5 bg-error-container/40 text-on-error-container font-label-sm text-label-sm uppercase rounded font-bold mb-2">
              BUFFER SPILLOVER ALERT // DAEMON UNREACHABLE
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-1">
              Log Ingestion Daemon Connection Dropped
            </h3>
            <p className="font-body-md text-body-md text-outline max-w-lg mb-4">
              Telemetry client failed to establish persistent socket to{' '}
              <span className="font-code-md text-code-md text-on-surface font-semibold">syslog-relay.ops.internal:9042</span>. Ring buffer threshold 50,000 has reached capacity. Local disk spooling active.
            </p>
            <div className="bg-surface-container-low p-3 rounded font-code-md text-code-md text-error text-left max-w-lg w-full mb-6 border border-error/20">
              [FATAL_DISCONNECT] 15:30:02.102 UTC: Read TCP 10.240.12.98:44812-&gt;10.240.0.14:9042: i/o timeout.
              <br />
              Failover daemon target [syslog-failover-fra] not responding to heartbeat probe.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewState(1)}
                className="h-8 px-4 bg-error text-on-error font-label-md text-label-md rounded font-bold uppercase transition-colors hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Attempt Daemon Reconnect</span>
              </button>
              <button
                type="button"
                className="h-8 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded transition-colors cursor-pointer"
              >
                View Incident Runbook
              </button>
            </div>
          </div>
        )}

        {/* VIEWSTATE 5: SKELETON LOADING STATE */}
        {viewState === 5 && (
          <div className="flex-1 flex flex-col bg-surface p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-48 bg-surface-container-high animate-pulse rounded"></div>
              <div className="h-5 w-24 bg-surface-container-high animate-pulse rounded"></div>
            </div>
            <div className="w-full h-8 bg-surface-container-low animate-pulse rounded"></div>
            <div className="space-y-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="w-full h-9 bg-surface-container-low animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        )}

        {/* RIGHT PANEL DETAIL INSPECTION DRAWER (STATE 1 ONLY) */}
        {viewState === 1 && (
          <div className="w-full lg:w-[460px] xl:w-[500px] bg-surface-container-low flex flex-col shrink-0 overflow-y-auto border-l border-outline-variant/30 z-10 transition-all duration-200 shadow-xl">
            {/* DRAWER HEADER */}
            <div className="p-4 bg-surface-container flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-bold ${
                    selectedLog.level === 'CRIT'
                      ? 'bg-error-container/40 text-on-error-container'
                      : selectedLog.level === 'ERROR'
                      ? 'bg-error/20 text-error'
                      : 'bg-surface-container-highest text-on-surface'
                  }`}
                >
                  {selectedLog.level} {selectedLog.statusCode}
                </span>
                <span className="font-code-md text-code-md text-on-surface">
                  {selectedLog.timestamp}
                  {selectedLog.ms} UTC
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => triggerToast('JSON payload copied to clipboard')}
                  className="p-1 text-outline hover:text-on-surface rounded bg-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  title="Copy Raw Event JSON"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
                <button
                  type="button"
                  className="p-1 text-outline hover:text-on-surface rounded bg-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  title="Open Trace in Jaeger / Tempo"
                >
                  <span className="material-symbols-outlined text-[16px]">hub</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewState(2)}
                  className="p-1 text-outline hover:text-on-surface rounded bg-surface hover:bg-surface-container-high transition-colors ml-1 cursor-pointer"
                  title="Close Detail Panel"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>

            {/* DRAWER BODY CONTENT */}
            <div className="p-4 flex flex-col gap-4">
              {/* Event Diagnostic Summary Card */}
              <div className="p-3 bg-surface rounded flex flex-col gap-1.5 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  EVENT DIAGNOSTIC NOTE
                </span>
                <p className="font-body-md text-body-md text-on-surface font-medium leading-snug">
                  {selectedLog.diagnosticNote}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-1.5 py-0.5 bg-secondary/15 text-secondary font-label-sm text-label-sm rounded font-medium">
                    Circuit Tripped
                  </span>
                  <span className="px-1.5 py-0.5 bg-tertiary/15 text-tertiary font-label-sm text-label-sm rounded font-medium">
                    Auto-Rerouted
                  </span>
                  <span className="px-1.5 py-0.5 bg-surface-container text-on-surface-variant font-label-sm text-label-sm rounded font-medium">
                    SLA Preserved
                  </span>
                </div>
              </div>

              {/* Correlated IDs Section */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-surface rounded flex flex-col gap-0.5 border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline uppercase">REQUEST ID</span>
                  <div className="flex items-center justify-between">
                    <span className="font-code-md text-code-md text-primary font-semibold">{selectedLog.reqId}</span>
                    <span
                      onClick={() => triggerToast('Copied Request ID')}
                      className="material-symbols-outlined text-[13px] text-outline cursor-pointer hover:text-on-surface"
                    >
                      content_copy
                    </span>
                  </div>
                </div>
                <div className="p-2.5 bg-surface rounded flex flex-col gap-0.5 border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline uppercase">TRACE ID</span>
                  <div className="flex items-center justify-between">
                    <span className="font-code-md text-code-md text-tertiary font-semibold">{selectedLog.traceId}</span>
                    <span className="material-symbols-outlined text-[13px] text-outline cursor-pointer hover:text-on-surface">
                      open_in_new
                    </span>
                  </div>
                </div>
              </div>

              {/* Infrastructure Origin */}
              <div className="p-3 bg-surface rounded flex flex-col gap-2 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  INFRASTRUCTURE ORIGIN
                </span>
                <div className="flex flex-col gap-1.5 font-body-sm text-body-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Service Target:</span>
                    <span className="font-code-md text-code-md text-on-surface">{selectedLog.service}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Kubernetes Pod:</span>
                    <span className="font-code-md text-code-md text-on-surface">{selectedLog.pod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Physical Host:</span>
                    <span className="font-code-md text-code-md text-on-surface">{selectedLog.host}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Ingress Region:</span>
                    <span className="font-code-md text-code-md text-on-surface">{selectedLog.region}</span>
                  </div>
                </div>
              </div>

              {/* HTTP & Network Telemetry */}
              <div className="p-3 bg-surface rounded flex flex-col gap-2 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  HTTP &amp; RPC CONTEXT
                </span>
                <div className="flex flex-col gap-1.5 font-body-sm text-body-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Route Path:</span>
                    <span className="font-code-md text-code-md text-on-surface truncate max-w-[240px]">
                      {selectedLog.routePath}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">HTTP Method:</span>
                    <span className="font-code-md text-code-md text-primary font-semibold">{selectedLog.method}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Client Origin:</span>
                    <span className="text-on-surface">{selectedLog.clientOrigin}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Ingress VPC IP:</span>
                    <span className="font-code-md text-code-md text-outline-variant">{selectedLog.ip}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Total Latency:</span>
                    <span className="font-code-md text-code-md text-secondary font-bold">{selectedLog.latency}</span>
                  </div>
                </div>
              </div>

              {/* Structured Attributes */}
              <div className="p-3 bg-surface rounded flex flex-col gap-2 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  STRUCTURED ATTRIBUTES
                </span>
                <div className="font-code-md text-code-md space-y-1">
                  {Object.entries(selectedLog.attributes).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between bg-surface-container px-2 py-1 rounded">
                      <span className="text-outline">{key}:</span>
                      <span className="text-on-surface font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw JSON Payload Viewer */}
              <div className="bg-surface rounded overflow-hidden border border-outline-variant/20">
                <div className="px-3 py-2 bg-surface-container flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    RAW JSON ENVELOPE
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">application/json</span>
                </div>
                <pre className="p-3 font-code-md text-code-md text-on-surface-variant overflow-x-auto bg-surface-container-lowest leading-relaxed select-text">
                  <code>{selectedLog.rawJson}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. PAGINATION & FOOTER CONTROL STRIP */}
      <div className="w-full bg-surface-container-low px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-outline-variant/30">
        <div className="flex items-center gap-4">
          <span className="font-label-sm text-label-sm text-outline">
            Showing <span className="font-code-md text-code-md text-on-surface">1–{filteredLogs.length}</span> of{' '}
            <span className="font-code-md text-code-md text-on-surface">14,890</span> events
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-label-sm text-label-sm text-outline">Rows:</span>
            <select className="h-6 px-1.5 bg-surface text-on-surface font-label-sm text-label-sm rounded appearance-none focus:outline-none cursor-pointer">
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="w-3.5 h-3.5 rounded bg-surface accent-primary cursor-pointer"
            />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Auto-scroll to latest</span>
          </label>
          <div className="flex items-center gap-1">
            <button
              disabled
              type="button"
              className="h-6 px-2 bg-surface hover:bg-surface-container text-outline rounded font-label-sm text-label-sm disabled:opacity-40"
            >
              First
            </button>
            <button
              disabled
              type="button"
              className="h-6 px-2 bg-surface hover:bg-surface-container text-outline rounded font-label-sm text-label-sm disabled:opacity-40"
            >
              Prev
            </button>
            <span className="font-label-sm text-label-sm text-on-surface px-2">Page 1 of 596</span>
            <button
              type="button"
              className="h-6 px-2 bg-surface hover:bg-surface-container text-on-surface rounded font-label-sm text-label-sm transition-colors cursor-pointer"
            >
              Next
            </button>
            <button
              type="button"
              className="h-6 px-2 bg-surface hover:bg-surface-container text-on-surface rounded font-label-sm text-label-sm transition-colors cursor-pointer"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Toast Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-surface-container-highest px-3 py-2 rounded shadow-xl text-on-surface font-label-sm text-label-sm flex items-center gap-2 z-50">
          <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
