import {
  Divider,
  LexFloatingEditor,
  LexOutput,
} from '@acer-academy-learning/common-ui';
import {
  LEX_DEFAULT_JSON_STRING,
  QuizQuestionData,
  QuizQuestionTypeEnum,
} from '@acer-academy-learning/data-access';
import { useMemo } from 'react';
import { QuizSelectAnswerOptions } from './QuizSelectAnswerOptions';
import { Controller } from 'react-hook-form';
import { QuizTimer } from './QuizTimer';

export type QuizQuestionCardProps = {
  question: QuizQuestionData;
  questionNumber: number;
  marks: number;
  bannerClassName?: string;
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
  bannerClassName,
  className,
}: QuizQuestionCardProps) => {
  const answerOptions = useMemo(() => {
    switch (question.questionType) {
      case QuizQuestionTypeEnum.MCQ:
      case QuizQuestionTypeEnum.TFQ:
        return (
          <QuizSelectAnswerOptions
            type="radio"
            answers={question.answers}
            questionNumber={questionNumber}
          />
        );
      case QuizQuestionTypeEnum.MRQ:
        return (
          <QuizSelectAnswerOptions
            type="checkbox"
            answers={question.answers}
            questionNumber={questionNumber}
          />
        );
      default:
        return (
          <Controller
            name={`studentAnswers.${questionNumber - 1}.studentAnswer.0`}
            render={({ field: { value, onChange, onBlur } }) => {
              return (
                <LexFloatingEditor
                  editorStateStr={value ?? LEX_DEFAULT_JSON_STRING}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              );
            }}
          />
        );
    }
  }, [question, questionNumber]);
  return (
    <>
      <div className={`${className}`}>
        <div
          className={`bg-gray-200 px-4 py-2 text-left font-bold text-gray-900 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 text-base border border-gray-400 rounded-t flex justify-between ${bannerClassName}`}
        >
          <span>Question {questionNumber}</span>
          <span>
            {marks} mark{marks > 1 ? 's' : ''}
          </span>
        </div>
        <div className="rounded-b border-b border-x border-gray-200 bg-white px-4 py-5 sm:px-6 shadow space-y-4 flex flex-col">
          <LexOutput editorStateStr={question.questionText} />
          <Divider lineClassName="border-student-primary-600" />
          {answerOptions}
        </div>
      </div>
      <div className="invisible">
        <QuizTimer
          key={`studentAnswer.${questionNumber - 1}`}
          name={`studentAnswers.${questionNumber - 1}.timeTaken`}
        />
      </div>
    </>
  );
};
