import {
  NotificationPreference,
  NotificationPreferenceUpdateData,
} from '../types/student';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/preferences';

export async function updateNotificationPreference(
  studentId: string,
  preferenceData: NotificationPreferenceUpdateData,
): Promise<AxiosResponse<NotificationPreference>> {
  return client.put(`${URL}/update/${studentId}`, preferenceData);
}
