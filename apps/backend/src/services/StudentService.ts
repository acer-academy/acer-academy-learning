import { Student } from '@prisma/client';
import StudentDao from '../dao/StudentDao';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/config';

class StudentService {
  public async createStudent(
    input: Prisma.StudentCreateInput,
  ): Promise<Student> {
    input.password = await bcrypt.hash(input.password, 10);
    return StudentDao.createStudent(input);
  }

  public async getAllStudents(): Promise<Student[]> {
    return StudentDao.getAllStudents();
  }

  public async getStuentById(id: string): Promise<Student> {
    return StudentDao.getStudentById(id);
  }

  public async updateStudent(
    id: string,
    input: Prisma.StudentUpdateInput,
  ): Promise<Student> {
    return StudentDao.updateStudent(id, input);
  }

  public async deleteStudent(id: string): Promise<Student> {
    return StudentDao.deleteStudent(id);
  }

  async login(studentEmail: string, studentPassword: string) {
    const student = await StudentDao.getStudentByEmail(studentEmail);
    if (
      !student ||
      !(await bcrypt.compare(studentPassword, student.password))
    ) {
      throw new Error('Invalid credentials');
    }

    // Generate a JWT token with necessary student details
    const token = jwt.sign(
      {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        level: student.level,
        subjects: student.subjects,
        status: student.status,
        school: student.school,
        phoneNumber: student.phoneNumber,
        parents: student.parents,
        centre: student.centre,
      },
      JWT_SECRET_KEY,
      { expiresIn: '4h' },
    );

    // Destructure admin object to omit id, password, and type
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, centreId, ...user } = student;

    return { token, user };
  }
}

export default new StudentService();
