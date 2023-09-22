import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationMenuItem } from '../components/type';

export const useMenuItem = (item: NavigationMenuItem) => {
  const location = useLocation();
  const isActive = useMemo(
    () => item.path && location.pathname.includes(item.path),
    [item, location],
  );

  return [isActive];
};
