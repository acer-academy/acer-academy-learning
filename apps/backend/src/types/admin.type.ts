  export interface RegisterAdminData {
    name: string;
    email: string;
    password: string;
    type: 'STANDARD_ADMIN' | 'SUPER_ADMIN';
  }

  export interface UpdateAdminData {
    name?: string;
    email?: string;
    password?: string;
    type?: 'STANDARD_ADMIN' | 'SUPER_ADMIN';
  }
  
  export interface LoginAdminData {
    email: string;
    password: string;
  }
  