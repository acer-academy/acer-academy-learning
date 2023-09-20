import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import { PROFILE, SETTINGS } from './routes';

export const NAV_SECTIONS: NavigationMenuItem[] = [
  {
    name: 'ACCOUNT',
    children: [
      { name: 'Profile', path: PROFILE },
      { name: 'Settings', path: SETTINGS },
    ],
  },
];
