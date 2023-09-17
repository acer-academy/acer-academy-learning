import { Menu, Layout } from 'antd';
import React from 'react';
import { useGetSecondaryMenuItems } from '../hooks/layouts/useGetSecondaryMenuItems';
import styles from './CommonSider.module.scss';
import { MenuTree } from '../types';

const { Sider } = Layout;

export type CommonSiderProps = {
  menuTree: MenuTree;
};

export const CommonSider = ({ menuTree }: CommonSiderProps) => {
  const secondaryMenuItems = useGetSecondaryMenuItems(menuTree);
  return (
    <Sider collapsible width={200}>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[]}
        className={styles.sideMenu}
        items={secondaryMenuItems}
      />
    </Sider>
  );
};
