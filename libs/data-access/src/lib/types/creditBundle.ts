import { LevelEnum } from './CommonTypes';

export interface CreditBundleCreateData {
  name: string;
  description?: string;
  numCredits: number;
  basePrice: number;
  level: LevelEnum;
}

export interface CreditBundleUpdateData {
  name?: string;
  description?: string;
  numCredits?: number;
  basePrice?: number;
  isActive?: boolean;
  level?: LevelEnum;
}

export interface CreditBundleData {
  id: string;
  name: string;
  description?: string;
  numCredits: number;
  basePrice: number;
  isActive: boolean;
  level: LevelEnum;
}

export interface CreditBundleCartItem extends CreditBundleData {
  quantity: number;
}
