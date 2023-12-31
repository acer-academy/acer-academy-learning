import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import {
  ACCOUNT,
  ASSIGNMENTS,
  BOOKING,
  BOOK_CLASSES,
  BUY_CREDITS,
  DASHBOARD,
  FAQ,
  NOTIFICATIONS,
  PAST_TRANSACTIONS,
  PROFILE,
  QUIZZES,
  RECORDINGS,
  REWARDS,
  SETTINGS,
  SUBJECTS,
  SUBJECT_MAIN,
  TAKES,
  PAST_ATTENDANCE,
  ZOOM_LINK,
} from './routes';
import {
  PaperClipIcon,
  CalculatorIcon,
  VideoCameraIcon,
  LinkIcon,
  UserIcon,
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChartBarIcon,
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
        name: 'Overview',
        path: SUBJECT_MAIN,
        icon: ChartBarIcon,
        isStrict: true,
      },
      { name: 'Assignments', path: ASSIGNMENTS, icon: PaperClipIcon },
      {
        name: 'Quizzes',
        path: `${QUIZZES}`,
        icon: CalculatorIcon,
      },
      {
        name: 'Quiz Attempts',
        path: `${TAKES}`,
        icon: BookOpenIcon,
      },
      { name: 'Recordings', path: RECORDINGS, icon: VideoCameraIcon },
      {
        name: 'Zoom Link',
        path: ZOOM_LINK,
        icon: LinkIcon,
      },
    ],
  },
  {
    name: 'BOOKING',
    path: BOOKING,
    children: [
      { name: 'Book Classes', path: BOOK_CLASSES, icon: CalculatorIcon },
      { name: 'View Past Attendance', path: PAST_ATTENDANCE, icon: PaperClipIcon },
      { name: 'Buy Credits', path: BUY_CREDITS, icon: VideoCameraIcon },
      { name: 'Past Transactions', path: PAST_TRANSACTIONS, icon: LinkIcon },
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
    { name: 'Notifications', path: NOTIFICATIONS, icon: BellIcon },
    { name: 'Settings', path: SETTINGS, icon: Cog6ToothIcon },
    { name: 'FAQ', path: FAQ, icon: QuestionMarkCircleIcon },
  ],
};

export const ROUTES_WITHOUT_SIDEBAR = [SUBJECTS];
