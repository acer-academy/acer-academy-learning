import { Promotion, Prisma } from '@prisma/client';
import { PromotionDao } from '../dao/PromotionDao';

export class PromotionService {
  constructor(private promotionDao: PromotionDao = new PromotionDao()) {}
  public async createPromotion(
    input: Prisma.PromotionCreateInput,
  ): Promise<Promotion> {
    return this.promotionDao.createPromotion(input);
  }

  public async getAllPromotions(): Promise<Promotion[]> {
    return this.promotionDao.getAllPromotions();
  }

  public async getAllValidPromotions(): Promise<Promotion[]> {
    return this.promotionDao.getAllValidPromotions();
  }

  public async getPromotionById(promotionId: string): Promise<Promotion> {
    return this.promotionDao.getPromotionById(promotionId);
  }

  public async getPromotionByPromoCode(code: string): Promise<Promotion> {
    return this.promotionDao.getPromotionByPromoCode(code);
  }

  public async updatePromotion(
    promotionId: string,
    data: Prisma.PromotionUpdateInput,
  ): Promise<Promotion> {
    return this.promotionDao.updatePromotion(promotionId, data);
  }

  public async deletePromotion(promotionId: string): Promise<Promotion | null> {
    const promotion = await this.promotionDao.getPromotionById(promotionId);
    if (promotion.transactions.length > 0) {
      return this.promotionDao.softDeletePromotion(promotionId);
    } else {
      return this.promotionDao.deletePromotion(promotionId);
    }
  }
}
