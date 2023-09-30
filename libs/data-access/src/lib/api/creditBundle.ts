import {
  CreditBundleCreateData,
  CreditBundleData,
  CreditBundleUpdateData,
} from '../types/creditBundle';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/credit-bundles';

export async function getAllCreditBundles(): Promise<
  AxiosResponse<CreditBundleData[]>
> {
  return client.get(`${URL}`);
}

export async function getCreditBundleById(
  creditBundleId: string,
): Promise<AxiosResponse<CreditBundleData>> {
  return client.get(`${URL}/${creditBundleId}`);
}

export async function createCreditBundle(
  creditBundleData: CreditBundleCreateData,
): Promise<AxiosResponse<CreditBundleData>> {
  return client.post(`${URL}`, creditBundleData);
}

export async function updateCreditBundle(
  creditBundleId: string,
  creditBundleData: CreditBundleUpdateData,
): Promise<AxiosResponse<CreditBundleData>> {
  return client.put(`${URL}/${creditBundleId}`, creditBundleData);
}

export async function deleteCreditBundle(
  creditBundleId: string,
): Promise<AxiosResponse<CreditBundleData>> {
  return client.delete(`${URL}/${creditBundleId}`);
}
