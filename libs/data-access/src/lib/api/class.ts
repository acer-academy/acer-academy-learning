import { ClassCreateData, ClassData } from '../types/class';
import {
    SessionCreateData,
    SessionData,
    SessionUpdateData,
  } from '../types/session';
  import client from './client';
  import { AxiosResponse } from 'axios';
  
  const URL = '/classes';
  
  export async function createRecurringClass(
    input: [ClassCreateData, SessionCreateData],
  ): Promise<SessionData[]> {
    return client.post(`${URL}/recurring/`, input);
  }
  
  export async function updateRecurringClass(
    sessionId: string,
    classId: string,
    input: [ClassCreateData, SessionCreateData],
  ): Promise<SessionData> {
    return client.put(`${URL}/recurring/${sessionId}/${classId}`, input);
  }
  
  export async function deleteRecurringClass(
    id: string,
  ): Promise<AxiosResponse<ClassData>> {
    return client.delete(`${URL}/${id}`);
  }
  