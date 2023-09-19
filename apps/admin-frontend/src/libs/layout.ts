import { NavigationSection } from 'libs/common-ui/src/lib/layout/components/type';
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
export const NAV_SECTIONS: NavigationSection[] = [
  {
    name: 'MANAGEMENT',
    menu: [
      {
        name: 'Human Resources',
        // Default to Teachers
        path: TEACHERS,
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
    menu: [{ name: 'Settings', path: '/settings', icon: Cog6ToothIcon }],
  },
];
