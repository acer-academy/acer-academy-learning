import { QuizQuestionData } from './question';
import { QuizData } from './quiz';

export interface TakeData {
  id: string;
  marks: Number;
  attemptedAt: string;
  timeTaken: Number;
  takenById: string;
  quizId: string;
}

export interface StudentTakeData {
  id: string;
  marks: number;
  attemptedAt: string;
  timeTaken: number;
  takenById: string;
  quizId: string;
  studentAnswers: {
    id: string;
    questionId: string;
    studentAnswer: string;
    isCorrect: boolean;
    timeTaken: number;
    takeId: string;
    question: QuizQuestionData;
  };
  quiz: QuizData;
}
