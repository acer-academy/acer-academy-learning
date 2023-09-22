import React, { useMemo } from 'react';
import { NavigationMenuItem } from '../components/type';
import { useLocation } from 'react-router-dom';

const topNavMatch = /^(\/[^/]+)/;

export const useGetSecondaryMenu = (menu: NavigationMenuItem[]) => {
  const location = useLocation();
  const secondaryMenu = useMemo(() => {
    const currentTopMenuSelected = location.pathname.match(topNavMatch)?.[0];
    const menuMap = menu.reduce((prev, curr) => {
      if (curr.path) {
        prev[curr.path] = curr;
      }

      return prev;
    }, {} as { [key: string]: NavigationMenuItem });

    if (currentTopMenuSelected) {
      return menuMap[currentTopMenuSelected]?.children || [];
    }
    return [];
  }, [location, menu]);

  return secondaryMenu;
};
