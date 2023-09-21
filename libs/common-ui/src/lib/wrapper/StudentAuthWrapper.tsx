import React, { ReactNode } from 'react';
import { AuthWrapper } from './AuthContext';
import {
  loginStudent,
  logoutStudent,
  fetchStudent,
} from '@acer-academy-learning/data-access';

interface StudentAuthWrapperProps {
  children: ReactNode;
}

export const StudentAuthWrapper: React.FC<StudentAuthWrapperProps> = ({
  children,
}) => (
  <AuthWrapper
    loginApi={loginStudent}
    logoutApi={logoutStudent}
    fetchUserApi={fetchStudent}
  >
    {children}
  </AuthWrapper>
);
