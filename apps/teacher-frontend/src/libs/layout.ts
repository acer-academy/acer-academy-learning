import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import {
  ACCOUNT,
  ANALYTICS,
  DASHBOARD,
  PROFILE,
  REWARDS,
  SCHEDULING,
  SETTINGS,
  SUBJECTS,
} from './routes';
import {
  UserIcon,
  Cog6ToothIcon,
  InboxStackIcon,
  DocumentTextIcon,
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
        path: `${SUBJECTS}/math/question-bank`,
        icon: InboxStackIcon,
      },
      {
        name: 'Quizzes',
        path: `${SUBJECTS}/math/quizzes`,
        icon: DocumentTextIcon,
      },
    ],
  },
  {
    name: 'ANALYTICS',
    path: ANALYTICS,
  },
  {
    name: 'SCHEDULING',
    path: SCHEDULING,
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
