import React, { ReactNode } from 'react';
import { AuthWrapper } from './AuthContext';
import {
  loginTeacher,
  logoutTeacher,
  fetchTeacher,
} from '@acer-academy-learning/data-access';

interface TeacherAuthWrapperProps {
  children: ReactNode;
}

export const TeacherAuthWrapper: React.FC<TeacherAuthWrapperProps> = ({
  children,
}) => (
  <AuthWrapper
    loginApi={loginTeacher}
    logoutApi={logoutTeacher}
    fetchUserApi={fetchTeacher}
  >
    {children}
  </AuthWrapper>
);
