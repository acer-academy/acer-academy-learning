import { QuizQuestionData } from './question';

export interface TakeAnswerData {
  id: string;
  questionId: string;
  studentAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
  takeId: string;
  question: QuizQuestionData;
}
