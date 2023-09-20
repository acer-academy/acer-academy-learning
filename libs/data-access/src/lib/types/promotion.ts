export interface PromotionData {
    id: string,
    startDate: Date,
    endDate: Date,
    promoCode: string,
    percentageDiscount: number,
    description: string
}

export interface PromotionPostData {
    startDate: Date,
    endDate: Date,
    promoCode: string,
    percentageDiscount: number, 
    description: string
}

export interface PromotionPutData {
    startDate?: Date,
    endDate?: Date,
    promoCode?: string,
    percentageDiscount?: number,  
    description?: string
}