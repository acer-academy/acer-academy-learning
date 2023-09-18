import { Promotion } from "@prisma/client";
import PromotionDao from "../dao/PromotionDao";
import { PromotionPostData, PromotionPutData } from "libs/data-access/src/lib/types/promotion";

class PromotionService {
    public async createPromotion(input: PromotionPostData): Promise<Promotion> {
        return PromotionDao.createPromotion(input)
    }

    public async getAllPromotions(): Promise<Promotion[]> {
        return PromotionDao.getAllPromotion()
    }

    public async getPromotionById(promotionId: string): Promise<Promotion> {
        return PromotionDao.getPromotionById(promotionId)
    }

    public async updatePromotion(promotionId: string, data: PromotionPutData): Promise<Promotion> {
        return PromotionDao.updatePromotion(promotionId, data)
    }

    public async deletePromotion(promotionId: string){
        return PromotionDao.deletePromotion(promotionId)
    }
   
}

export default new PromotionService()