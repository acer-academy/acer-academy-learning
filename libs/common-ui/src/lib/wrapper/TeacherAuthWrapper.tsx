import React, { ReactNode } from 'react';
import { AuthWrapper } from './AuthContext';
import {
  loginTeacher,
  defaultTeacher,
} from '@acer-academy-learning/data-access';

interface TeacherAuthWrapperProps {
  children: ReactNode;
}

export const TeacherAuthWrapper: React.FC<TeacherAuthWrapperProps> = ({
  children,
}) => (
  <AuthWrapper defaultUser={defaultTeacher} loginApi={loginTeacher}>
    {children}
  </AuthWrapper>
);
