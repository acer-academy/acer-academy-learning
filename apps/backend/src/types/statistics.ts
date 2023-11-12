import { QuizQuestionTopicEnum } from '@prisma/client';

export type SubjectWiseAnalyticsServiceParams = {
  studentId: string;
  startDate?: string;
  topics?: QuizQuestionTopicEnum[];
};
