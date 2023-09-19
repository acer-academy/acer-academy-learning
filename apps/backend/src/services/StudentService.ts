import { Student } from '@prisma/client';
import StudentDao from '../dao/StudentDao';
// import { StudentPostData } from 'libs/data-access/src/lib/types/student';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

class StudentService {

  public async createStudent(input: Prisma.StudentCreateInput): Promise<Student> {
    input.password = await bcrypt.hash(input.password, 10);
    return StudentDao.createStudent(input);
  }

  public async getAllStudents(): Promise<Student[]> {
    return StudentDao.getAllStudents();
  }

  async login(studentEmail: string, studentPassword: string) {
    const student = await StudentDao.getStudentByEmail(studentEmail);
    if (!student || !(await bcrypt.compare(studentPassword, student.password))) {
      throw new Error('Invalid credentials');
    }

    // Destructure admin object to omit id, password, and type
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, password, ...rest } = student;

    return rest;
  }
}

export default new StudentService();
