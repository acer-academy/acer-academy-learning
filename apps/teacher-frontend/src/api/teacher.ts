import axios from 'axios';

const baseURL = 'http://localhost:8000/api/v1/teachers';

enum LevelEnum {
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  S1,
  S2,
  S3,
  S4,
  S5,
  J1,
  J2,
}

enum SubjectEnum {
  MATHEMATICS,
  ENGLISH,
  SCIENCE,
}

interface RegisterTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  levels:    LevelEnum[]
  subjects:  SubjectEnum[]
}

interface LoginTeacherData {
  email: string;
  password: string;
}

interface UpdateTeacherData {
  firstName?: string;
  lastName?: string;
  password?: string;
}

export const registerTeacher = async (data: RegisterTeacherData): Promise<any> => {
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

export const loginTeacher = async (data: LoginTeacherData): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    
    const response = await axios.post(`${baseURL}/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTeacher = async (
  email: string,
  data: UpdateTeacherData,
): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.put(`${baseURL}/update/${email}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTeacher = async (email: string): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.delete(`${baseURL}/delete/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
