import { NavigationMenuItem } from 'libs/common-ui/src/lib/layout/components/type';
import { ACCOUNT, PROFILE, SETTINGS } from './routes';
import { UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export const NAV_SECTIONS: NavigationMenuItem[] = [
  {
    name: 'ACCOUNT',
    path: ACCOUNT,
    children: [
      { name: 'Profile', path: PROFILE, icon: UserIcon },
      { name: 'Settings', path: SETTINGS, icon: Cog6ToothIcon },
    ],
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
