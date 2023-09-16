import { Student } from '@prisma/client';
import StudentDao from '../dao/StudentDao';
import { StudentPostData } from 'libs/data-access/src/lib/types/student';

class StudentService {
  public async createStudent(input: StudentPostData): Promise<Student> {
    return StudentDao.createStudent(input);
  }

  public async getAllStudents(): Promise<Student[]> {
    return StudentDao.getAllStudents();
  }
}

export default new StudentService();
