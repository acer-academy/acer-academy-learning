import { createContext, useContext, useState, ReactNode } from 'react';
import { loginAdmin } from '../api/admin';

interface User {
  name: string;
  email: string;
  isAuthenticated: boolean;
}

interface AuthContextProps {
  user: User;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthWrapper');
  }
  return context;
};

const defaultUser: User = {
  name: '',
  email: '',
  isAuthenticated: false,
};

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState(defaultUser);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginAdmin({ email, password });
      setUser({
        ...response,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login failed', error);
      // Optionally, provide user feedback here
      throw error;
    }
  };

  const logout = () => {
    setUser(defaultUser);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
