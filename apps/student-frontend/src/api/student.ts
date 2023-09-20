import axios from 'axios';

const baseURL = 'http://localhost:8000/api/v1/students';

enum LevelEnum {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
  P5 = 'P5',
  P6 = 'P6',
  S1 = 'S1',
  S2 = 'S2',
  S3 = 'S3',
  S4 = 'S4',
  S5 = 'S5',
  J1 = 'J1',
  J2 = 'J2',
}

enum SubjectEnum {
  MATHEMATICS = 'MATHEMATICS',
  ENGLISH = 'ENGLISH',
  SCIENCE = 'SCIENCE',
}

interface RegisterStudentData {
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

interface LoginStudentData {
  email: string;
  password: string;
}

interface UpdateStudentData {
  firstName?: string;
  lastName?: string;
  password?: string;
}

export const registerStudent = async (
  data: RegisterStudentData,
): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(`${baseURL}/create`, data);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(response.data);
    }
  } catch (error: any) {
    throw new Error(`${error.response.data.error}`);
  }
};

export const loginStudent = async (data: LoginStudentData): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(`${baseURL}/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStudent = async (
  email: string,
  data: UpdateStudentData,
): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.put(`${baseURL}/update/${email}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStudent = async (email: string): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.delete(`${baseURL}/delete/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
