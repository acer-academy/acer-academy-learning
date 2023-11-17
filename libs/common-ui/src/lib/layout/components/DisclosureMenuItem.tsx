import { Disclosure, type DisclosureButtonProps } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { NavigationMenuItem } from './type';
import { NavLink, useLocation } from 'react-router-dom';
import { classNames } from '../../utils/classNames';
import { DisclosureLeafItem } from './DisclosureLeafItem';
import { useMenuItem } from '../hooks/useMenuItem';
import { ElementType, useMemo } from 'react';
import { getThemeClassName } from '../../utils/getThemeClassName';
import { useThemeContext } from '../contexts/ThemeContext';
import { LayoutRole } from '../constants';

export type DisclosureMenuItemProps = {
  disableNavigateOnClick?: boolean;
  textStyle?: string;
  activeTextStyle?: string;
  textHoverStyle?: string;
  bgStyle?: string;
  bgHoverStyle?: string;
  panelBgStyle?: string;
  item: NavigationMenuItem;
};

export const DisclosureMenuItem = ({
  disableNavigateOnClick,
  textHoverStyle,
  activeTextStyle,
  textStyle,
  bgStyle,
  bgHoverStyle,
  item,
  panelBgStyle,
}: DisclosureMenuItemProps) => {
  const [isActive] = useMenuItem(item);
  const { role } = useThemeContext();

  const disclosureProps = useMemo<Partial<DisclosureButtonProps<ElementType>>>(
    () =>
      item.path && !disableNavigateOnClick
        ? {
            as: NavLink,
            to: item.path,
          }
        : {},
    [item, disableNavigateOnClick],
  );
  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button
            {...disclosureProps}
            className={classNames(
              isActive
                ? `${bgStyle ?? getThemeClassName('bg', role, true, 700)} ${
                    role === LayoutRole.Admin ? 'text-white' : 'text-gray-700'
                  } ${activeTextStyle ?? 'text-white'}`
                : // : 'text-admin-primary-200 hover:text-white hover:bg-admin-primary-700',
                  `
                    ${textStyle ?? getThemeClassName('text', role, true, 200)}
                   ${textHoverStyle ?? 'hover:text-white'} 
                   ${
                     bgHoverStyle ??
                     getThemeClassName('hover:bg', role, true, 700)
                   }`,
              `group flex items-center w-full text-left ${
                open ? 'rounded-t-md' : 'rounded-md'
              } p-2 gap-x-3 text-base leading-6 font-semibold`,
            )}
          >
            {item.icon && (
              <item.icon
                className={classNames(
                  isActive
                    ? `${activeTextStyle ?? 'text-white'}`
                    : // : `text-admin-primary-200 group-hover:text-white`,
                      `${
                        textStyle ?? getThemeClassName('text', role, true, 200)
                      } group-hover:text-white`,
                  'h-6 w-6 shrink-0',
                )}
                aria-hidden="true"
              />
            )}
            {item.name}
            <ChevronRightIcon
              className={classNames(
                open
                  ? 'rotate-90 text-white'
                  : `${getThemeClassName(
                      'text',
                      role,
                      true,
                      200,
                    )}  group-hover:text-admin-secondary`,
                'ml-auto h-5 w-5 shrink-0',
              )}
              aria-hidden="true"
            />
          </Disclosure.Button>
          <Disclosure.Panel
            as="ul"
            className={`rounded-b ${
              panelBgStyle ?? getThemeClassName('bg', role, true, 900)
            }`}
          >
            {item.children?.map((subItem) => (
              <DisclosureLeafItem key={subItem.name} item={subItem} />
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
