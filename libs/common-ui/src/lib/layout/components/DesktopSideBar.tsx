import React from 'react';
import { SideBarSection } from './SideBarSection';
import { Avatar } from './Avatar';
import { SideBarProps } from './type';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export const DesktopSideBar = ({ navigationSections }: SideBarProps) => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7 justify-between content-between">
            {navigationSections.map((section) => (
              <SideBarSection section={section} key={section.name} />
            ))}
            <li className="-mx-6 flex gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-text-primary justify-between">
              {/* @TODO: Use AuthContext to pass in name here */}
              <Avatar name="Default" />
              {/* @TODO: Use AuthContext to sign out from here */}
              <button>
                <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0 text-icon-primary hover:text-admin-primary-500" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
