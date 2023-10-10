import {
  CreateQuizAnswerType,
  CreateQuizQuestionType,
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

export const TRUE_FALSE_VALUES: CreateQuizAnswerType[] = [
  {
    answer:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"True","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    isCorrect: false,
  },
  {
    answer:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"False","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    isCorrect: false,
  },
];
