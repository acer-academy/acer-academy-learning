import { useMemo } from 'react';
import { NavigationMenuItem } from './type';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { classNames } from '../../utils/classNames';
import { useMenuItem } from '../hooks/useMenuItem';
import { getThemeClassName } from '../../utils/getThemeClassName';
import { useThemeContext } from '../contexts/ThemeContext';
import { LayoutRole } from '../constants';

export type DisclosureChildItem = {
  item: NavigationMenuItem;
  isChild?: boolean;
  groupHoverColor?: string;
  textHoverColor?: string;
  textColor?: string;
  bgColor?: string;
  bgHoverColor?: string;
};

export const DisclosureLeafItem = ({
  item,
  isChild = true,
  textColor,
  groupHoverColor,
  textHoverColor,
  bgColor,
  bgHoverColor,
}: DisclosureChildItem) => {
  const location = useLocation();
  const params = useParams();
  const [isActive] = useMenuItem(item);
  const { role } = useThemeContext();
  const sizeStyles = useMemo(
    () =>
      isChild
        ? 'block rounded-md py-2 pr-2 pl-11 text-sm leading-6'
        : 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
    [isChild],
  );
  const path = useMemo(() => {
    const subpaths = item.path?.split('/');
    if (!subpaths) {
      return item.path;
    }

    let finalPath = '';
    subpaths.forEach((path) => {
      if (!path) {
        return;
      }
      if (path.charAt(0) === ':') {
        const param = path.substring(1);
        finalPath += '/' + params[param];
      } else {
        finalPath += '/' + path;
      }
    });

    return finalPath;
  }, [params, item]);

  const containsPath = useMemo(() => {
    if (!path) {
      return false;
    }
    return location.pathname.includes(path);
  }, [location, path]);

  return (
    <NavLink
      to={`${path}`}
      className={classNames(
        // Needs to be fixed later on
        containsPath
          ? `
          ${bgColor ?? getThemeClassName('bg', role, true, 700)} 
            ${textColor ?? 'text-white'}`
          : `${
              role === LayoutRole.Admin
                ? getThemeClassName('text', role, true, 200)
                : getThemeClassName('text', role, true, 600)
            } ${textHoverColor ?? 'hover:text-white'} ${
              bgHoverColor ?? getThemeClassName('hover:bg', role, true, 700)
            }`,
        sizeStyles,
      )}
    >
      {item.icon && (
        <item.icon
          className={classNames(
            isActive
              ? textColor ?? 'text-white'
              : `${getThemeClassName(
                  'text',
                  role,
                  true,
                  role === LayoutRole.Admin ? 200 : 700,
                )} ${groupHoverColor ?? 'group-hover:text-white'}`,
            'h-6 w-6 shrink-0',
          )}
          aria-hidden="true"
        />
      )}
      {item.name}
    </NavLink>
  );
};
