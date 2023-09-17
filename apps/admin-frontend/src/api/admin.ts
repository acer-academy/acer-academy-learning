import axios from 'axios';

const baseURL = 'http://localhost:8000/api/v1/admins';

interface RegisterAdminData {
  name: string;
  email: string;
  password: string;
  type?: 'STANDARD_ADMIN' | 'SUPER_ADMIN';
}

interface LoginAdminData {
  email: string;
  password: string;
}

interface UpdateAdminData {
  name?: string;
  email?: string;
  password?: string;
  type?: 'STANDARD_ADMIN' | 'SUPER_ADMIN';
}

export const registerAdmin = async (data: RegisterAdminData): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(`${baseURL}/register`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginAdmin = async (data: LoginAdminData): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    
    const response = await axios.post(`${baseURL}/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdmin = async (
  email: string,
  data: UpdateAdminData,
): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.put(`${baseURL}/update/${email}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdmin = async (email: string): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.delete(`${baseURL}/delete/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
