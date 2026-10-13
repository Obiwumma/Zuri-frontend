import { NavGroup } from '@/components/ui/NavShell';

export const institutionalNavGroups: NavGroup[] = [
  {
    groupName: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', path: 'institutional-dashboard' },
      { label: 'Academic Activity', href: '/activity', path: 'academic-activity' },
    ],
  },
  {
    groupName: 'Academic Structure',
    items: [
      { label: 'Faculty / Departments', href: '/departments', path: 'faculty-departments-courses' },
      { label: 'Enrollment', href: '/enrollment', path: 'enrollment-management' },
      { label: 'Course Management', href: '/courses', path: 'course-management' },
      { label: 'Timetable', href: '/timetable', path: 'institutional-timetable' },
      { label: 'Academic Calendar', href: '/calendar', path: 'academic-calendar' },
    ],
  },
  {
    groupName: 'People & Access',
    items: [
      { label: 'Students', href: '/students', path: 'students-directory' },
      { label: 'Lecturers', href: '/lecturers', path: 'lecturers-registry' },
      { label: 'Staff', href: '/students#staff', path: 'staff-directory' },
      { label: 'Roles & Permissions', href: '/roles', path: 'roles-and-permissions' },
    ],
  },
  {
    groupName: 'Content & Knowledge',
    items: [
      { label: 'Content Library', href: '/library', path: 'content-library' },
      { label: 'Materials', href: '/materials', path: 'academic-materials' },
      { label: 'Lecture Archive', href: '/extraction#archive', path: 'lecture-archive' },
      { label: 'Knowledge Base', href: '/extraction#kb', path: 'knowledge-base' },
      { label: 'Document Extraction', href: '/extraction', path: 'document-extraction' },
    ],
  },
  {
    groupName: 'Intelligence & Analytics',
    items: [
      {
        label: 'Analytics Overview',
        href: '/analytics',
        path: 'analytics-overview',
        subItems: [
          { label: 'Intervention Analytics', href: '/analytics/interventions', path: 'intervention-analytics' },
          { label: 'AI Usage', href: '/analytics/ai-usage', path: 'ai-usage-monitoring' },
          { label: 'Quiz Performance', href: '/analytics/quiz-performance', path: 'assessment-outcomes' },
        ],
      },
    ],
  },
  {
    groupName: 'System & Governance',
    items: [
      { label: 'Notifications', href: '/notifications', path: 'institutional-notifications' },
      { label: 'Audit Logs', href: '/roles#audit-logs', path: 'audit-logs' },
      { label: 'Data & Privacy', href: '/settings#privacy', path: 'data-and-privacy' },
      { label: 'Institution Settings', href: '/settings', path: 'institution-settings' },
    ],
  },
];
