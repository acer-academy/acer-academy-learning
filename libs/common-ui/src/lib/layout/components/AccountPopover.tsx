import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { NavigationMenuItem } from './type';
import { useThemeContext } from '../contexts/ThemeContext';
import { DisclosureLeafItem } from './DisclosureLeafItem';
import { Avatar } from './Avatar';
import { getThemeClassName } from '../../utils/getThemeClassName';

export type AccountPopoverProps = {
  firstName: string;
  menuItems?: NavigationMenuItem[];
};

export const AccountPopover = ({
  firstName,
  menuItems,
}: AccountPopoverProps) => {
  const { role } = useThemeContext();
  return (
    <div className={` w-full max-w-sm px-4 h-full`}>
      <Popover className={`relative`}>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
              ${open ? '' : 'text-opacity-90'}
              group inline-flex items-center rounded-md ${getThemeClassName(
                'bg',
                role,
                true,
                900,
              )} px-3 py-2 text-base font-medium text-white hover:text-opacity-100 outline-none ${
                open ? 'outline-gray-100' : ''
              }`}
            >
              <Avatar
                firstName={firstName}
                borderStyle={getThemeClassName('border', role, true, 400)}
                // bgStyle={getThemeClassName('bg', role, true, 700)}
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              {menuItems && (
                // <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-xs">
                <Popover.Panel
                  className={`rounded-md ${getThemeClassName(
                    'bg',
                    role,
                    true,
                    900,
                  )} absolute w-screen max-w-xs right-0 mt-4 
                  shadow-2xl z-[1]
                `}
                >
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className={`relative flex flex-col p-4 `}>
                      {menuItems.map((item) => (
                        <DisclosureLeafItem
                          textColor="text-white"
                          bgColor={getThemeClassName('bg', role, true, 900)}
                          bgHoverColor={getThemeClassName(
                            'hover:bg',
                            role,
                            true,
                            700,
                          )}
                          key={item.name}
                          item={item}
                          isChild={false}
                        />
                      ))}
                    </div>
                  </div>
                </Popover.Panel>
              )}
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
