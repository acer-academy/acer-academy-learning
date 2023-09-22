export enum AdminType {
  STANDARD_ADMIN = 'STANDARD_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface AdminPostData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AdminPutData {
  firstName?: string;
  lastName?: string;
}

export interface AdminGetData {
  email: string;
  password: string;
}

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: AdminType;
  isAuthenticated: boolean;
}
