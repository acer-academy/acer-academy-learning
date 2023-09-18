export enum AdminType {
    STANDARD_ADMIN = 'STANDARD_ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
  }
  
  export interface AdminPostData {
    name: string;
    email: string;
    password: string;
    type: AdminType;
  }
  
  export interface AdminPutData {
    name?: string;
    email?: string;
    password?: string;
    type?: AdminType;
  }
  
  export interface AdminGetData {
    email: string;
    password: string;
  }
  