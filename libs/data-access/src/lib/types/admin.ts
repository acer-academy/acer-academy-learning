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
    password?: string;
  }
  
  export interface AdminGetData {
    email: string;
    password: string;
  }
  