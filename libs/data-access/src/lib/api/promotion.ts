import {
  PromotionData,
  PromotionPostData,
  PromotionPutData,
} from '../types/promotion';

import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/promotions';

export async function getAllPromotions(): Promise<
  AxiosResponse<PromotionData[]>
> {
  return client.get(`${URL}/getAllPromotions`);
}

export async function getValidPromotions(): Promise<
  AxiosResponse<PromotionData[]>
> {
  return client.get(`${URL}/validPromotions`);
}

export async function createPromotion(
  data: PromotionPostData,
): Promise<AxiosResponse<PromotionData>> {
  return client.post(`${URL}/createPromotion`, data);
}

export async function updatePromotion(
  id: string,
  data: PromotionPutData,
): Promise<AxiosResponse<PromotionData>> {
  return client.put(`${URL}/updatePromotion/${id}`, data);
}

export async function getPromotionByPromoCode(
  promoCode: string,
): Promise<AxiosResponse<PromotionData>> {
  return client.get(`${URL}/getPromotionByPromoCode/${promoCode}`);
}

export async function getPromotionById(
  id: string,
): Promise<AxiosResponse<PromotionData>> {
  return client.get(`${URL}/getPromotionById/${id}`);
}

export async function deletePromotion(
  id: string,
): Promise<AxiosResponse<string>> {
  return client.delete(`${URL}/deletePromotion/${id}`);
}
