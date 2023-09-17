import React from 'react';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import { AuthData } from '../../auth/AuthWrapper';
import { nav, RouteItem } from './navigation';
import { VStack, Button } from '@chakra-ui/react';

export const RenderRoutes: React.FC = () => {
  const { user } = AuthData();

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
  const { user, logout } = AuthData();

  const MenuItem: React.FC<{ r: RouteItem }> = ({ r }) => {
    return (
      <Button
        as={RouterLink}
        to={r.path}
        variant="ghost"
        width="full"
        justifyContent="flex-start"
        _hover={{ bg: 'gray.700' }}
        color="gray.100"
      >
        {r.name}
      </Button>
    );
  };

  return (
    <VStack
      align="start"
      spacing={4}
      className="menu"
      bg="gray.800"
      padding="5"
      borderRadius="md"
      boxShadow="md"
    >
      {nav.map((r, i) => {
        if (!r.isPrivate && r.isMenu) {
          return <MenuItem key={i} r={r} />;
        } else if (user.isAuthenticated && r.isMenu) {
          return <MenuItem key={i} r={r} />;
        } else return null;
      })}

      {user.isAuthenticated ? (
        <Button
          as={RouterLink}
          to="login"
          variant="ghost"
          width="full"
          justifyContent="flex-start"
          onClick={logout}
          _hover={{ bg: 'gray.700' }}
          color="gray.100"
        >
          Log out
        </Button>
      ) : (
        <Button
          as={RouterLink}
          to="login"
          variant="ghost"
          width="full"
          justifyContent="flex-start"
          _hover={{ bg: 'gray.700' }}
          color="gray.100"
        >
          Log in
        </Button>
      )}
    </VStack>
  );
};
