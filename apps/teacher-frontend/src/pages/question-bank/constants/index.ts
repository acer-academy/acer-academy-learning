import {
  CreateQuizAnswerType,
  CreateQuizQuestionType,
  LevelEnum,
  QuizQuestionStatusEnum,
  QuizQuestionTypeEnum,
} from '@acer-academy-learning/data-access';

export const DEFAULT_QUESTION: Partial<CreateQuizQuestionType> = {
  questionType: QuizQuestionTypeEnum.MCQ,
  answers: [
    {
      answer: '',
      isCorrect: false,
    },
    {
      answer: '',
      isCorrect: false,
    },
  ],
  topics: [],
  levels: [LevelEnum.P1],
  status: QuizQuestionStatusEnum.READY,
};

export const DEFAULT_QUESTION_ANSWER: CreateQuizAnswerType = {
  answer: '',
  isCorrect: false,
};
