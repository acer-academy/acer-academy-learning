import {
  CentreCreateData,
  CentreData,
  CentreUpdateData,
} from '../types/centre';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/centres';

export async function getAllCentres(): Promise<AxiosResponse<CentreData[]>> {
  return client.get(`${URL}`);
}

export async function getCentreById(
  centreId: string,
): Promise<AxiosResponse<CentreData>> {
  return client.get(`${URL}/${centreId}`);
}

export async function createCentre(
  centreData: CentreCreateData,
): Promise<AxiosResponse<CentreData>> {
  return client.post(`${URL}`, centreData);
}

export async function updateCentre(
  centreId: string,
  centreData: CentreUpdateData,
): Promise<AxiosResponse<CentreData>> {
  return client.put(`${URL}/${centreId}`, centreData);
}

export async function deleteCentre(
  centreId: string,
): Promise<AxiosResponse<CentreData>> {
  return client.delete(`${URL}/${centreId}`);
}
