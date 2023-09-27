import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import {
  BuildingStorefrontIcon,
  // CalendarDaysIcon,
  // CircleStackIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
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
        path: HUMAN_RESOURCES,
        icon: CurrencyDollarIcon,
        children: [
          { name: 'Credit Bundle', path: CREDIT_BUNDLE },
          { name: 'Transactions', path: TRANSACTION },
          { name: 'Promotions', path: PROMOTION },
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
