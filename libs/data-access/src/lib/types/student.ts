import { LevelEnum, SubjectEnum } from './CommonTypes';
import { Teacher } from './teacher';
// import { Centre } from './CommonTypes';

export interface Centre {
  id: string;
  name: string;
  address: string;
  students?: Student[];
  teachers?: Teacher[];
}

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}
export interface StudentPostData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: LevelEnum;
  subjects: SubjectEnum[];
  school: string;
  phoneNumber: string;
  centreId: string;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  status: StudentStatus;
}

export interface NotificationPreference {
  id: string;
  isUnsubscribed: boolean;
  subjectsPref: SubjectEnum[];
  levelsPref: LevelEnum[];
  teacherPref: string[];
  centrePref: string[];
}

export interface NotificationPreferenceUpdateData {
  isUnsubscribed?: boolean;
  subjectsPref?: SubjectEnum[];
  levelsPref?: LevelEnum[];
  teacherPref?: string[];
  centrePref?: string[];
}
export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: StudentStatus;
  school: string;
  level: LevelEnum[];
  subjects: SubjectEnum[];
  centre?: Centre;
  parents: Parent[];
  isAuthenticated: boolean;
  notificationPreference: NotificationPreference;
}

export interface UpdateStudentData {
  firstName?: string;
  lastName?: string;
  password?: string;
}

export type UpdateParentData = {
  firstName?: string;
  lastName?: string;
  password?: string;
};
