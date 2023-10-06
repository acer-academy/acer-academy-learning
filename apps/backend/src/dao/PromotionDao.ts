import { PrismaClient, Promotion, Prisma, Transaction } from '@prisma/client';

export class PromotionDao {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createPromotion(
    input: Prisma.PromotionCreateInput,
  ): Promise<Promotion> {
    return this.prisma.promotion.create({
      data: {
        ...input,
      },
    });
  }

  public async getAllPromotions(): Promise<Promotion[]> {
    return this.prisma.promotion.findMany();
  }

  public async getAllValidPromotions(): Promise<Promotion[]> {
    const currentDate = new Date();
    return this.prisma.promotion.findMany({
      where: {
        startDate: {
          lte: currentDate,
        },

        endDate: {
          gte: currentDate,
        },
        status: 'ACTIVE',
      },
    });
  }

  public async updatePromotion(
    promotionId: string,
    updatedData: Prisma.PromotionUpdateInput,
  ): Promise<Promotion> {
    return this.prisma.promotion.update({
      where: { id: promotionId },
      data: { ...updatedData },
    });
  }

  public async getPromotionById(
    promotionId: string,
  ): Promise<Promotion & { transactions: Transaction[] }> {
    return this.prisma.promotion.findUnique({
      where: { id: promotionId },
      include: { transactions: true },
    });
  }

  public async getPromotionByPromoCode(code: string): Promise<Promotion> {
    return this.prisma.promotion.findUnique({ where: { promoCode: code } });
  }

  public async deletePromotion(promotionId: string): Promise<Promotion | null> {
    return this.prisma.promotion.delete({ where: { id: promotionId } });
  }

  public async softDeletePromotion(promotionId: string): Promise<Promotion> {
    return this.prisma.promotion.update({
      where: { id: promotionId },
      data: {
        status: 'INACTIVE',
      },
    });
  }
}
