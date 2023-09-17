// Routes (remember to prefix with '/')

import { CustomItemMenuType, MenuTree } from 'libs/common-ui/src/lib/types';
import { getIconFor } from '../utils/layout';

// Dashboard
export const DASHBOARD = '/dashboard';

// Subjects
export const SUBJECTS = '/subjects';
export const ASSIGNMENTS = '/assignments';
export const QUIZZES = '/quizzes';
export const ANALYTICS = '/analytics';
export const RECORDINGS = '/recordings';
export const ZOOM_LINK = '/zoom-link';

// Booking
export const BOOKING = '/booking';
export const VIEW_CLASSES = '/view-classes';
export const BOOK_CLASSES = '/book-classes';
export const BUY_CREDITS = '/buy-credits';

// Rewards
export const REWARDS = '/rewards';

// Account
export const ACCOUNT = '/account';
export const PROFILE = '/profile';
export const NOTIFICATIONS = '/notifications';
export const SETTINGS = '/settings';

// MenuTree
export const StudentMenuTree: MenuTree = {
  [DASHBOARD]: {
    label: DASHBOARD,
    title: DASHBOARD,
    type: 'group',
    icon: getIconFor(DASHBOARD),
  },
  [SUBJECTS]: {
    label: SUBJECTS,
    title: SUBJECTS,
    type: 'group',
    icon: getIconFor(SUBJECTS),
    children: [
      {
        label: ASSIGNMENTS,
        title: ASSIGNMENTS,
        type: 'group',
        icon: getIconFor(ASSIGNMENTS),
      } as CustomItemMenuType,
      {
        label: QUIZZES,
        title: QUIZZES,
        type: 'group',
        icon: getIconFor(QUIZZES),
      },
      {
        label: ANALYTICS,
        title: ANALYTICS,
        type: 'group',
        icon: getIconFor(ANALYTICS),
      },
      {
        label: RECORDINGS,
        title: RECORDINGS,
        type: 'group',
        icon: getIconFor(RECORDINGS),
      },
      {
        label: ZOOM_LINK,
        title: ZOOM_LINK,
        type: 'group',
        icon: getIconFor(ZOOM_LINK),
      },
    ],
  },
  [BOOKING]: {
    label: BOOKING,
    title: BOOKING,
    type: 'group',
    icon: getIconFor(BOOKING),
    children: [
      {
        label: VIEW_CLASSES,
        title: VIEW_CLASSES,
        type: 'group',
        icon: getIconFor(VIEW_CLASSES),
      } as CustomItemMenuType,
      {
        label: BOOK_CLASSES,
        title: BOOK_CLASSES,
        type: 'group',
        icon: getIconFor(BOOK_CLASSES),
      },
      {
        label: BUY_CREDITS,
        title: BUY_CREDITS,
        type: 'group',
        icon: getIconFor(BUY_CREDITS),
      },
    ],
  },
  [REWARDS]: {
    label: REWARDS,
    title: REWARDS,
    type: 'group',
    icon: getIconFor(REWARDS),
  },
  [ACCOUNT]: {
    label: ACCOUNT,
    title: ACCOUNT,
    type: 'group',
    icon: getIconFor(ACCOUNT),
    isNotInMainNav: true,
    children: [
      {
        label: PROFILE,
        title: PROFILE,
        type: 'group',
        icon: getIconFor(PROFILE),
      } as CustomItemMenuType,
      {
        label: NOTIFICATIONS,
        title: NOTIFICATIONS,
        icon: getIconFor(NOTIFICATIONS),
        type: 'group',
      },
      {
        label: SETTINGS,
        title: SETTINGS,
        type: 'group',
        icon: getIconFor(SETTINGS),
      },
    ],
  },
};
