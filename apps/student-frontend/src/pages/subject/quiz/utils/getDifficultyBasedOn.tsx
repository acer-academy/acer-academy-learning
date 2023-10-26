import { QuizQuestionDifficultyEnum } from '@acer-academy-learning/data-access';

const BASIC_THRESHOLD = 3;
const INTERMEDIATE_THRESHOLD = 7;
export const getDifficultyBasedOn = (numOfCorrectQuestions: number) => {
  if (numOfCorrectQuestions < BASIC_THRESHOLD) {
    return QuizQuestionDifficultyEnum.BASIC;
  } else if (numOfCorrectQuestions < INTERMEDIATE_THRESHOLD) {
    return QuizQuestionDifficultyEnum.INTERMEDIATE;
  } else {
    return QuizQuestionDifficultyEnum.ADVANCED;
  }
};
