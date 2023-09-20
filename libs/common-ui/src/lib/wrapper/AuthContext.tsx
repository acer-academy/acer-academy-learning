import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps<UserType> {
  user: UserType;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps<any> | undefined>(undefined);

interface AuthWrapperProps<UserType> {
  children: ReactNode;
  defaultUser: UserType;
  loginApi: (credentials: {
    email: string;
    password: string;
  }) => Promise<UserType>;
}

export function AuthWrapper<UserType>({
  children,
  defaultUser,
  loginApi,
}: AuthWrapperProps<UserType>): JSX.Element {
  const [user, setUser] = useState(defaultUser);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi({ email, password });
      setUser({ ...response, isAuthenticated: true });
    } catch (error) {
      console.error('Login failed', error);
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
}

export function useAuth<UserType>(): AuthContextProps<UserType> {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthWrapper');
  }
  return context as AuthContextProps<UserType>;
}
