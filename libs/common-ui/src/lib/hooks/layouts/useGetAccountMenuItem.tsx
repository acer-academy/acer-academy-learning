import { Image, ImageProps } from 'antd';
import { createElement, useMemo } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { getSecondaryMenuItemsFor } from './useGetSecondaryMenuItems';
import { CustomItemMenuType } from '../../types';
import { useMenuItemsContext } from '../../layout/context';

/**
 * Utility function to get menu item array to populate for account
 */
export const useGetAccountMenuItem = (
  name: string,
  imageUrl?: string,
): CustomItemMenuType[] => {
  const { menuTree } = useMenuItemsContext();
  const accountMenuItem: CustomItemMenuType[] = useMemo<
    CustomItemMenuType[]
  >(() => {
    const IMAGE_PROPS: ImageProps = {
      width: 24,
      height: 24,
      src: imageUrl,
    };
    const menuItem: CustomItemMenuType[] = [
      {
        label: name,
        key: name,
        icon:
          (imageUrl && createElement(Image, IMAGE_PROPS)) ||
          createElement(UserOutlined, {
            style: {
              fontSize: '1.5rem',
            },
          }),
        children: getSecondaryMenuItemsFor('/account', menuTree),
      },
    ];

    return menuItem;
  }, [name, imageUrl, menuTree]);

  return accountMenuItem;
};
