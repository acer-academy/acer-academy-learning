import { AxiosResponse } from 'axios';
import { RewardData, RewardPostData } from '../types/reward';
import client from './client';

const URL = '/rewards';

export async function getAllRewards(): Promise<AxiosResponse<RewardData[]>> {
  return client.get(`${URL}`);
}

export async function getRewardById(
  rewardId: string,
): Promise<AxiosResponse<RewardData>> {
  return client.get(`${URL}/${rewardId}`);
}

export async function createReward(
  rewardData: RewardPostData,
): Promise<AxiosResponse<RewardData>> {
  return client.post(`${URL}`, rewardData);
}

export async function updateReward(
  rewardId: string,
  rewardData: RewardPostData,
): Promise<AxiosResponse<RewardData>> {
  return client.put(`${URL}/${rewardId}`, rewardData);
}

export async function deleteReward(
  rewardId: string,
): Promise<AxiosResponse<RewardData>> {
  return client.delete(`${URL}/${rewardId}`);
}

export async function getActiveRewards(): Promise<AxiosResponse<RewardData[]>> {
  return client.get(`${URL}/active`);
}

export async function getRewardPointsByStudentId(
  studentId: string,
): Promise<AxiosResponse<number>> {
  return client.get(`${URL}/points/${studentId}`);
}
