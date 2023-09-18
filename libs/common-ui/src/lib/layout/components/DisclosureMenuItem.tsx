import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';
import { NavigationMenuItem } from './type';
import { NavLink, useLocation } from 'react-router-dom';
import { classNames } from '../../utils/classNames';
import { DisclosureLeafItem } from './DisclosureLeafItem';

export type DisclosureMenuItemProps = {
  item: NavigationMenuItem;
};

export const DisclosureMenuItem = ({ item }: DisclosureMenuItemProps) => {
  const location = useLocation();
  const isActive = useMemo(
    () => location.pathname.includes(item.href),
    [item, location],
  );
  return (
    <li key={item.name}>
      <Disclosure as="div">
        {({ open }) => (
          <>
            <Disclosure.Button
              as={NavLink}
              to={item.href}
              className={classNames(
                isActive
                  ? 'bg-admin-secondary-500'
                  : 'hover:bg-admin-secondary-500',
                'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700',
              )}
            >
              {item.icon && (
                <item.icon
                  className="h-6 w-6 shrink-0 text-admin-primary-400"
                  aria-hidden="true"
                />
              )}
              {item.name}
              <ChevronRightIcon
                className={classNames(
                  open ? 'rotate-90 text-admin-primary-500' : 'text-gray-400',
                  'ml-auto h-5 w-5 shrink-0',
                )}
                aria-hidden="true"
              />
            </Disclosure.Button>
            <Disclosure.Panel as="ul" className="mt-1 px-2">
              {item.children?.map((subItem) => (
                <DisclosureLeafItem key={subItem.name} item={subItem} />
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </li>
  );
};
