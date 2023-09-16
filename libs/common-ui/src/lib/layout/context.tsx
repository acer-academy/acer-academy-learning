import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { StudentTopNavEnum, TeacherTopNavEnum } from './utils';

type MenuStates = {
  activeTab: StudentTopNavEnum | TeacherTopNavEnum | undefined;
  setActiveTab: Dispatch<
    SetStateAction<StudentTopNavEnum | TeacherTopNavEnum | undefined>
  >;
};

export const MenuItemsContext = createContext<MenuStates>({} as MenuStates);

export const useMenuItemsContext = () => {
  const context = useContext(MenuItemsContext);

  if (context === undefined) {
    throw new Error(`Must use context within ${MenuItemsContext}.name`);
  }
  return context;
};
