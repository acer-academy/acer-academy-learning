import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import {
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  // CircleStackIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import {
  ADMINS,
  CENTRE,
  FAQ,
  HUMAN_RESOURCES,
  PROMOTION,
  STUDENTS,
  TEACHERS,
  CREDIT_BUNDLE,
  TRANSACTION,
  CREDIT_RESOURCES,
  TERM,
  CLASS_CREDITS,
  VIEW_CLASSES,
  BOOK_CLASSES,
  SCHEDULING_RESOURCES
} from './routes';
export const NAV_SECTIONS: NavigationMenuItem[] = [
  {
    name: 'MANAGEMENT',
    children: [
      {
        name: 'Human Resources',
        path: HUMAN_RESOURCES,
        icon: UsersIcon,
        children: [
          { name: 'Teachers', path: TEACHERS },
          { name: 'Students', path: STUDENTS },
          { name: 'Admin', path: ADMINS },
        ],
      },
      {
        name: 'Credit Resources',
        path: CREDIT_RESOURCES,
        icon: CurrencyDollarIcon,
        children: [
          { name: 'Class Credits', path: CLASS_CREDITS },
          { name: 'Transactions', path: TRANSACTION },
          { name: 'Credit Bundle', path: CREDIT_BUNDLE },
          { name: 'Promotions', path: PROMOTION },
          { name: 'Terms', path: TERM },
        ],
      },
      {
        name: 'Scheduling Resources',
        path: SCHEDULING_RESOURCES,
        icon: CalendarDaysIcon,
        children: [
          { name: 'View Classes', path: VIEW_CLASSES},
          { name: 'Book Classes', path: BOOK_CLASSES},
        ],
      },
      // { name: 'Scheduling', path: '/scheduling', icon: CalendarDaysIcon },
      { name: 'Centre', path: CENTRE, icon: BuildingStorefrontIcon },
      // { name: 'Class Credits', path: '/class-credits', icon: CircleStackIcon },
      { name: 'FAQ', path: FAQ, icon: QuestionMarkCircleIcon },
    ],
  },
  {
    name: 'OTHERS',
    children: [{ name: 'Settings', path: '/settings', icon: Cog6ToothIcon }],
  },
];
