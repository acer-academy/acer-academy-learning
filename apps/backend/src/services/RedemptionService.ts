import { Prisma, Redemption } from '@prisma/client';
import { RedemptionDao } from '../dao/RedemptionDao';

export class RedemptionService {
  constructor(private redemptionDao: RedemptionDao = new RedemptionDao()) {}

  public async createRedemption(
    redemptionData: Prisma.RedemptionUncheckedCreateInput,
  ): Promise<Redemption> {
    return this.redemptionDao.createRedemption(redemptionData);
  }

  public async getAllRedemptions(): Promise<Redemption[]> {
    return this.redemptionDao.getAllRedemptions();
  }

  public async getRedemptionById(redemptionId: string): Promise<Redemption> {
    return this.redemptionDao.getRedemptionById(redemptionId);
  }

  public async markRedemptionAsRedeemed(
    redemptionId: string,
  ): Promise<Redemption> {
    return this.redemptionDao.markRedemptionAsRedeemed(redemptionId);
  }

  public async getAllRedemptionsByStudentId(
    studentId: string,
  ): Promise<Redemption[]> {
    return this.redemptionDao.getAllRedemptionsByStudentId(studentId);
  }
}
