import { QuizQuestionDifficultyEnum } from '@acer-academy-learning/data-access';

export const difficultyEnumUIMap = new Map<
  QuizQuestionDifficultyEnum,
  { bgColor: string; prettyText: string }
>([
  [
    QuizQuestionDifficultyEnum.BASIC,
    { bgColor: 'bg-adminGreen-300', prettyText: 'Basic' },
  ],
  [
    QuizQuestionDifficultyEnum.INTERMEDIATE,
    { bgColor: 'bg-altYellow-300', prettyText: 'Intermediate' },
  ],
  [
    QuizQuestionDifficultyEnum.ADVANCED,
    { bgColor: 'bg-studentPink-300', prettyText: 'Advanced' },
  ],
]);
