import { useMemo } from 'react';
import { convertKebabCaseToUpperCaseString } from '../../layout/utils';
import { Link } from 'react-router-dom';
import { CustomItemMenuType, MenuTree } from '../../types';
export const useGetTopNavMenuItems = (menuTree: MenuTree) => {
  const memoedMenuItems = useMemo(
    () =>
      Object.values(menuTree)
        ?.filter((child) => !child.isNotInMainNav)
        .map((item) => ({
          label: (
            <Link key={item.title} to={`${item.label}`}>
              {convertKebabCaseToUpperCaseString(item.title)}
            </Link>
          ),
          key: item.title,
        })),
    [menuTree],
  ) as CustomItemMenuType[];

  return memoedMenuItems;
};
