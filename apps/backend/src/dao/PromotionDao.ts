import { PrismaClient, Promotion, Prisma } from "@prisma/client";

class PromotionDao {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    public async createPromotion(input: Prisma.PromotionCreateInput): Promise<Promotion> {
        return this.prisma.promotion.create({
            data: {
                ...input
            }
        })
    } 

    public async getAllPromotion(): Promise<Promotion[]> {
        return this.prisma.promotion.findMany()
    }

    public async updatePromotion(promotionId: string, updatedData: Prisma.PromotionUpdateInput): Promise<Promotion> {
        return this.prisma.promotion.update({
            where: {id: promotionId},
            data: {...updatedData}
        })
    }

    public async getPromotionById(promotionId: string): Promise<Promotion> {
        return this.prisma.promotion.findUnique( {where: {id: promotionId}})
    }

    public async getPromotionByPromoCode(code: string): Promise<Promotion> {
        return this.prisma.promotion.findUnique({ where: {promoCode: code}}) 
    }

    public async deletePromotion(promotionId: string) {
        return this.prisma.promotion.delete({where: {id: promotionId}})
    }
} 


export default new PromotionDao()
