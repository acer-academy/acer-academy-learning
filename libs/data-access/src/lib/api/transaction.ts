import { TransactionData } from '../types/transaction';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/transactions';

export async function getAllTransactions(): Promise<
  AxiosResponse<TransactionData[]>
> {
  return client.get(`${URL}`);
}
