import { createContext, useContext, useState, ReactNode } from 'react';
import { loginAdmin } from '../api/admin';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  type: AdminType;
  isAuthenticated: boolean;
}

enum AdminType {
  SUPER_ADMIN = 'super',
  STANDARD_ADMIN = 'standard',
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
  firstName: '',
  lastName: '',
  type: AdminType.STANDARD_ADMIN,
  email: '',
  isAuthenticated: false,
};

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState(defaultUser);

  console.log(user);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginAdmin({ email, password });
      console.log(response);
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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
