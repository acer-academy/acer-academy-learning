import { Student } from '@prisma/client';
import StudentDao from '../dao/StudentDao';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/config';
import EmailUtility from './EmailUtility';
import { WhitelistService } from './WhitelistService';

class StudentService {
  constructor(
    private whitelistService: WhitelistService = new WhitelistService(),
  ) {}

  public async createStudent(
    input: Prisma.StudentUncheckedCreateInput,
  ): Promise<Student> {
    // Check if the email is whitelisted
    const isWhitelisted = await this.whitelistService.isEmailWhitelisted(
      input.email,
      'STUDENT',
    );

    if (!isWhitelisted) {
      throw new Error('Unable to create student as email is not whitelisted!');
    }

    const whitelistItem = await this.whitelistService.getWhitelistByEmail(
      input.email,
    );

    input.password = await bcrypt.hash(input.password, 10);
    return StudentDao.createStudent({
      ...input,
      whitelistItemId: whitelistItem.id,
      notificationPreference: {
        create: {
          isUnsubscribed: false,
          subjectsPref: input.subjects,
          levelsPref: [input.level],
          teacherPref: [],
          centrePref: [],
        },
      },
    });
  }

  public async getAllStudents(): Promise<Student[]> {
    return StudentDao.getAllStudents();
  }

  public async getStudentById(id: string) {
    return StudentDao.getStudentById(id);
  }

  public async updateStudent(
    id: string,
    input: Prisma.StudentUpdateInput,
  ): Promise<Student> {
    if (input.password) {
      input.password = await bcrypt.hash(input.password, 10);
    }
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
        // firstName: student.firstName,
        // lastName: student.lastName,
        // email: student.email,
        // level: student.level,
        // subjects: student.subjects,
        // status: student.status,
        // school: student.school,
        // phoneNumber: student.phoneNumber,
        // parents: student.parents,
        // centre: student.centre,
      },
      JWT_SECRET_KEY,
      { expiresIn: '4h' },
    );

    // Destructure student object to omit id, password, and type
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, centreId, ...user } = student;

    return { token, user };
  }

  async requestPasswordReset(email: string) {
    const student = await StudentDao.getStudentByEmail(email);
    if (!student) {
      throw new Error(`Student not found for email: ${email}`);
    }

    // Create a short-lived JWT for password reset
    const resetToken = jwt.sign(
      { id: student.id, action: 'password_reset' },
      JWT_SECRET_KEY,
      { expiresIn: '15m' }, // Token expires in 15 minutes
    );

    // Send email with the reset link containing the token
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    EmailUtility.sendPasswordResetEmail(email, resetLink); // Your email sending method
  }

  async resetPassword(token: string, newPassword: string) {
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }

    if (decodedToken.action !== 'password_reset') {
      throw new Error('Invalid reset token');
    }

    const student = await StudentDao.getStudentById(decodedToken.id);

    if (!student) {
      throw new Error(`Student not found`);
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await StudentDao.updateStudent(student.id, { password: hashedPassword });
  }

  public async updateParent(id: string, input: Prisma.ParentUpdateInput) {
    return StudentDao.updateParent(id, input);
  }
}

export default new StudentService();
