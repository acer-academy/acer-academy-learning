import { Disclosure, type DisclosureButtonProps } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { NavigationMenuItem } from './type';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../utils/classNames';
import { DisclosureLeafItem } from './DisclosureLeafItem';
import { useMenuItem } from '../hooks/useMenuItem';
import { ElementType, useMemo } from 'react';

export type DisclosureMenuItemProps = {
  item: NavigationMenuItem;
};

export const DisclosureMenuItem = ({ item }: DisclosureMenuItemProps) => {
  const isActive = useMenuItem(item);
  const disclosureProps = useMemo<Partial<DisclosureButtonProps<ElementType>>>(
    () =>
      item.path
        ? {
            as: NavLink,
            to: item.path,
          }
        : {},
    [item],
  );
  return (
    <li key={item.name}>
      <Disclosure as="div">
        {({ open }) => (
          <>
            <Disclosure.Button
              {...disclosureProps}
              className={classNames(
                isActive
                  ? 'bg-admin-primary-700 text-white'
                  : 'text-admin-primary-200 hover:text-white hover:bg-admin-primary-700',
                'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700',
              )}
            >
              {item.icon && (
                <item.icon
                  className="h-6 w-6 shrink-0 text-icon-primary"
                  aria-hidden="true"
                />
              )}
              {item.name}
              <ChevronRightIcon
                className={classNames(
                  isActive
                    ? 'rotate-90 text-admin-secondary'
                    : 'text-admin-primary-200 group-hover:text-admin-secondary',
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
