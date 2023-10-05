import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import {
  ACCOUNT,
  ANALYTICS,
  DASHBOARD,
  PROFILE,
  QUESTION_BANK,
  REWARDS,
  SCHEDULING,
  SETTINGS,
  SUBJECTS,
} from './routes';
import {
  UserIcon,
  Cog6ToothIcon,
  InboxStackIcon,
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
        path: '/question-bank',
        icon: InboxStackIcon,
        dynamicRoute: true,
      },
    ],
    noSideBar: true,
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
