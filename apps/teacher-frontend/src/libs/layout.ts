import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import {
  ACCOUNT,
  ANALYTICS,
  ASSIGNMENT_ANALYTICS_MGMT,
  DASHBOARD,
  PROFILE,
  QUESTION_BANK,
  QUIZZES,
  QUIZ_ANALYTICS_MGMT,
  REWARDS,
  SCHEDULING,
  SETTINGS,
  SUBJECTS,
  VIEW_CLASSES,
  ASSIGNMENTS,
  SESSIONS_FOR_ATTENDANCE,
  ANNOUNCEMENTS,
} from './routes';
import {
  UserIcon,
  Cog6ToothIcon,
  InboxStackIcon,
  PaperClipIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export const NAV_SECTIONS: NavigationMenuItem[] = [
  {
    name: 'DASHBOARD',
    path: DASHBOARD,
  },
  {
    name: 'ANNOUNCEMENTS',
    path: ANNOUNCEMENTS,
  },
  {
    name: 'SUBJECTS',
    path: SUBJECTS,
    children: [
      {
        name: 'Question Bank',
        path: `${QUESTION_BANK}`,
        icon: InboxStackIcon,
      },
      {
        name: 'Quizzes',
        path: `${QUIZZES}`,
        icon: DocumentTextIcon,
      },
      {
        name: 'Assignments',
        path: `${ASSIGNMENTS}`,
        icon: PaperClipIcon,
      },
    ],
  },
  {
    name: 'ANALYTICS',
    path: ANALYTICS,
    children: [
      {
        name: 'Quiz Statistics',
        path: QUIZ_ANALYTICS_MGMT,
        icon: DocumentTextIcon,
      },
      {
        name: 'Assignment Statistics',
        path: ASSIGNMENT_ANALYTICS_MGMT,
        icon: InboxStackIcon,
      },
    ],
  },
  {
    name: 'SCHEDULING',
    path: SCHEDULING,
    children: [
      { name: 'View Classes', path: VIEW_CLASSES, icon: CalendarDaysIcon },
      { name: 'Attendance', path: SESSIONS_FOR_ATTENDANCE, icon: ClockIcon },
    ],
  },
  {
    name: 'REWARDS',
    path: REWARDS,
  },
];

export const ACCOUNT_NAV: NavigationMenuItem = {
  name: 'Account',
  path: ACCOUNT,
  children: [
    { name: 'Profile', path: PROFILE, icon: UserIcon },
    { name: 'Settings', path: SETTINGS, icon: Cog6ToothIcon },
  ],
};

export const ROUTES_WITHOUT_SIDEBAR = [SUBJECTS];
