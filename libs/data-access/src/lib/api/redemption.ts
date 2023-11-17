import { AxiosResponse } from 'axios';
import { RedemptionData, RedemptionPostData } from '../types/redemption';
import client from './client';

const URL = 'redemptions';

export async function getAllRedemptions(): Promise<
  AxiosResponse<RedemptionData[]>
> {
  return client.get(`${URL}`);
}

export async function getRedemptionsByStudentId(
  studentId: string,
): Promise<AxiosResponse<RedemptionData[]>> {
  return client.get(`${URL}/student/${studentId}`);
}

export async function getRedemptionById(
  redemptionId: string,
): Promise<AxiosResponse<RedemptionData>> {
  return client.get(`${URL}/${redemptionId}`);
}

export async function createRedemption(
  redemptionData: RedemptionPostData,
): Promise<AxiosResponse<RedemptionData>> {
  return client.post(`${URL}`, redemptionData);
}

export async function markRedemptionAsRedeemed(
  redemptionId: string,
): Promise<AxiosResponse<RedemptionData>> {
  return client.put(`${URL}/${redemptionId}`);
}
