import { Prisma, Take } from '@prisma/client';
import { TakeDao } from '../dao/TakeDao';

export class TakeService {
  constructor(private takeDao: TakeDao = new TakeDao()) {}

  public async createTake(takeData: Prisma.TakeCreateInput): Promise<Take> {
    return this.takeDao.createTake(takeData);
  }

  public async getAllTakes(): Promise<Take[]> {
    return this.takeDao.getAllTakes();
  }

  public async getTakeById(takeId: string): Promise<Take | null> {
    return this.takeDao.getTakeById(takeId);
  }

  public async getTakesByStudent(studentId: string): Promise<Take[]> {
    return this.takeDao.getTakesByStudent(studentId);
  }

  public async updateTake(
    takeId: string,
    takeData: Prisma.TakeUpdateInput,
  ): Promise<Take | null> {
    return this.takeDao.updateTake(takeId, takeData);
  }

  public async deleteTake(takeId: string): Promise<Take | null> {
    return this.takeDao.deleteTake(takeId);
  }
}
