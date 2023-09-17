import { Button, Menu, MenuProps, Row } from 'antd';
import React from 'react';
import styles from './TopNav.module.scss';
import { QuestionCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { useMenuItemsContext } from '../layout/context';
import { useGetTopNavMenuItems } from '../hooks/layouts/useGetTopNavMenuItems';
import { PrimaryLayoutTypeEnum } from '../layout/constants';
import { useGetAccountMenuItem } from '../hooks/layouts/useGetAccountMenuItem';
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';

export type TopNavProps = {
  type: PrimaryLayoutTypeEnum;
  name: string;
  imageUrl?: string;
};

export const TopNav = ({ name, imageUrl, type }: TopNavProps) => {
  const { menuTree } = useMenuItemsContext();
  const accountMenuItem = useGetAccountMenuItem(name, imageUrl);
  const topNavSubMenuItems = useGetTopNavMenuItems(menuTree);

  return (
    <>
      <nav className={styles.topNavMisc}>
        <img src="./src/assets/acer-academy-logo.jpg" alt="Acer Academy Logo" />
        <Row>
          <Button
            type="text"
            shape="circle"
            className={styles.topMenuQuestionButton}
            icon={<QuestionCircleOutlined style={{ fontSize: '1.5rem' }} />}
          />
          <Menu
            selectedKeys={[]}
            className={styles.topMenuItems}
            theme="dark"
            mode="horizontal"
            items={accountMenuItem as ItemType<MenuItemType>[]}
          />
          <Button
            type="text"
            shape="circle"
            className={styles.topMenuQuestionButton}
            icon={<LogoutOutlined style={{ fontSize: '1.5rem' }} />}
          />
        </Row>
      </nav>
      <Menu
        selectedKeys={[]}
        className={styles.topNavMain}
        theme="dark"
        mode="horizontal"
        items={topNavSubMenuItems}
      />
    </>
  );
};
