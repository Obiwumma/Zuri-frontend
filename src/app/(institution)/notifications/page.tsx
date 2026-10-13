'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';

interface NotificationItem {
  id: string;
  title: string;
  category: 'Academic Alert' | 'Remediation Notice' | 'Gazette Bulletin' | 'Governance' | 'System Maintenance';
  priority: 'Urgent' | 'High' | 'Standard' | 'Low';
  recipients: string;
  channel: string;
  timestamp: string;
  status: 'Action Required' | 'Delivered & Unread' | 'Delivered & Triaged' | 'Scheduled';
  sender: string;
  summary: string;
  actionText?: string;
  unread: boolean;
}

export default function NotificationsPage() {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('NOT-5012');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NOT-5012',
      title: 'Cellular Signalling Diagnostic Anomaly — 18 Tutorial Students Flagged',
      category: 'Remediation Notice',
      priority: 'Urgent',
      recipients: 'Senior Tutors (Medical Sciences Division)',
      channel: 'In-App Console & SSO Email',
      timestamp: 'Today, 08:30 AM GMT',
      status: 'Action Required',
      sender: 'Socratic Diagnostic Engine',
      summary: 'Automated diagnostic analysis identified a high error rate (>42%) on signal transduction kinetics in Tutorial Group B. 18 undergraduate students require immediate remedial supervisor review prior to Week 5 collections.',
      actionText: 'Review Remediation Roster',
      unread: true,
    },
    {
      id: 'NOT-5013',
      title: 'Formative Assessment Milestone Deadline Reminder — Michaelmas Wk 7',
      category: 'Academic Alert',
      priority: 'High',
      recipients: 'Finalist Undergraduates & PGT Students',
      channel: 'In-App Console Broadcast',
      timestamp: 'Today, 07:15 AM GMT',
      status: 'Delivered & Triaged',
      sender: 'Academic Registry Console',
      summary: 'Submission deadline for Michaelmas Term Extended Essays and Lab Portfolios is set for Friday of Week 7 at 12:00 noon. Submissions must be uploaded via the Central e-Submission Portal.',
      actionText: 'View Submission Requirements',
      unread: true,
    },
    {
      id: 'NOT-5014',
      title: 'Oxford Gazette Publication: Proposed Amendments to Statute VI (Supervision)',
      category: 'Gazette Bulletin',
      priority: 'Standard',
      recipients: 'Members of Congregation & Faculty Senate',
      channel: 'SSO Email & Gazette Portal',
      timestamp: 'Yesterday, 04:30 PM GMT',
      status: 'Delivered & Triaged',
      sender: 'University Secretariat',
      summary: 'Notice of a Congregation meeting to consider proposed changes to Statute VI concerning tutorial supervision allowances and inter-collegiate teaching allocations for 2025–26.',
      actionText: 'Read Gazette Notice',
      unread: false,
    },
    {
      id: 'NOT-5015',
      title: 'Quantum Information & Computing Lab Practical Room Change',
      category: 'Academic Alert',
      priority: 'Standard',
      recipients: 'CS-501 Enrolled Cohort',
      channel: 'In-App Alert & SMS',
      timestamp: 'Yesterday, 02:10 PM GMT',
      status: 'Delivered & Triaged',
      sender: 'Dept of Computer Science',
      summary: 'Practical sessions scheduled for Thursday morning have been relocated from Lindemann Building Room 204 to Wolfson Building Lecture Theatre B due to audio-visual system upgrades.',
      actionText: 'View Venue Details',
      unread: false,
    },
    {
      id: 'NOT-5016',
      title: 'Scheduled Maintenance Notice: Shibboleth InCommon Identity Provider Sync',
      category: 'System Maintenance',
      priority: 'Low',
      recipients: 'All Institutional IT Administrators',
      channel: 'In-App Console Notice',
      timestamp: '22 Sep 2024, 09:00 AM GMT',
      status: 'Delivered & Unread',
      sender: 'Oxford IT Services',
      summary: 'Brief 15-minute maintenance window scheduled for Sunday 02:00 GMT. SSO login may experience brief latency spikes during key rotation procedures.',
      actionText: 'View Status Page',
      unread: true,
    },
    {
      id: 'NOT-5017',
      title: 'Michaelmas Term Degree Ceremony Registration Deadline Notice',
      category: 'Governance',
      priority: 'High',
      recipients: 'Graduands & College Deans',
      channel: 'In-App Broadcast & SSO Email',
      timestamp: '21 Sep 2024, 11:45 AM GMT',
      status: 'Scheduled',
      sender: 'University Marshal & Sheldonian',
      summary: 'Formal registration for degree presentation at the Sheldonian Theatre closes on 15 October. Deans of Degrees must verify candidate eligibility lists prior to final roll call.',
      actionText: 'Open Sheldonian Roster',
      unread: false,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const filteredNotifications = notifications.filter((item) => {
    const matchesCategory =
      activeCategoryFilter === 'all' ||
      (activeCategoryFilter === 'academic' && item.category === 'Academic Alert') ||
      (activeCategoryFilter === 'remediation' && item.category === 'Remediation Notice') ||
      (activeCategoryFilter === 'gazette' && item.category === 'Gazette Bulletin') ||
      (activeCategoryFilter === 'governance' && item.category === 'Governance') ||
      (activeCategoryFilter === 'system' && item.category === 'System Maintenance');

    const matchesPriority =
      priorityFilter === 'all' || item.priority.toLowerCase() === priorityFilter.toLowerCase();

    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipients.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sender.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesPriority && matchesSearch;
  });

  const selectedNotification = notifications.find((n) => n.id === selectedId) || notifications[0];

  const unreadCount = notifications.filter((n) => n.unread).length;
  const actionRequiredCount = notifications.filter((n) => n.status === 'Action Required').length;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-container/40 text-error border border-error/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Urgent Alert
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-container/40 text-tertiary border border-tertiary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> High Priority
          </span>
        );
      case 'Standard':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-fixed/40 text-primary border border-primary/20">
            Standard Notice
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
            Low Priority
          </span>
        );
    }
  };

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl space-y-[var(--spacing-section-gap)] font-body-md text-on-surface">
      {/* PAGE HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-4 border-b border-outline-variant/20">
        <div className="flex flex-col max-w-3xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">
              Communication Hub • Dispatch &amp; Alert Feed
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold leading-tight">
            Notification Center &amp; Alert Dispatch
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1.5 leading-relaxed">
            Real-time feed of academic remediation flags, university Gazette bulletins, faculty alerts, and scheduled institutional dispatches for Michaelmas Term 2024–25.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">mark_email_read</span>
            Mark All as Read
          </button>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
            <span className="font-medium text-on-surface">
              <strong className="text-primary font-bold">{actionRequiredCount}</strong> Action Required
            </span>
          </div>
        </div>
      </header>

      {/* QUICK STATUS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--spacing-gutter)]">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error-container/30 text-error flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div>
              <p className="text-xs font-label-caps uppercase tracking-wider text-on-surface-variant">Unread Alerts</p>
              <p className="text-xl font-bold text-primary leading-tight">{unreadCount} Pending</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant/70 bg-surface-container px-2 py-0.5 rounded">
            Live Feed
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed/40 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">send_and_archive</span>
            </div>
            <div>
              <p className="text-xs font-label-caps uppercase tracking-wider text-on-surface-variant">Dispatched Today</p>
              <p className="text-xl font-bold text-primary leading-tight">14 Dispatches</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant/70 bg-surface-container px-2 py-0.5 rounded">
            SSO Broadcast
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tertiary-container/30 text-tertiary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div>
              <p className="text-xs font-label-caps uppercase tracking-wider text-on-surface-variant">Delivery Rate</p>
              <p className="text-xl font-bold text-primary leading-tight">99.4% Verified</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant/70 bg-surface-container px-2 py-0.5 rounded">
            InCommon IDP
          </span>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/25 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1.5">
          <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-medium">
            Category Filter
          </span>
          <FilterBar
            activeId={activeCategoryFilter}
            onSelect={setActiveCategoryFilter}
            options={[
              { id: 'all', label: `All (${notifications.length})` },
              { id: 'remediation', label: 'Remediation' },
              { id: 'academic', label: 'Academic' },
              { id: 'gazette', label: 'Gazette' },
              { id: 'governance', label: 'Governance' },
              { id: 'system', label: 'System' },
            ]}
            variant="pills"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            className="bg-surface-container-low text-on-surface font-ui-functional text-xs py-1.5 px-3 rounded-lg border border-outline-variant/30 outline-none cursor-pointer hover:bg-surface-container"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High Priority</option>
            <option value="standard">Standard</option>
            <option value="low">Low</option>
          </select>

          <input
            className="bg-surface-container-low text-on-surface font-ui-functional text-xs py-1.5 px-3 rounded-lg border border-outline-variant/30 outline-none placeholder:text-on-surface-variant/50 focus:border-primary w-48 sm:w-60"
            placeholder="Filter notifications..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* DUAL-PANEL NOTIFICATION FEED & PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-gutter)]">
        {/* LEFT FEED COLUMN (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/40 mb-2">
                notifications_off
              </span>
              <p className="text-sm font-semibold text-on-surface">No matching notifications</p>
              <p className="text-xs text-on-surface-variant/70 mt-1">Try resetting your filter or search term.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isSelected = item.id === selectedNotification.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    markAsRead(item.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-surface-container-low border-primary ring-1 ring-primary/20 shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/20 hover:border-outline-variant/40 hover:bg-surface-container-lowest/80'
                  } ${item.unread ? 'border-l-4 border-l-secondary' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getPriorityBadge(item.priority)}
                      <span className="text-[11px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/20">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-on-surface-variant/60 whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-primary leading-snug mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant/80 line-clamp-2 leading-relaxed mb-3">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] border-t border-outline-variant/15 pt-2 mt-1">
                    <span className="text-on-surface-variant/70 truncate max-w-[240px]">
                      Sender: <strong className="text-on-surface font-medium">{item.sender}</strong>
                    </span>
                    <span className="font-mono text-primary font-medium">{item.id}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT PREVIEW / DETAIL PANEL (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/25 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <span className="font-label-caps text-xs uppercase tracking-wider text-secondary font-bold">
                Notification Detail
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container text-primary font-medium">
                {selectedNotification.id}
              </span>
            </div>

            <div>
              <div className="mb-2">{getPriorityBadge(selectedNotification.priority)}</div>
              <h2 className="font-serif text-lg font-bold text-primary leading-tight mb-2">
                {selectedNotification.title}
              </h2>
              <p className="text-xs text-on-surface-variant/70">
                Dispatched by <strong className="text-on-surface">{selectedNotification.sender}</strong> • {selectedNotification.timestamp}
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20 space-y-2">
              <p className="text-xs font-label-caps uppercase text-secondary font-medium tracking-wider">
                Full Synopsis &amp; Action Directives
              </p>
              <p className="text-xs text-on-surface leading-relaxed">
                {selectedNotification.summary}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">Target Recipients</span>
                <span className="font-medium text-on-surface text-right max-w-[200px]">{selectedNotification.recipients}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">Delivery Channel</span>
                <span className="font-medium text-on-surface">{selectedNotification.channel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-outline-variant/15">
                <span className="text-on-surface-variant">Dispatch Status</span>
                <span className="font-semibold text-primary">{selectedNotification.status}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {selectedNotification.actionText && (
                <button
                  onClick={() => alert(`Executing action: ${selectedNotification.actionText} for ${selectedNotification.id}`)}
                  className="w-full py-2 px-4 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {selectedNotification.actionText}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              )}
              <button
                onClick={() => alert(`Archiving notice ${selectedNotification.id}`)}
                className="w-full py-1.5 px-4 bg-surface-container-low text-on-surface-variant hover:text-on-surface rounded-lg text-xs font-medium border border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer"
              >
                Archive Notification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
