import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface AuthContextProps<UserType> {
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps<any> | undefined>(undefined);

interface AuthWrapperProps<UserType> {
  children: ReactNode;
  loginApi: (credentials: {
    email: string;
    password: string;
  }) => Promise<UserType>;
  logoutApi: () => Promise<void>;
  fetchUserApi: () => Promise<UserType>;
}

export function AuthWrapper<UserType>({
  children,
  loginApi,
  logoutApi,
  fetchUserApi,
}: AuthWrapperProps<UserType>): JSX.Element {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi({ email, password });
      setUser(response);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await fetchUserApi();
        setUser(userInfo);
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [fetchUserApi]);

  return (
    <AuthContext.Provider value={{ isLoading, user, login, logout }}>
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
