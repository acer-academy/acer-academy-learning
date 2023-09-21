import {
  FaqTopicCreateData,
  FaqTopicData,
  FaqTopicUpdateData,
} from '../types/faqTopic';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/faq-topics';

export async function getAllFaqTopics(): Promise<
  AxiosResponse<FaqTopicData[]>
> {
  return client.get(`${URL}`);
}

export async function getFaqTopicById(
  faqTopicId: string,
): Promise<AxiosResponse<FaqTopicData>> {
  return client.get(`${URL}/${faqTopicId}`);
}

export async function createFaqTopic(
  faqTopicData: FaqTopicCreateData,
): Promise<AxiosResponse<FaqTopicData>> {
  return client.post(`${URL}`, faqTopicData);
}

export async function updateFaqTopic(
  faqTopicId: string,
  faqTopicData: FaqTopicUpdateData,
): Promise<AxiosResponse<FaqTopicData>> {
  return client.put(`${URL}/${faqTopicId}`, faqTopicData);
}

export async function deleteFaqTopic(
  faqTopicId: string,
): Promise<AxiosResponse<FaqTopicData>> {
  return client.delete(`${URL}/${faqTopicId}`);
}
