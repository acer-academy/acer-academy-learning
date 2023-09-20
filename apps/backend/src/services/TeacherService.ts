import { TeacherDao } from '../dao/TeacherDao';
import { LevelEnum, Prisma, SubjectEnum, Teacher } from '@prisma/client';
import bcrypt from 'bcrypt';

export class TeacherService {
  constructor(private teacherDao: TeacherDao = new TeacherDao()) {}

  public async createTeacher(
    teacherData: Prisma.TeacherCreateInput,
  ): Promise<Teacher> {
    teacherData.password = await bcrypt.hash(teacherData.password, 10);
    return this.teacherDao.createTeacher(teacherData);
  }

  public async getAllTeachers(): Promise<Teacher[]> {
    return this.teacherDao.getAllTeachers();
  }

  public async getTeacherById(teacherId: string): Promise<Teacher | null> {
    return this.teacherDao.getTeacherById(teacherId);
  }

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

    // Destructure admin object to omit id, password, and type
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, password, centreId, ...rest } = teacher;

    return rest;
  }
}
