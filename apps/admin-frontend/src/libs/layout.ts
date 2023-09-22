import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import {
  BuildingStorefrontIcon,
  // CalendarDaysIcon,
  // CircleStackIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import {
  ADMINS,
  CENTRE,
  FAQ,
  HUMAN_RESOURCES,
  STUDENTS,
  TEACHERS,
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
