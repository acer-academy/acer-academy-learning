import { useMemo } from 'react';
import { NavigationMenuItem } from './type';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { classNames } from '../../utils/classNames';
import { getThemeClassName } from '../../utils/getThemeClassName';
import { useThemeContext } from '../contexts/ThemeContext';
import { LayoutRole } from '../constants';

export type DisclosureChildItem = {
  item: NavigationMenuItem;
  isChild?: boolean;
  groupHoverColor?: string;
  textHoverColor?: string;
  textColor?: string;
  activeColor?: string;
  bgColor?: string;
  bgHoverColor?: string;
};

export const DisclosureLeafItem = ({
  item,
  isChild = true,
  textColor,
  groupHoverColor,
  textHoverColor,
  activeColor,
  bgColor,
  bgHoverColor,
}: DisclosureChildItem) => {
  const location = useLocation();
  const params = useParams();
  const { role } = useThemeContext();
  const sizeStyles = useMemo(
    () =>
      isChild
        ? 'block rounded-md py-2 pr-2 pl-11 text-base leading-6 flex space-x-1'
        : 'group flex gap-x-3 rounded-md p-2 text-base leading-6 font-semibold',
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
    return item.isStrict
      ? location.pathname === path
      : location.pathname.includes(path);
  }, [location, path, item]);

  return (
    <NavLink
      to={`${path}`}
      className={classNames(
        // Needs to be fixed later on
        containsPath
          ? `
          ${
            bgColor ??
            (role === LayoutRole.Admin
              ? getThemeClassName('bg', role, true, 700)
              : getThemeClassName('bg', role, true, 900))
          } 
            ${activeColor ?? 'text-white'}`
          : `${
              textColor ??
              (role === LayoutRole.Admin
                ? getThemeClassName('text', role, true, 200)
                : 'text-gray-900')
            } ${textHoverColor ?? 'hover:text-white'} ${
              bgHoverColor ??
              (role === LayoutRole.Admin
                ? getThemeClassName('hover:bg', role, true, 700)
                : getThemeClassName('hover:bg', role, false, 700))
            }`,
        sizeStyles,
      )}
    >
      {item.icon && (
        <item.icon
          className={classNames(
            containsPath
              ? 'text-white'
              : `${textColor ?? getThemeClassName('text', role, true, 600)} ${
                  groupHoverColor ?? 'group-hover:text-white'
                }`,
            'h-6 w-6 shrink-0',
          )}
          aria-hidden="true"
        />
      )}
      {item.name}
    </NavLink>
  );
};
