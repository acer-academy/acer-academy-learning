import { QuizData } from './quiz';

export interface SingleQuestionStatistics {
  quizQuestionId: string;
  quizQuestionIndex: number;
  quizQuestionMarks: number;
  questionText: string;
  correctRate: number;
  averageTimeTaken: number;
  options: {
    answer: string;
    isCorrect: boolean;
    count: number;
  }[];
}

export interface ConsolidatedQuizStatistics {
  totalMarksArr: number[];
  averageTotalTimeTaken: number;
  quizDetails: Partial<QuizData>;
  quizQuestions: SingleQuestionStatistics[];
}
