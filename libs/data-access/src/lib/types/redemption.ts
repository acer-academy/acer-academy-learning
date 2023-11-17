export interface RedemptionData {
  id: string;
  createdAt: string;
  isRedeemed: boolean;
  studentId: string;
}

export interface RedemptionPostData {
  rewardId: string;
  studentId: string;
}
