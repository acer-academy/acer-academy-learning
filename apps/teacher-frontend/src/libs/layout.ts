import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import {
  ACCOUNT,
  ANALYTICS,
  BOOK_CLASSES,
  DASHBOARD,
  PROFILE,
  REWARDS,
  SCHEDULING,
  SETTINGS,
  SUBJECTS,
  VIEW_CLASSES,
} from './routes';
import {
  UserIcon,
  Cog6ToothIcon,
  InboxStackIcon,
  PaperClipIcon,
  CalculatorIcon,
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
    noSideBar: true,
  },
  {
    name: 'ANALYTICS',
    path: ANALYTICS,
  },
  {
    name: 'SCHEDULING',
    path: SCHEDULING,
    children: [
      { name: 'View Classes', path: VIEW_CLASSES, icon: PaperClipIcon },
      { name: 'Book Classes', path: BOOK_CLASSES, icon: CalculatorIcon },
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
