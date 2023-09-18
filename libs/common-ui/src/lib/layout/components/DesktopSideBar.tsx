import React from 'react';
import { SideBarSection } from './SideBarSection';
import { Avatar } from './Avatar';
import { SideBarProps } from './type';

export const DesktopSideBar = ({ navigationSections }: SideBarProps) => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-admin-primary-600 px-6">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=white"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7 justify-between content-between">
            {navigationSections.map((section) => (
              <SideBarSection section={section} key={section.name} />
            ))}
            <li className="-mx-6 mt-auto">
              <a
                href="#"
                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
              >
                <Avatar />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
