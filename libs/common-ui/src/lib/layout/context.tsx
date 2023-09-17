import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { MenuTree } from '../types';

type MenuStates = {
  menuTree: MenuTree;
};

export const MenuItemsContext = createContext<MenuStates>({} as MenuStates);

export const useMenuItemsContext = () => {
  const context = useContext(MenuItemsContext);

  if (context === undefined) {
    throw new Error(`Must use context within ${MenuItemsContext}.name`);
  }
  return context;
};
