import { createContext, useContext, useState, ReactNode } from 'react';
import {
  RenderMenu,
  RenderRoutes,
} from '../components/structure/RenderNavigation';
import { Box, Flex } from '@chakra-ui/react';
import { loginAdmin } from '../api/admin';

interface AuthContextProps {
  user: {
    name: string;
    email: string;
    isAuthenticated: boolean;
  };
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthData = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('AuthData must be used within an AuthWrapper');
  }
  return context;
};

interface AuthWrapperProps {
  children?: ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    isAuthenticated: false,
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await loginAdmin({ email, password });
      setUser({
        name: response.name,
        email: response.email,
        isAuthenticated: true,
      });
      console.log(response); // Assuming the API responds with success
      //   return 'success';  // You might want to return something more meaningful here, based on the API response
    } catch (error) {
      console.error('Login failed', error);
      throw error; // You might want to handle this error in a user-friendly way
    }
  };

  const logout = () => {
    setUser({ ...user, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {/* <RenderHeader /> */}
      <Flex height="100vh">
        <RenderMenu />
        <Box flex="1" backgroundColor="gray.50" p="5">
          <RenderRoutes />
          {children}
        </Box>
      </Flex>
    </AuthContext.Provider>
  );
};
