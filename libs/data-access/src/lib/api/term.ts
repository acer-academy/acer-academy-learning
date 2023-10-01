import { TermData } from '../types/transaction';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/terms';

export async function getAllTerms(): Promise<AxiosResponse<TermData[]>> {
  return client.get(`${URL}`);
}
