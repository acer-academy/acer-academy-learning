import { Bars3Icon } from '@heroicons/react/24/outline';
import React, { useContext } from 'react';
import { MobileContext } from '../contexts/mobile.context';
import { Avatar } from './Avatar';

export const MobileTopNav = () => {
  const { setSidebarOpen } = useContext(MobileContext);
  return (
    <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-admin-primary-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-900 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6 text-icon-primary" aria-hidden="true" />
      </button>
      <div className="flex-1 text-sm font-semibold leading-6 text-admin-secondary">
        Dashboard
      </div>
      <section>
        <Avatar firstName="Student" />
      </section>
    </div>
  );
};
