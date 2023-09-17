import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';

export type NestedObject = {
  [key: string]: string | number | boolean | NestedObject | undefined;
};

export type CustomItemMenuType = {
  children?: CustomItemMenuType[];
  label: React.ReactNode | string;
  title?: string;
  icon?: React.ReactNode;
  key?: React.Key;
  isNotInMainNav?: boolean;
} & ItemType<MenuItemType>;

export type MenuTree = {
  [key: string]: CustomItemMenuType;
};
