import React, { ReactNode } from 'react';
import { AuthWrapper } from './AuthContext';
import {
  loginAdmin,
  fetchAdmin,
  logoutAdmin,
} from '@acer-academy-learning/data-access';

interface AdminAuthWrapperProps {
  children: ReactNode;
}

export const AdminAuthWrapper: React.FC<AdminAuthWrapperProps> = ({
  children,
}) => (
  <AuthWrapper
    loginApi={loginAdmin}
    logoutApi={logoutAdmin}
    fetchUserApi={fetchAdmin}
  >
    {children}
  </AuthWrapper>
);
