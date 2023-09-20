import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import {
  ASSIGNMENTS,
  BOOKING,
  BOOK_CLASSES,
  BUY_CREDITS,
  DASHBOARD,
  PAST_TRANSACTIONS,
  QUIZZES,
  RECORDINGS,
  REWARDS,
  SUBJECTS,
  VIEW_CLASSES,
  ZOOM_LINK,
} from './routes';
import {
  PaperClipIcon,
  CalculatorIcon,
  VideoCameraIcon,
  LinkIcon,
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
      { name: 'Assignments', path: ASSIGNMENTS, icon: PaperClipIcon },
      { name: 'Quizzes', path: QUIZZES, icon: CalculatorIcon },
      { name: 'Recordings', path: RECORDINGS, icon: VideoCameraIcon },
      { name: 'Zoom Link', path: ZOOM_LINK, icon: LinkIcon },
    ],
  },
  {
    name: 'BOOKING',
    path: BOOKING,
    children: [
      { name: 'View Classes', path: VIEW_CLASSES, icon: PaperClipIcon },
      { name: 'Book Classes', path: BOOK_CLASSES, icon: CalculatorIcon },
      { name: 'Buy Credits', path: BUY_CREDITS, icon: VideoCameraIcon },
      { name: 'Past Transactions', path: PAST_TRANSACTIONS, icon: LinkIcon },
    ],
  },
  {
    name: 'REWARDS',
    path: REWARDS,
  },
];
