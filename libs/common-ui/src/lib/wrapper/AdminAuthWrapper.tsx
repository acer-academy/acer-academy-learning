import React, { ReactNode } from 'react';
import { AuthWrapper } from './AuthContext';
import { loginAdmin, defaultAdmin } from '@acer-academy-learning/data-access';

interface AdminAuthWrapperProps {
  children: ReactNode;
}

export const AdminAuthWrapper: React.FC<AdminAuthWrapperProps> = ({
  children,
}) => (
  <AuthWrapper defaultUser={defaultAdmin} loginApi={loginAdmin}>
    {children}
  </AuthWrapper>
);
