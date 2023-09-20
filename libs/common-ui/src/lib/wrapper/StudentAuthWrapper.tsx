import React, { ReactNode } from 'react';
import { AuthWrapper } from './AuthContext';
import {
  loginStudent,
  defaultStudent,
} from '@acer-academy-learning/data-access';

interface StudentAuthWrapperProps {
  children: ReactNode;
}

export const StudentAuthWrapper: React.FC<StudentAuthWrapperProps> = ({
  children,
}) => (
  <AuthWrapper defaultUser={defaultStudent} loginApi={loginStudent}>
    {children}
  </AuthWrapper>
);
