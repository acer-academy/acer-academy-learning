import client from './client';
import { AxiosResponse } from 'axios';
import { AttendanceCreateData, AttendanceData } from '../types/attendance';

const URL = '/attendances';

export async function getAllAttendances(): Promise<
  AxiosResponse<AttendanceData[]>
> {
  return client.get(`${URL}`);
}

export async function createAttendance(
  attendance: AttendanceCreateData,
): Promise<AxiosResponse<AttendanceData>> {
  return client.post(`${URL}`, attendance);
}

export async function revertAttendance(
  attendanceId: string,
): Promise<AxiosResponse<AttendanceData>> {
  return client.post(`${URL}/revert/${attendanceId}`);
}
