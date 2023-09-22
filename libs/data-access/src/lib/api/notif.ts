import {
  NotificationPreference,
  NotificationPreferenceUpdateData,
} from '../types/student';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/preferences';

export async function updateNotificationPreference(
  preferenceId: string,
  preferenceData: NotificationPreferenceUpdateData,
): Promise<AxiosResponse<NotificationPreference>> {
  console.log('calling....');
  return client.put(`${URL}/${preferenceId}`, preferenceData);
}
