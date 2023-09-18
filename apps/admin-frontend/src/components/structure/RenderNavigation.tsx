import React from 'react';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { nav, RouteItem } from './navigation';
import { Menu, Button } from 'antd';

export const RenderRoutes: React.FC = () => {
  const { user } = useAuth(); // Adjusted usage


  return (
    <Routes>
      {nav.map((r, i) => {
        const Element = r.element;
        if (r.isPrivate && user.isAuthenticated) {
          return <Route key={i} path={r.path} element={<Element />} />;
        } else if (!r.isPrivate) {
          return <Route key={i} path={r.path} element={<Element />} />;
        } else return null;
      })}
    </Routes>
  );
};

export const RenderMenu: React.FC = () => {
  const { user, logout } = useAuth(); // Adjusted usage

  const MenuItem: React.FC<{ r: RouteItem }> = ({ r }) => {
    return (
      <Menu.Item>
        <RouterLink to={r.path}>{r.name}</RouterLink>
      </Menu.Item>
    );
  };

  return (
    <Menu
      mode="vertical"
      theme="dark"
      style={{
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
      }}
    >
      {nav.map((r) => {
        if ((!r.isPrivate && r.isMenu) || (user.isAuthenticated && r.isMenu)) {
          return <MenuItem key={r.path} r={r} />;
        } else return null;
      })}

      {user.isAuthenticated ? (
        <Menu.Item key="logout">
          <RouterLink to="login" onClick={logout}>
            Log out
          </RouterLink>
        </Menu.Item>
      ) : (
        <Menu.Item key="login">
          <RouterLink to="login">Log in</RouterLink>
        </Menu.Item>
      )}
    </Menu>
  );
};
