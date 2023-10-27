import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/message';

export async function createWhatsappMessage(): Promise<AxiosResponse<void>> {
  return client.post(`${URL}/create`);
}
