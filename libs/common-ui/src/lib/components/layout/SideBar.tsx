import React from 'react';
import { NavigationMenuItem, NavigationSection } from './type';
import { classNames } from '../../utils/classNames';
export type SideBarProps = {
  navigationSections: NavigationSection[];
};

export const SideBar = ({ navigationSections }: SideBarProps) => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=white"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            {navigationSections.map((section) => (
              <li key={section.name}>
                {section.name && (
                  <div className="text-xs font-semibold leading-6 text-indigo-200">
                    {section.name}
                  </div>
                )}
                <ul className="-mx-2 space-y-1">
                  {section.menu.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          // item.current
                          //   ? 'bg-indigo-700 text-white'
                          'text-indigo-200 hover:text-white hover:bg-indigo-700',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                        )}
                      >
                        {item.icon && (
                          <item.icon
                            className={classNames(
                              // item.current
                              //   ? 'text-white'
                              'text-indigo-200 group-hover:text-white',
                              'h-6 w-6 shrink-0',
                            )}
                            aria-hidden="true"
                          />
                        )}
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="-mx-6 mt-auto">
              <img
                className="h-8 w-8 rounded-full bg-indigo-700"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
