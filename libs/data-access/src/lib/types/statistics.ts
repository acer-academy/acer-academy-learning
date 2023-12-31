import { Point, SeriesOptionsType } from 'highcharts';
import { AssignmentData } from './assignment';
import { AssignmentAttemptData } from './assignmentAttempt';
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

export interface ConsolidatedAssignmentStatistics {
  totalMarksArr: number[];
  assignmentDetails: Partial<AssignmentData>;
  assignmentAttempts: AssignmentAttemptData[];
}
export type StudentStatisticsQuizFormat = {
  totalMarks: number;
  takes: {
    attemptedAt: string;
    marks: number;
  }[];
};

export type SpiderChartResponse = {
  labelsArr: string[];
  dataArr: number[];
  metaDataArr: { [key: string]: string }[];
};

export enum Duration {
  PAST_FOURTEEN_DAYS = 'Past 2 Weeks',
  PAST_THREE_MONTHS = 'Past 3 Months',
  PAST_YEAR = 'Past Year',
  ALL = 'All',
}

export type CustomSeriesOptionsType = {
  metaData?: { [key: string]: string };
} & SeriesOptionsType;

export type CustomHighChartsPoint = {
  metaData?: { [key: string]: string };
} & Point;
