import { Promotion, Prisma } from '@prisma/client';
import PromotionDao from '../dao/PromotionDao';

class PromotionService {
  public async createPromotion(
    input: Prisma.PromotionCreateInput,
  ): Promise<Promotion> {
    return PromotionDao.createPromotion(input);
  }

  public async getAllPromotions(): Promise<Promotion[]> {
    return PromotionDao.getAllPromotions();
  }

  public async getAllValidPromotions(): Promise<Promotion[]> {
    return PromotionDao.getAllValidPromotions();
  }

  public async getPromotionById(promotionId: string): Promise<Promotion> {
    return PromotionDao.getPromotionById(promotionId);
  }

  public async getPromotionByPromoCode(code: string): Promise<Promotion> {
    return PromotionDao.getPromotionByPromoCode(code);
  }

  public async updatePromotion(
    promotionId: string,
    data: Prisma.PromotionUpdateInput,
  ): Promise<Promotion> {
    return PromotionDao.updatePromotion(promotionId, data);
  }

  public async deletePromotion(promotionId: string) {
    return PromotionDao.deletePromotion(promotionId);
  }
}

export default new PromotionService();
