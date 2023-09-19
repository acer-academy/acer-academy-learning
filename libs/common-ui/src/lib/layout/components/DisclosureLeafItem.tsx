import { useMemo } from 'react';
import { NavigationMenuItem } from './type';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../utils/classNames';
import { useMenuItem } from '../hooks/useMenuItem';

export type DisclosureChildItem = {
  item: NavigationMenuItem;
  isChild?: boolean;
};

export const DisclosureLeafItem = ({
  item,
  isChild = true,
}: DisclosureChildItem) => {
  const [isActive] = useMenuItem(item);
  const sizeStyles = useMemo(
    () =>
      isChild
        ? 'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700'
        : 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700',
    [isChild],
  );
  return (
    <li>
      <NavLink
        to={`${item.path}`}
        className={classNames(
          isActive
            ? 'bg-admin-primary-700 text-white'
            : 'text-admin-primary-200 hover:text-white hover:bg-admin-primary-700',
          sizeStyles,
        )}
      >
        {item.icon && (
          <item.icon
            className={classNames(
              isActive
                ? 'text-admin-secondary'
                : 'text-admin-primary-200 group-hover:text-admin-secondary',
              'h-6 w-6 shrink-0',
            )}
            aria-hidden="true"
          />
        )}
        {item.name}
      </NavLink>
    </li>
  );
};
