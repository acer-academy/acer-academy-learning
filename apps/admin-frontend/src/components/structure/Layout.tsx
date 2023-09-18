import { Layout } from 'antd';
import { RenderMenu, RenderRoutes } from './RenderNavigation';

const { Content, Sider } = Layout;

const LayoutComponent: React.FC = () => {

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ background: '#fff' }}>
        <RenderMenu />
      </Sider>
      <Content style={{ padding: '0 50px', backgroundColor: '#f0f2f5' }}>
        <RenderRoutes />
      </Content>
    </Layout>
  );
};

export default LayoutComponent;
