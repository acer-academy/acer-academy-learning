import { useMemo } from 'react';
import { convertKebabCaseToUpperCamelCase } from '../../layout/utils';
import { Link, useLocation } from 'react-router-dom';
import { CustomItemMenuType } from '../../types';

const topNavMatch = /^\/([^/]+)/;

export const getSecondaryMenuItemsFor = (
  category: string,
  menuTree: { [key: string]: CustomItemMenuType },
) => {
  return menuTree[category]?.children?.map((child) => ({
    label: (
      <Link key={child.title} to={`${category}${child.label}`}>
        {convertKebabCaseToUpperCamelCase(child.title)}
      </Link>
    ),
    key: child.title,
    icon: child.icon,
  })) as CustomItemMenuType[];
};

export const useGetSecondaryMenuItems = (menuTree: {
  [key: string]: CustomItemMenuType;
}): CustomItemMenuType[] => {
  const location = useLocation();

  const category = useMemo(
    () => location.pathname.match(topNavMatch)?.[0],
    [location],
  );

  const memoedSecondaryMenuItems = useMemo(() => {
    if (!category) {
      return [];
    }
    return getSecondaryMenuItemsFor(category, menuTree);
  }, [category, menuTree]);

  return memoedSecondaryMenuItems;
};
