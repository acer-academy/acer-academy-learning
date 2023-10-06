import {
  CreateQuizAnswerType,
  CreateQuizQuestionType,
  LevelEnum,
  QuizQuestionStatusEnum,
  QuizQuestionTypeEnum,
} from '@acer-academy-learning/data-access';

export const DEFAULT_QUESTION: Partial<CreateQuizQuestionType> = {
  questionText: '',
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
  levels: [],
  status: QuizQuestionStatusEnum.READY,
};

export const DEFAULT_QUESTION_ANSWER: CreateQuizAnswerType = {
  answer: '',
  isCorrect: false,
};

export const LEX_JSON_EMPTY =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';