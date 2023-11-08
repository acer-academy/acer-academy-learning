import {
  SessionCreateData,
  SessionData,
  SessionUpdateData,
  // SessionCreateData,
  // SessionUpdateData,
} from '../types/session';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/sessions';

export async function getAllSessions(): Promise<AxiosResponse<SessionData[]>> {
  return client.get(`${URL}`);
}

export async function getSessionById(id: string): Promise<SessionData> {
  return client.get(`${URL}/${id}`);
}

export async function createSession(
  input: SessionCreateData,
): Promise<SessionData> {
  return client.post(`${URL}`, input);
}


export async function updateSession(
  id: string,
  input: SessionUpdateData,
): Promise<SessionData> {
  return client.put(`${URL}/${id}`, input);
}

export async function deleteSession(
  id: string,
): Promise<AxiosResponse<SessionData>> {
  return client.delete(`${URL}/${id}`);
}


export async function bookSession(
  sessionId: string,
  studentId: string,
): Promise<AxiosResponse<SessionData>> {
  return client.put(`${URL}/book/${sessionId}/${studentId}`);
}

export async function cancelSession(
  sessionId: string,
  studentId: string,
): Promise<AxiosResponse<SessionData>> {
  return client.put(`${URL}/cancel/${sessionId}/${studentId}`);
}

