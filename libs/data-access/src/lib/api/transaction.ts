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

export async function getAvailableCredits(
  termId: string,
  studentId: string,
): Promise<AxiosResponse<number>> {
  return client.get(`${URL}/availableCredits/${termId}/${studentId}`);
}

export async function rolloverCredits(
  studentId: string,
  currentTermId: string,
  prevTermId: string,
): Promise<AxiosResponse<TransactionData[]>> {
  return client.get(
    `${URL}/rollover/${studentId}/${currentTermId}/${prevTermId}`,
  );
}
