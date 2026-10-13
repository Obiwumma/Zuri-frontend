'use client';

import React, { useState, useEffect } from 'react';
import { KpiTile } from '@/components/ui/KpiTile';
import { DataTable, Column } from '@/components/ui/DataTable';

interface CoreServiceRecord {
  id: string;
  name: string;
  endpoint: string;
  icon: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'CRITICAL';
  latency: string;
  p99Latency: string;
  checkInterval: string;
  notes: string;
  nodeDetails: string;
  isDegraded?: boolean;
}

interface IncidentEvent {
  id: string;
  level: 'WARN' | 'INFO' | 'P3-RES' | 'AUDIT';
  title: string;
  timestamp: string;
  description: string;
  status: 'Mitigating' | 'Resolved' | 'Closed' | 'Completed';
}

export default function OpsHealthPage() {
  const [pollInterval, setPollInterval] = useState<string>('10s');
  const [timeframe, setTimeframe] = useState<'15M' | '1H' | '24H' | '7D'>('15M');
  const [filterMode, setFilterMode] = useState<'ALL' | 'HEALTHY' | 'DEGRADED' | 'CRITICAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sweepSeconds, setSweepSeconds] = useState<number>(50);
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [probeStatusText, setProbeStatusText] = useState<string>('Run Health Check');

  useEffect(() => {
    const timer = setInterval(() => {
      setSweepSeconds((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRunProbe = () => {
    setIsProbing(true);
    setProbeStatusText('Probing...');
    setTimeout(() => {
      setProbeStatusText('Sweep Complete');
      setSweepSeconds(0);
      setTimeout(() => {
        setProbeStatusText('Run Health Check');
        setIsProbing(false);
      }, 1500);
    }, 950);
  };

  const servicesData: CoreServiceRecord[] = [
    {
      id: 'srv-1',
      name: 'API Gateway & Ingress',
      endpoint: 'edge.ingress.lexi.internal',
      icon: 'router',
      status: 'OPERATIONAL',
      latency: '18ms',
      p99Latency: 'p99 34ms',
      checkInterval: '3s ago',
      notes: 'None — Envoy mesh healthy, 3,420 req/s nominal',
      nodeDetails: '24 replicas // Envoy v1.29 // TLS 1.3',
    },
    {
      id: 'srv-2',
      name: 'Database (Postgres Core & Replicas)',
      endpoint: 'db.cluster.eu-west-1.internal',
      icon: 'database',
      status: 'OPERATIONAL',
      latency: '4.2ms',
      p99Latency: 'query lag 0.02s',
      checkInterval: '5s ago',
      notes: 'None — Connection pool 34% util, buffer hit ratio 100%',
      nodeDetails: 'Primary + 3 read reps // pg16.2 // ZFS',
    },
    {
      id: 'srv-3',
      name: 'Authentication & Vault Service',
      endpoint: 'vault-enclave.security.mesh',
      icon: 'lock',
      status: 'OPERATIONAL',
      latency: '22ms',
      p99Latency: 'p95 28ms',
      checkInterval: '2s ago',
      notes: 'None — mTLS & FIDO2 verification valid, zero lease errors',
      nodeDetails: 'KMS Enclave // Vault v1.15 // 6 pods',
    },
    {
      id: 'srv-4',
      name: 'Background Jobs & Worker Queue',
      endpoint: 'queue-engine.workers.internal',
      icon: 'sync_alt',
      status: 'OPERATIONAL',
      latency: '45ms',
      p99Latency: 'dispatch delay',
      checkInterval: '8s ago',
      notes: 'None — 48 worker pods active, backlog nominal at 142 tasks',
      nodeDetails: 'Temporal Core // Redis v7.2 cluster',
    },
    {
      id: 'srv-5',
      name: 'AI Services & Inference Router',
      endpoint: 'triton-llm.mesh.internal',
      icon: 'memory',
      status: 'OPERATIONAL',
      latency: '310ms',
      p99Latency: 'TTFT avg',
      checkInterval: '4s ago',
      notes: 'None — GPU cluster nominal, KV-cache hit rate 89.2%',
      nodeDetails: '8x H100 pods // Triton 24.02 // eu-west-1',
    },
    {
      id: 'srv-6',
      name: 'Storage & Object Engine',
      endpoint: 's3-nvme-tier0.lexi.internal',
      icon: 'inventory_2',
      status: 'OPERATIONAL',
      latency: '32ms',
      p99Latency: 'rd / 48ms wr',
      checkInterval: '10s ago',
      notes: 'None — Multi-region S3 synced, hot NVMe cache clean',
      nodeDetails: '99.999% durability // MinIO + AWS S3',
    },
    {
      id: 'srv-7',
      name: 'Notifications & Webhook Dispatcher',
      endpoint: 'dispatch.events.lexi.internal',
      icon: 'outgoing_mail',
      status: 'OPERATIONAL',
      latency: '58ms',
      p99Latency: 'dispatch',
      checkInterval: '6s ago',
      notes: 'None — Event delivery 100%, 0 failed retry dead-letters',
      nodeDetails: 'Kafka topic `lexi.events` // 1.2k msg/s',
    },
    {
      id: 'srv-8',
      name: 'Document Processing & Extraction Engine',
      endpoint: 'ocr-extractor.pipeline.internal',
      icon: 'warning',
      status: 'DEGRADED',
      latency: '1,420ms',
      p99Latency: 'elevated',
      checkInterval: '1s ago',
      notes: 'Backpressure: multi-page PDF OCR pipeline. Auto-scaling +4 pods.',
      nodeDetails: 'Celery OCR cluster // v3.8.1 // CPU 79%',
      isDegraded: true,
    },
  ];

  const filteredServices = servicesData.filter((srv) => {
    if (filterMode === 'HEALTHY' && srv.status !== 'OPERATIONAL') return false;
    if (filterMode === 'DEGRADED' && srv.status !== 'DEGRADED') return false;
    if (filterMode === 'CRITICAL' && srv.status !== 'CRITICAL') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        srv.name.toLowerCase().includes(q) ||
        srv.endpoint.toLowerCase().includes(q) ||
        srv.nodeDetails.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const serviceColumns: Column<CoreServiceRecord>[] = [
    {
      header: 'Service / Subsystem',
      accessor: (row) => (
        <div className="flex flex-col">
          <div className={`flex items-center gap-1.5 font-headline-md text-body-lg font-medium ${
            row.isDegraded ? 'text-secondary' : 'text-on-surface'
          }`}>
            <span className={`material-symbols-outlined text-[16px] ${row.isDegraded ? 'text-secondary' : 'text-outline'}`}>
              {row.icon}
            </span>
            <span>{row.name}</span>
          </div>
          <span className="font-code-md text-code-md text-outline">{row.endpoint}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold ${
            row.status === 'DEGRADED'
              ? 'bg-secondary/10 text-secondary'
              : row.status === 'CRITICAL'
              ? 'bg-error/10 text-error'
              : 'bg-primary/10 text-primary'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.status === 'DEGRADED'
                ? 'bg-secondary'
                : row.status === 'CRITICAL'
                ? 'bg-error'
                : 'bg-primary'
            }`}
          ></span>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Latency & Telemetry',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className={`font-code-md text-code-md font-semibold ${row.isDegraded ? 'text-secondary' : 'text-on-surface'}`}>
            {row.latency}
          </span>
          <span className={`font-label-sm text-label-sm ${row.isDegraded ? 'text-secondary font-medium' : 'text-outline'}`}>
            {row.p99Latency}
          </span>
        </div>
      ),
    },
    {
      header: 'Check Interval',
      accessor: (row) => (
        <span className={`font-code-md text-code-md ${row.isDegraded ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
          {row.checkInterval}
        </span>
      ),
    },
    {
      header: 'Diagnostic Notes & Backpressure',
      accessor: (row) => (
        <div className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
          {row.isDegraded ? (
            <span className="text-on-surface">
              <strong className="text-secondary font-semibold">Backpressure</strong>: {row.notes.replace('Backpressure: ', '')}
            </span>
          ) : (
            <span>
              <span className="text-on-surface">None</span> — {row.notes.replace('None — ', '')}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Node / Deploy Details',
      accessor: (row) => (
        <span className="font-code-md text-code-md text-outline">{row.nodeDetails}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1">
          {row.isDegraded && (
            <button
              type="button"
              className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold cursor-pointer"
              title="Inspect Scale State"
            >
              Scale +4
            </button>
          )}
          <button
            type="button"
            className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            title="Inspect Trace"
          >
            <span className="material-symbols-outlined text-[16px]">troubleshoot</span>
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            title="View Logs"
          >
            <span className="material-symbols-outlined text-[16px]">terminal</span>
          </button>
        </div>
      ),
    },
  ];

  const incidentsList: IncidentEvent[] = [
    {
      id: 'inc-1',
      level: 'WARN',
      title: 'Document processing pool queue > 500 items',
      timestamp: '14:32:10 UTC',
      description: 'Auto-scaler policy lexi-ocr-hpa triggered. +4 pods scheduled in eu-west-1b.',
      status: 'Mitigating',
    },
    {
      id: 'inc-2',
      level: 'INFO',
      title: 'Database replica db-ro-03 routine vacuum completed',
      timestamp: '12:15:04 UTC',
      description: 'Completed in 42 seconds. Zero query disruptions or replication delay surges detected.',
      status: 'Resolved',
    },
    {
      id: 'inc-3',
      level: 'P3-RES',
      title: 'Transient 502 spike on AI Ingress gateway',
      timestamp: '09:40:22 UTC',
      description: 'Impacted 0.01% of requests for 90s due to rollout pod recycling. Envoy health probes rerouted immediately.',
      status: 'Closed',
    },
    {
      id: 'inc-4',
      level: 'AUDIT',
      title: 'Automated TLS wildcard certificate renewal',
      timestamp: 'Yesterday 18:22',
      description: 'Certbot renewal complete for *.lexi.internal and API root ingress endpoints.',
      status: 'Completed',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Sub-Header & Global Operational Controls Strip */}
      <section className="bg-surface-container-low px-6 py-4 flex flex-col gap-3 border-b border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-outline font-label-sm text-label-sm">
              <span>OPERATIONS</span>
              <span className="text-surface-variant">/</span>
              <span>PLATFORM HEALTH &amp; TELEMETRY</span>
            </div>
            <div className="flex items-baseline gap-3 mt-0.5">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">System Health Overview</h1>
              <span className="text-on-surface-variant font-code-md text-code-md">CLUSTER ID // lexi-prod-mesh-01</span>
            </div>
          </div>

          {/* Action & Control Suite */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Auto-refresh dropdown selector */}
            <div className="relative flex items-center bg-surface-container-lowest px-2.5 py-1 rounded border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px] text-outline mr-1.5">sync</span>
              <span className="font-label-sm text-label-sm text-outline uppercase mr-1">Poll:</span>
              <select
                value={pollInterval}
                onChange={(e) => setPollInterval(e.target.value)}
                className="bg-transparent font-code-md text-code-md text-on-surface focus:outline-none cursor-pointer pr-1"
              >
                <option value="10s" className="bg-surface-container-low text-on-surface">10s</option>
                <option value="30s" className="bg-surface-container-low text-on-surface">30s</option>
                <option value="1m" className="bg-surface-container-low text-on-surface">1m</option>
                <option value="pause" className="bg-surface-container-low text-on-surface">Paused</option>
              </select>
            </div>

            {/* Window Segmented Switch */}
            <div className="flex items-center bg-surface-container-lowest p-0.5 rounded border border-outline-variant/30">
              {(['15M', '1H', '24H', '7D'] as const).map((tw) => (
                <button
                  key={tw}
                  type="button"
                  onClick={() => setTimeframe(tw)}
                  className={`px-2 py-0.5 rounded font-label-sm text-label-sm cursor-pointer transition-colors ${
                    timeframe === tw
                      ? 'bg-surface-container-high text-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tw}
                </button>
              ))}
            </div>

            {/* Secondary Button: Run Probe */}
            <button
              type="button"
              disabled={isProbing}
              onClick={handleRunProbe}
              className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md rounded transition-colors cursor-pointer border border-outline-variant/30"
            >
              <span className={`material-symbols-outlined text-[15px] text-primary ${isProbing ? 'animate-spin' : ''}`}>
                {isProbing ? 'refresh' : 'play_arrow'}
              </span>
              <span>{probeStatusText}</span>
            </button>

            {/* Primary Button: Export Snapshot */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1 bg-primary text-on-primary hover:bg-primary-fixed-dim font-label-md text-label-md font-bold rounded transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Export Snapshot</span>
            </button>
          </div>
        </div>

        {/* Live Operational Context Badges Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-1 font-label-sm text-label-sm">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-on-surface border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            <span className="text-outline uppercase">ENV:</span>
            <span className="font-code-md text-code-md">PROD-EU-WEST</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-on-surface border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-outline uppercase">NODES:</span>
            <span className="font-code-md text-code-md">24/24 Synced</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-on-surface border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="text-outline uppercase">BACKPRESSURE:</span>
            <span className="font-code-md text-code-md text-secondary">Document Queue (+18%)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-on-surface-variant ml-auto border border-outline-variant/30">
            <span className="material-symbols-outlined text-[13px] text-outline">history</span>
            <span>Global Sweep:</span>
            <span className="font-code-md text-code-md text-on-surface">{sweepSeconds}s ago</span>
          </div>
        </div>
      </section>

      {/* Metric Overview Grid (4 Core High-Density Cards via KpiTile) */}
      <section className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiTile
          label="Overall Status"
          value="OPERATIONAL"
          trend="30d Rolling Uptime: 99.98%"
          trendDirection="up"
          icon="verified"
          subtext="P0: 0 Active Incidents"
        />
        <KpiTile
          label="Monitored Services"
          value="7 / 8"
          trend="SLA COMPLIANT"
          trendDirection="up"
          icon="dns"
          subtext="1 Degraded • Target Availability: 99.998%"
        />
        <KpiTile
          label="Queue & Latency"
          value="1 Elevated"
          trend="WARNS: 2"
          trendDirection="down"
          icon="speed"
          subtext="Doc OCR Worker • Backpressure Latency: +240ms p95"
        />
        <KpiTile
          label="Active Incidents"
          value="0 Crit / 1 Warn"
          trend="LAST P1: 18D AGO"
          trendDirection="neutral"
          icon="warning"
          subtext="Mean Time to Recover: 4.2 min MTTR"
        />
      </section>

      {/* Main Section: Monitored Core Infrastructure Table & Filters */}
      <section className="px-6 pb-6">
        <div className="bg-surface-container-low rounded overflow-hidden shadow-xs border border-outline-variant/30">
          {/* Controls Bar Above Table */}
          <div className="p-4 bg-surface-container flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-outline-variant/30">
            <div className="flex items-center gap-3">
              <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                Monitored Core Services &amp; Subsystems
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-outline font-code-md text-code-md">
                8 probes active
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter Pills */}
              <div className="flex items-center bg-surface-container-lowest p-0.5 rounded text-label-sm font-label-sm border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setFilterMode('ALL')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    filterMode === 'ALL'
                      ? 'bg-surface-container-high text-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  ALL (8)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('HEALTHY')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    filterMode === 'HEALTHY'
                      ? 'bg-surface-container-high text-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  HEALTHY (7)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('DEGRADED')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    filterMode === 'DEGRADED'
                      ? 'bg-surface-container-high text-secondary font-bold'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  DEGRADED (1)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('CRITICAL')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    filterMode === 'CRITICAL'
                      ? 'bg-surface-container-high text-error font-bold'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  CRITICAL (0)
                </button>
              </div>

              {/* Table Search Input */}
              <div className="relative flex items-center bg-surface-container-lowest px-2.5 py-1 rounded border border-outline-variant/30">
                <span className="material-symbols-outlined text-[16px] text-outline mr-2">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by service, node, tag..."
                  className="bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none w-48"
                />
              </div>
            </div>
          </div>

          <DataTable
            columns={serviceColumns}
            data={filteredServices}
            keyExtractor={(item) => item.id}
          />
        </div>
      </section>

      {/* Split Tactical Ledger & Hardware Telemetry Matrix */}
      <section className="px-6 pb-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 cols: Operational Events & Incidents Ledger */}
        <div className="xl:col-span-7 flex flex-col bg-surface-container-low rounded p-4 border border-outline-variant/30">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-outline">history_toggle_off</span>
              <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                Recent Incidents &amp; Operational Events
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a href="/ops/logs" className="font-label-sm text-label-sm text-primary hover:underline">
                View Full Audit Trail →
              </a>
            </div>
          </div>

          {/* Compact Ledger Items List */}
          <div className="flex flex-col gap-2 pt-3 font-body-sm text-body-sm">
            {incidentsList.map((inc) => (
              <div key={inc.id} className="flex items-start gap-3 p-2.5 bg-surface-container-lowest rounded border border-outline-variant/30">
                <div className="flex flex-col items-center pt-0.5">
                  <span
                    className={`px-1.5 py-0.5 rounded font-label-sm text-label-sm font-bold ${
                      inc.level === 'WARN'
                        ? 'bg-secondary/10 text-secondary'
                        : inc.level === 'P3-RES'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {inc.level}
                  </span>
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-code-md text-code-md text-on-surface font-medium">{inc.title}</span>
                    <span className="font-code-md text-code-md text-outline">{inc.timestamp}</span>
                  </div>
                  <p className="text-on-surface-variant text-body-sm mt-0.5">{inc.description}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-label-sm text-label-sm shrink-0 ${
                    inc.status === 'Mitigating'
                      ? 'bg-surface-container text-secondary font-medium'
                      : inc.status === 'Closed'
                      ? 'bg-surface-container text-primary font-medium'
                      : 'bg-surface-container text-outline'
                  }`}
                >
                  {inc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Subsystem Probes & Cluster Health Matrix */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          {/* Health Probe Dependency Grid */}
          <div className="bg-surface-container-low rounded p-4 flex flex-col border border-outline-variant/30">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-3">
              <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                Subsystem Dependency Matrix
              </span>
              <span className="font-label-sm text-label-sm text-primary font-semibold">5/5 NOMINAL</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-body-sm font-body-sm">
              <div className="bg-surface-container-lowest p-2.5 rounded flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-medium text-on-surface">VPC Peering Mesh</span>
                </div>
                <span className="font-code-md text-code-md text-outline">&lt;1ms</span>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-medium text-on-surface">Core DNS (CoreDNS)</span>
                </div>
                <span className="font-code-md text-code-md text-outline">0.4ms</span>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-medium text-on-surface">Edge CDN Layer</span>
                </div>
                <span className="font-code-md text-code-md text-outline">12ms</span>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-medium text-on-surface">Token / Redis Cache</span>
                </div>
                <span className="font-code-md text-code-md text-outline">1.1ms</span>
              </div>
              <div className="col-span-2 bg-surface-container-lowest p-2.5 rounded flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-medium text-on-surface">Internal PKI / Certificate Enclave</span>
                </div>
                <span className="font-code-md text-code-md text-primary font-medium">HEALTHY (Expires 84d)</span>
              </div>
            </div>
          </div>

          {/* Node Distribution & Error Budget Bar */}
          <div className="bg-surface-container-low rounded p-4 flex flex-col justify-between border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Node Topology &amp; Error Budget
                </span>
                <span className="font-code-md text-code-md text-outline">24 Nodes Active</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                AWS eu-west-1 (16 nodes, 8 active AZs) • GCP europe-west3 (8 nodes, 2 failover clusters).
              </p>
              {/* Budget Progress Meter */}
              <div className="mt-3">
                <div className="flex items-center justify-between font-label-sm text-label-sm mb-1">
                  <span className="text-outline uppercase">30-Day SLA Error Budget Remaining</span>
                  <span className="font-code-md text-code-md text-primary font-bold">99.988%</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-2 rounded overflow-hidden flex border border-outline-variant/30">
                  <div className="bg-primary h-full rounded w-[99.2%]"></div>
                  <div className="bg-secondary h-full rounded w-[0.8%]"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 bg-surface-container-lowest/60 px-3 py-1.5 rounded font-label-sm text-label-sm border border-outline-variant/30">
              <div className="flex items-center gap-2 text-outline">
                <span className="material-symbols-outlined text-[15px] text-primary">speed</span>
                <span>Current Burn Rate:</span>
                <span className="font-code-md text-code-md text-on-surface font-semibold">0.04x (Safe)</span>
              </div>
              <span className="font-code-md text-code-md text-outline">SLO Threshold: 99.95%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
