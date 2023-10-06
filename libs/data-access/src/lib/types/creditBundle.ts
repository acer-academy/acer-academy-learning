export interface CreditBundleCreateData {
  name: string;
  description?: string;
  numCredits: number;
  basePrice: number;
}

export interface CreditBundleUpdateData {
  name: string;
  description?: string;
  numCredits: number;
  basePrice: number;
}

export interface CreditBundleData {
  id: string;
  name: string;
  description?: string;
  numCredits: number;
  basePrice: number;
  isActive: boolean;
}

export interface CreditBundleCartItem extends CreditBundleData {
  quantity: number;
}
