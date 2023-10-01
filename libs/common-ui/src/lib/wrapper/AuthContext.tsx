/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import { Student, Teacher, Admin } from '@prisma/client';

type UserData = Student | Teacher | Admin;

interface AuthContextProps<UserData> {
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserData) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps<any> | undefined>(undefined);

interface AuthWrapperProps<UserData> {
  children: ReactNode;
  loginApi: (credentials: {
    email: string;
    password: string;
  }) => Promise<UserData>;
  logoutApi: () => Promise<AxiosResponse<any>>;
  fetchUserApi: () => Promise<UserData>;
}

export function AuthWrapper<UserData>({
  children,
  loginApi,
  logoutApi,
  fetchUserApi,
}: AuthWrapperProps<UserData>): JSX.Element {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi({ email, password });
      const { data } = response;
      setUser(data);
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

  const updateUser = (updatedUser: UserData) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await fetchUserApi();
        console.log(userInfo);
        const { data } = userInfo;
        const user: UserData = data;
        setUser(user);
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [fetchUserApi]);

  return (
    <AuthContext.Provider
      value={{ isLoading, user, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth<UserData>(): AuthContextProps<UserData> {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthWrapper');
  }
  return context as AuthContextProps<UserData>;
}
