import { Prisma, PrismaClient, Redemption } from '@prisma/client';

export class RedemptionDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createRedemption(
    redemptionData: Prisma.RedemptionUncheckedCreateInput,
  ): Promise<Redemption> {
    return this.prismaClient.redemption.create({
      data: redemptionData,
    });
  }

  public async getAllRedemptions(): Promise<Redemption[]> {
    return this.prismaClient.redemption.findMany({
      include: { student: true, reward: true },
    });
  }

  public async getRedemptionById(
    redemptionId: string,
  ): Promise<Redemption | null> {
    return this.prismaClient.redemption.findUnique({
      where: { id: redemptionId },
      include: { student: true, reward: true },
    });
  }

  public async getAllRedemptionsByStudentId(
    studentId: string,
  ): Promise<Redemption[]> {
    return this.prismaClient.redemption.findMany({
      where: { studentId },
      include: { student: true, reward: true },
    });
  }

  public async markRedemptionAsRedeemed(
    redemptionId: string,
  ): Promise<Redemption | null> {
    return this.prismaClient.redemption.update({
      where: { id: redemptionId },
      data: {
        isRedeemed: true,
      },
      include: { student: true, reward: true },
    });
  }
}
