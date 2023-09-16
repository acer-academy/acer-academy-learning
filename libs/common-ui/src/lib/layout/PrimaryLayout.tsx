import React, { PropsWithChildren, useMemo, useState } from 'react';
// Components
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { TopNav } from '../../components/TopNav';

// Utils
import { MenuItemsContext } from './context';

// Constants/Types
import styles from './PrimaryLayout.module.scss';
import {
  PrimaryLayoutTypeEnum,
  StudentTopNavEnum,
  TeacherTopNavEnum,
  getPrimaryLayoutSideBarMenuItems,
} from './utils';

const { Header, Content, Sider } = Layout;

export type PrimaryLayoutProps = {
  type: PrimaryLayoutTypeEnum;
} & PropsWithChildren;

export const PrimaryLayout = ({ children, type }: PrimaryLayoutProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // States
  const [activeTab, setActiveTab] = useState<
    StudentTopNavEnum | TeacherTopNavEnum | undefined
  >(undefined);
  const sideBarMenuItems = useMemo(
    () => (activeTab ? getPrimaryLayoutSideBarMenuItems(activeTab) : undefined),
    [activeTab],
  );

  return (
    <Layout className={styles.primaryLayoutContainer}>
      <MenuItemsContext.Provider value={{ activeTab, setActiveTab }}>
        <Header className={styles.primaryHeader}>
          <TopNav name={'John Apple Seed'} type={type} />
        </Header>
      </MenuItemsContext.Provider>
      <Layout>
        <Sider collapsible width={200} style={{ background: colorBgContainer }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            className={styles.sideMenu}
            items={sideBarMenuItems}
          />
        </Sider>
        <Layout className={styles.mainLayout}>
          <Breadcrumb className={styles.breadCrumb}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content className={styles.mainContent}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
