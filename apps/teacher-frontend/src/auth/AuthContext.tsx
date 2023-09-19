import { createContext, useContext, useState, ReactNode } from 'react';
import { loginTeacher } from '../api/teacher';

export interface Centre {
  id: string;
  name: string;
  address: string;
  teachers?: User[]; // This field is optional because a centre might not have teachers initially
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  levels: LevelEnum[];
  subjects: SubjectEnum[];
  centre?: Centre;
  isAuthenticated: boolean;
}

enum LevelEnum {
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  S1,
  S2,
  S3,
  S4,
  S5,
  J1,
  J2,
}

enum SubjectEnum {
  MATHEMATICS,
  ENGLISH,
  SCIENCE,
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
  email: '',
  levels: [],
  subjects: [],
  isAuthenticated: false,
};

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState(defaultUser);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginTeacher({ email, password });
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
