import { QuizData } from '@acer-academy-learning/data-access';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export type QuizRowProps = {
  quiz: QuizData;
  className?: string;
};

/**
 * A list item for view all quizzes
 * @returns {JSX.Element}
 */
const smallDataClassName = `text-xs px-2`;
export const QuizRow = ({ quiz, className }: QuizRowProps) => {
  const navigate = useNavigate();
  return (
    <li
      className={` hover:bg-blue-100 border-x border-b border-gray-400 ${className}`}
    >
      <button
        type="button"
        className="flex items-center space-x-4 px-6 py-4 w-full"
        onClick={() => navigate(quiz.id)}
      >
        <AcademicCapIcon className="h-8 w-8" />
        <div className="flex flex-col space-y-1">
          <span className="text-base font-bold underline hover:no-underline self-start">
            {quiz.title}
          </span>
          <div className="flex divide-x divide-black">
            <small className={`${smallDataClassName} pl-0`}>
              {quiz.totalMarks} marks
            </small>
            <small className={`${smallDataClassName}`}>
              {quiz.rewardPoints} points
            </small>
            <small className={`${smallDataClassName}`}>
              {quiz.quizQuestions.length} Questions
            </small>
          </div>
        </div>
      </button>
    </li>
  );
};
