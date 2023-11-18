import { AxiosResponse } from 'axios';
import {
  AnnouncementData,
  CreateAnnouncementType,
} from '../types/announcement';
import client from './client';

const URL = '/announcements';

export async function createAnnouncement(
  announcementData: CreateAnnouncementType,
): Promise<AxiosResponse<AnnouncementData>> {
  return client.post(`${URL}`, announcementData);
}

export async function getAllAnnouncements(): Promise<
  AxiosResponse<AnnouncementData[]>
> {
  return client.get(`${URL}`);
}

export async function getAnnouncementById(
  announcementId: string,
): Promise<AxiosResponse<AnnouncementData>> {
  return client.get(`${URL}/${announcementId}`);
}

export async function getAnnouncementsByTeacherId(
  teacherId: string,
): Promise<AxiosResponse<AnnouncementData[]>> {
  return client.get(`${URL}/teacher/${teacherId}`);
}

export async function getAnnouncementsByStudentId(
  studentId: string,
): Promise<AxiosResponse<AnnouncementData[]>> {
  return client.get(`${URL}/student/${studentId}`);
}

export async function updateAnnouncement(
  announcementId: string,
  announcementData: CreateAnnouncementType,
): Promise<AxiosResponse<AnnouncementData>> {
  return client.put(`${URL}/${announcementId}`, announcementData);
}

export async function deleteAnnouncement(
  announcementId: string,
): Promise<AxiosResponse<AnnouncementData>> {
  return client.delete(`${URL}/${announcementId}`);
}
