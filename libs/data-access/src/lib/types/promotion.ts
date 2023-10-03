import { PromotionStatusEnum } from './CommonTypes';

export interface PromotionData {
  id: string;
  startDate: Date;
  endDate: Date;
  promoCode: string;
  percentageDiscount: number;
  description: string;
  status: PromotionStatusEnum;
}

export interface PromotionPostData {
  startDate: string;
  endDate: string;
  promoCode: string;
  percentageDiscount: number;
  description: string;
}

export interface PromotionPutData {
  startDate?: string;
  endDate?: string;
  promoCode?: string;
  percentageDiscount?: number;
  description?: string;
}
