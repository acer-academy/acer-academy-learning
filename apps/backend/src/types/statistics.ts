import { QuizQuestionTopicEnum, SubjectEnum } from '@prisma/client';

export type SubjectWiseAnalyticsServiceParams = {
  studentId: string;
  startDate?: string;
  topics?: QuizQuestionTopicEnum[];
  subject: SubjectEnum;
};
