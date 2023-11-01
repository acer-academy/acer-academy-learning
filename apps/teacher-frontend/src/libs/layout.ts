import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import {
  ACCOUNT,
  ANALYTICS,
  ASSIGNMENT_ANALYTICS_MGMT,
  BOOK_CLASSES,
  DASHBOARD,
  PROFILE,
  QUESTION_BANK,
  QUIZZES,
  QUIZ_ANALYTICS_MGMT,
  REWARDS,
  SCHEDULING,
  SETTINGS,
  SUBJECTS,
  VIEW_ASSIGNMENT_ANALYTICS,
  VIEW_CLASSES,
  VIEW_QUIZ_ANALYTICS,
} from './routes';
import {
  UserIcon,
  Cog6ToothIcon,
  InboxStackIcon,
  PaperClipIcon,
  CalculatorIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

export const NAV_SECTIONS: NavigationMenuItem[] = [
  {
    name: 'DASHBOARD',
    path: DASHBOARD,
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
      // { name: 'Book Classes', path: BOOK_CLASSES, icon: CalculatorIcon },
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
