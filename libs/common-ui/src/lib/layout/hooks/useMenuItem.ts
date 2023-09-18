import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationMenuItem } from '../components/type';

export const useMenuItem = (item: NavigationMenuItem) => {
  const location = useLocation();
  const isActive = useMemo(
    () => location.pathname.includes(item.href),
    [item, location],
  );

  return [isActive];
};
