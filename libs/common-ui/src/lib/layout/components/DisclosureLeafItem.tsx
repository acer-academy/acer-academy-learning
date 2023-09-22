import { useMemo } from 'react';
import { NavigationMenuItem } from './type';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../utils/classNames';
import { useMenuItem } from '../hooks/useMenuItem';
import { getThemeClassName } from '../../utils/getThemeClassName';
import { useThemeContext } from '../contexts/ThemeContext';
import { useThemeColorsOnClass } from '../hooks/useThemeColorOnClass';
import { LayoutRole } from '../constants';

export type DisclosureChildItem = {
  item: NavigationMenuItem;
  isChild?: boolean;
  textColor?: string;
  bgColor?: string;
  bgHoverColor?: string;
};

export const DisclosureLeafItem = ({
  item,
  isChild = true,
  textColor,
  bgColor,
  bgHoverColor,
}: DisclosureChildItem) => {
  const [isActive] = useMenuItem(item);
  const { role } = useThemeContext();
  const sizeStyles = useMemo(
    () =>
      isChild
        ? 'block rounded-md py-2 pr-2 pl-9 text-sm leading-6'
        : 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
    [isChild],
  );

  return (
    <NavLink
      to={`${item.path}`}
      className={classNames(
        // Needs to be fixed later on
        isActive
          ? `${
              bgColor ??
              (role === LayoutRole.Teacher
                ? 'bg-teacher-primary-700'
                : 'bg-student-primary-700')
            } text-white`
          : `${
              textColor ??
              (role === LayoutRole.Teacher
                ? 'text-teacher-primary-200'
                : 'text-student-primary-200')
            } hover:text-white ${
              bgHoverColor ??
              (role === LayoutRole.Teacher
                ? 'hover:bg-teacher-primary-700'
                : 'hover:bg-student-primary-700')
            }`,
        sizeStyles,
      )}
    >
      {item.icon && (
        <item.icon
          className={classNames(
            isActive
              ? 'text-white'
              : `${getThemeClassName(
                  'text',
                  role,
                  true,
                  200,
                )} group-hover:text-white`,
            'h-6 w-6 shrink-0',
          )}
          aria-hidden="true"
        />
      )}
      {item.name}
    </NavLink>
  );
};
