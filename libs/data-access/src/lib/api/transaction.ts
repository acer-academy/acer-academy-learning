import { TransactionData } from '../types/transaction';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/transactions';

export async function getAllTransactions(): Promise<
  AxiosResponse<TransactionData[]>
> {
  return client.get(`${URL}`);
}

export async function getTransactionsByStudentId(
  studentId: string,
): Promise<AxiosResponse<TransactionData>> {
  return client.get(`${URL}/student/${studentId}`);
}

export async function refundTransaction(
  transactionId: string,
): Promise<AxiosResponse<TransactionData>> {
  return client.get(`${URL}/refund/${transactionId}`);
}
