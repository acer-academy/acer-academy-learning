import { QuizQuestionDifficultyEnum } from '@acer-academy-learning/data-access';

export const getDifficultyBasedOn = (
  numOfCorrectQuestions: number,
  thresholds: {
    [key in QuizQuestionDifficultyEnum]: number;
  },
) => {
  if (numOfCorrectQuestions < thresholds.BASIC) {
    return QuizQuestionDifficultyEnum.BASIC;
  } else if (numOfCorrectQuestions < thresholds.INTERMEDIATE) {
    return QuizQuestionDifficultyEnum.INTERMEDIATE;
  } else {
    return QuizQuestionDifficultyEnum.ADVANCED;
  }
};
