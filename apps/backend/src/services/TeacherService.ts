import { TeacherDao } from '../dao/TeacherDao';
import { LevelEnum, Prisma, SubjectEnum, Teacher } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/config';
import EmailUtility from './EmailUtility';
import { WhitelistService } from './WhitelistService';
import { assert } from 'console';

export class TeacherService {
  constructor(
    private teacherDao: TeacherDao = new TeacherDao(),
    private whitelistService: WhitelistService = new WhitelistService(),
  ) {}

  public async createTeacher(
    teacherData: Prisma.TeacherUncheckedCreateInput,
  ): Promise<Teacher> {
    // Check if the email is whitelisted
    const isWhitelisted = await this.whitelistService.isEmailWhitelisted(
      teacherData.email,
      'TEACHER',
    );

    if (!isWhitelisted) {
      throw new Error('Unable to create student as email is not whitelisted!');
    }

    const teacherWhitelistItem =
      await this.whitelistService.getWhitelistByEmail(teacherData.email);
    assert(teacherWhitelistItem !== null);

    teacherData.password = await bcrypt.hash(teacherData.password, 10);
    return this.teacherDao.createTeacher({
      ...teacherData,
      whitelistItemId: teacherWhitelistItem.id,
    });
  }

  public async getAllTeachers(): Promise<Teacher[]> {
    return this.teacherDao.getAllTeachers();
  }

  // public async getTeacherById(teacherId: string): Promise<Teacher | null> {
  //   return this.teacherDao.getTeacherById(teacherId);
  // }

  public async getTeacherByEmail(
    teacherEmail: string,
  ): Promise<Teacher | null> {
    return this.teacherDao.getTeacherByEmail(teacherEmail);
  }

  public async getTeachersByCentre(centreId: string): Promise<Teacher[]> {
    return this.teacherDao.getTeachersByCentre(centreId);
  }

  public async getTeachersBySubject(subject: SubjectEnum): Promise<Teacher[]> {
    return this.teacherDao.getTeachersBySubject(subject);
  }

  public async getTeachersByLevel(level: LevelEnum): Promise<Teacher[]> {
    return this.teacherDao.getTeachersByLevel(level);
  }

  public async updateTeacher(
    teacherId: string,
    teacherData: Prisma.TeacherUpdateInput,
  ): Promise<Teacher | null> {
    if (teacherData.password) {
      teacherData.password = await bcrypt.hash(teacherData.password, 10);
    }
    return this.teacherDao.updateTeacher(teacherId, teacherData);
  }

  public async deleteTeacher(teacherId: string): Promise<Teacher | null> {
    return this.teacherDao.deleteTeacher(teacherId);
  }

  async login(teacherEmail: string, teacherPassword: string) {
    const teacher = await this.teacherDao.getTeacherByEmail(teacherEmail);
    if (
      !teacher ||
      !(await bcrypt.compare(teacherPassword, teacher.password))
    ) {
      throw new Error('Invalid credentials');
    }

    // Generate a JWT token with necessary teacher details
    const token = jwt.sign(
      {
        id: teacher.id,
        email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        levels: teacher.levels,
        subjects: teacher.subjects,
        centre: teacher.centre,
      },
      JWT_SECRET_KEY,
      { expiresIn: '4h' },
    );

    // Destructure teacher object to omit id, password, and type
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, centreId, ...user } = teacher;

    return { token, user };
  }

  async requestPasswordReset(email: string) {
    const teacher = await this.teacherDao.getTeacherByEmail(email);
    if (!teacher) {
      throw new Error(`Teacher not found for email: ${email}`);
    }

    // Create a short-lived JWT for password reset
    const resetToken = jwt.sign(
      { id: teacher.id, action: 'password_reset' },
      JWT_SECRET_KEY,
      { expiresIn: '15m' }, // Token expires in 15 minutes
    );

    // Send email with the reset link containing the token
    const resetLink = `http://localhost:3002/reset-password?token=${resetToken}`;
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

    const teacher = await this.teacherDao.getTeacherById(decodedToken.id);

    if (!teacher) {
      throw new Error(`Teacher not found`);
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.teacherDao.updateTeacher(teacher.id, {
      password: hashedPassword,
    });
  }
}
