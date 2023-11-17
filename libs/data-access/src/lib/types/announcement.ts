import { createAnnouncementSchema } from '../schemas/announcement';
import { LevelEnum, SubjectEnum } from './CommonTypes';
import { CentreData } from './centre';
import { TeacherData } from './teacher';
import { z } from 'zod';

export interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  teacher: TeacherData;
  targetSubjects: SubjectEnum[];
  targetLevels: LevelEnum[];
  targetCentres: CentreData[];
  createdAt: Date;
}

export type CreateAnnouncementType = z.infer<typeof createAnnouncementSchema>;
