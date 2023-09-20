import { ClassroomDao } from '../dao/ClassroomDao';
import { Classroom, Prisma } from '@prisma/client';

export class ClassroomService {
  constructor(private classroomDao: ClassroomDao = new ClassroomDao()) {}

  public async createClassroom(
    classroomData: Prisma.ClassroomCreateInput,
  ): Promise<Classroom | null> {
    return this.classroomDao.createClassroom(classroomData);
  }

  public async getAllClassrooms(): Promise<Classroom[]> {
    return this.classroomDao.getAllClassrooms();
  }

  public async getClassroomById(
    classroomId: string,
  ): Promise<Classroom | null> {
    return this.classroomDao.getClassroomById(classroomId);
  }

  public async updateClassroom(
    classroomId: string,
    classroomData: Prisma.ClassroomUpdateInput,
  ): Promise<Classroom | null> {
    return this.classroomDao.updateClassroom(classroomId, classroomData);
  }

  public async deleteClassroom(classroomId: string): Promise<Classroom | null> {
    return this.classroomDao.deleteClassroom(classroomId);
  }

  public async getClassroomByCentre(centreId: string): Promise<Classroom[]> {
    return this.classroomDao.getClassroomsByCentre(centreId);
  }
}
