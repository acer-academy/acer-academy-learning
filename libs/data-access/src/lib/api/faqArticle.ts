import {
  FaqArticleCreateData,
  FaqArticleData,
  FaqArticleUpdateData,
} from '../types/faqArticle';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/faq-articles';

export async function getAllFaqArticles(): Promise<
  AxiosResponse<FaqArticleData[]>
> {
  return client.get(`${URL}`);
}

export async function getFaqArticleById(
  faqArticleId: string,
): Promise<AxiosResponse<FaqArticleData>> {
  return client.get(`${URL}/${faqArticleId}`);
}

export async function createFaqArticle(
  faqArticleData: FaqArticleCreateData,
): Promise<AxiosResponse<FaqArticleData>> {
  return client.post(`${URL}`, faqArticleData);
}

export async function updateFaqArticle(
  faqArticleId: string,
  faqArticleData: FaqArticleUpdateData,
): Promise<AxiosResponse<FaqArticleData>> {
  return client.put(`${URL}/${faqArticleId}`, faqArticleData);
}

export async function deleteFaqArticle(
  faqArticleId: string,
): Promise<AxiosResponse<FaqArticleData>> {
  return client.delete(`${URL}/${faqArticleId}`);
}
