import { TransactionData } from '../types/transaction';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/transactions';

export async function getAllTransactions(): Promise<
  AxiosResponse<TransactionData[]>
> {
  return client.get(`${URL}`);
}

export async function getAvailableCredits(
  termId: string,
  studentId: string,
): Promise<AxiosResponse<number>> {
  return client.get(`${URL}/availableCredits/${termId}/${studentId}`);
}
