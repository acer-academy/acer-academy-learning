import { PropsWithChildren, useState } from 'react';
// Components
import { Breadcrumb, Layout } from 'antd';

// Utils
import { MenuItemsContext } from './context';

// Constants/Types
import styles from './PrimaryLayout.module.scss';
import { PrimaryLayoutTypeEnum } from './constants';
import { TopNav } from '../components/TopNav';
import { MenuTree } from '../types';

const { Header, Content } = Layout;

export type PrimaryLayoutProps = {
  type: PrimaryLayoutTypeEnum;
  sider?: React.ReactNode;
  menuTree: MenuTree;
} & PropsWithChildren;

export const PrimaryLayout = ({
  children,
  type,
  sider,
  menuTree,
}: PrimaryLayoutProps) => {
  return (
    <Layout className={styles.primaryLayoutContainer}>
      <MenuItemsContext.Provider value={{ menuTree }}>
        <Header className={styles.primaryHeader}>
          <TopNav name={'John Apple Seed'} type={type} />
        </Header>
      </MenuItemsContext.Provider>
      <Layout>
        {sider}
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
