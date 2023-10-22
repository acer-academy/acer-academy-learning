import { Divider, LexOutput } from '@acer-academy-learning/common-ui';
import { QuizQuestionData } from '@acer-academy-learning/data-access';
import React from 'react';
import MCQAnswerOptions from './MCQAnswerOptions';

export type QuizQuestionCardProps = {
  question: QuizQuestionData;
  questionNumber: number;
  marks: number;
  className?: string;
};

/**
 * Quiz question card component
 * @returns {JSX.Element}
 */
export const QuizQuestionCard = ({
  question,
  questionNumber,
  marks,
  className,
}: QuizQuestionCardProps) => {
  return (
    <div>
      <div
        className={`bg-gray-200 px-4 py-2 text-left font-bold text-gray-900 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 text-base border border-gray-400 rounded-t flex justify-between ${className}`}
      >
        <span>Question {questionNumber}</span>
        <span>
          {marks} mark{marks > 1 ? 's' : ''}
        </span>
      </div>
      <div className="border-b border-x border-gray-400 bg-white px-4 py-5 sm:px-6 shadow space-y-4 flex flex-col">
        <LexOutput editorStateStr={question.questionText} />
        <Divider lineClassName="border-student-primary-600" />
        <MCQAnswerOptions
          answers={question.answers}
          questionNumber={questionNumber}
        />
      </div>
    </div>
  );
};
