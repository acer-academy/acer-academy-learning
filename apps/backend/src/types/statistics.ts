import { QuizQuestionTopicEnum, SubjectEnum } from '@prisma/client';
import { PointOptionsObject } from 'highcharts';

export type SubjectWiseAnalyticsServiceParams = {
  studentId: string;
  startDate?: string;
  topics?: QuizQuestionTopicEnum[];
  subject: SubjectEnum;
};

export type SubjectWiseMetaData = {
  marksAchieved: number;
  totalMarks: number;
  questionIdToTakeIdMap: {
    [key: string]: string;
  };
};

export type CustomPointOptionsObject = {
  metaData?: { [key: string]: string };
} & PointOptionsObject;
