import axios from 'axios';

const baseURL = 'http://localhost:8000/api/v1/admins';

interface RegisterAdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginAdminData {
  email: string;
  password: string;
}

interface UpdateAdminData {
  firstName?: string;
  lastName?: string;
  password?: string;
}

export const registerAdmin = async (data: RegisterAdminData): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(`${baseURL}/register`, data);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error('Received unsuccessful status code');
    }
  } catch (error: any) {
    throw new Error(`An error occurred: ${error.message}`);
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
