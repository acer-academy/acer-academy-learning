import { Prisma, PrismaClient, Reward } from '@prisma/client';

export class RewardDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createReward(
    rewardData: Prisma.RewardCreateInput,
  ): Promise<Reward> {
    return this.prismaClient.reward.create({
      data: rewardData,
    });
  }

  public async getAllRewards(): Promise<Reward[]> {
    return this.prismaClient.reward.findMany();
  }

  public async getActiveRewards(): Promise<Reward[]> {
    return this.prismaClient.reward.findMany({
      where: {
        isActive: true,
      },
    });
  }

  public async getRewardById(rewardId: string): Promise<Reward | null> {
    return this.prismaClient.reward.findUnique({
      where: { id: rewardId },
    });
  }

  public async updateReward(
    rewardId: string,
    rewardData: Prisma.RewardUpdateInput,
  ): Promise<Reward | null> {
    return this.prismaClient.reward.update({
      where: { id: rewardId },
      data: rewardData,
    });
  }

  // soft delete
  public async deleteReward(rewardId: string): Promise<Reward | null> {
    return this.prismaClient.reward.update({
      where: { id: rewardId },
      data: {
        isActive: false,
      },
    });
  }
}
