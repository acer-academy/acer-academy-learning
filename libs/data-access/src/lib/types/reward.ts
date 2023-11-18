import { RedemptionData } from './redemption';

export interface RewardData {
  id: string;
  name: string;
  pointsNeeded: number;
  isActive: boolean;
  redemptions: RedemptionData[];
}

export interface RewardPostData {
  name: string;
  pointsNeeded: number;
}
