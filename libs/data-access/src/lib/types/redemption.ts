import { RewardData } from "./reward";
import { StudentData } from "./student";

export interface RedemptionData {
  id: string;
  createdAt: string;
  isRedeemed: boolean;
  student: StudentData;
  reward: RewardData;
}

export interface RedemptionPostData {
  rewardId: string;
  studentId: string;
}
