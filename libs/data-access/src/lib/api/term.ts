import { TermData, TermCreateData, TermUpdateData } from '../types/term';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/terms';

export async function getAllTerms(): Promise<AxiosResponse<TermData[]>> {
  return client.get(`${URL}`);
}

export async function getTermById(id: string): Promise<TermData> {
  return client.get(`${URL}/${id}`);
}

export async function createTerm(input: TermCreateData): Promise<TermData> {
  return client.post(`${URL}`, input);
}

export async function updateTerm(
  id: string,
  input: TermUpdateData,
): Promise<TermData> {
  return client.put(`${URL}/${id}`, input);
}

export async function deleteTerm(id: string): Promise<AxiosResponse<TermData>> {
  return client.delete(`${URL}/${id}`);
}
