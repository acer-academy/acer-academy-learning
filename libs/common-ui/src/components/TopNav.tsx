import { Button, Menu, MenuProps, Row } from 'antd';
import React from 'react';
import styles from './TopNav.module.scss';
import {
  PrimaryLayoutTypeEnum,
  StudentTopNavEnum,
  TeacherTopNavEnum,
  useGetAccountMenuItem,
} from '../lib/layout/utils';
import { QuestionCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { useMenuItemsContext } from '../lib/layout/context';
import { useGetPrimaryTopNavMenuItems } from '../lib/hooks/layouts/useGetPrimaryTopNavMenuItems';

export type TopNavProps = {
  type: PrimaryLayoutTypeEnum;
  name: string;
  imageUrl?: string;
};

export const TopNav = ({ name, imageUrl, type }: TopNavProps) => {
  const { setActiveTab } = useMenuItemsContext();
  const accountMenuItem = useGetAccountMenuItem(name, imageUrl);
  const topNavSubMenuItems = useGetPrimaryTopNavMenuItems(type);

  // Handlers
  const handleOnSelect: MenuProps['onSelect'] = (info) => {
    const key =
      info.key in StudentTopNavEnum
        ? (info.key as StudentTopNavEnum)
        : (info.key as unknown as TeacherTopNavEnum);
    setActiveTab(key);
  };
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
            items={accountMenuItem}
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
        className={styles.topNavMain}
        theme="dark"
        mode="horizontal"
        items={topNavSubMenuItems}
        onSelect={handleOnSelect}
      />
    </>
  );
};
