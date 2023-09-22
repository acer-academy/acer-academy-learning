import { WhitelistCreateData, WhitelistData } from '../types/whitelist';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/whitelist';

export async function createWhitelist(
  whitelistData: WhitelistCreateData,
): Promise<AxiosResponse<WhitelistData>> {
  return client.post(`${URL}/create`, whitelistData);
}

export async function getAllWhitelist(): Promise<
  AxiosResponse<WhitelistData[]>
> {
  return client.get(`${URL}`);
}

export async function getWhitelistByRole(
  role: string,
): Promise<AxiosResponse<WhitelistData[]>> {
  return client.get(`${URL}/getWhitelistByRole/${role}`);
}

export async function deleteWhitelist(
  whitelistId: string,
): Promise<AxiosResponse<WhitelistData>> {
  return client.delete(`${URL}/delete/${whitelistId}`);
}
