import {
  Divider,
  GenericButton,
  LexFloatingEditor,
  LexOutput,
} from '@acer-academy-learning/common-ui';
import {
  CreateAdaptiveTakeSchema,
  LEX_DEFAULT_JSON_STRING,
  QuizQuestionData,
  QuizQuestionTypeEnum,
} from '@acer-academy-learning/data-access';
import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { QuizTimer } from './QuizTimer';
import { AdaptiveQuizSelectAnswerOptions } from './AdaptiveQuizSelectAnswerOptions';

export type AdaptiveQuizQuestionCardProps = {
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
export const AdaptiveQuizQuestionCard = ({
  question,
  questionNumber,
  marks,
  bannerClassName,
  className,
}: AdaptiveQuizQuestionCardProps) => {
  const [showDemo, setShowDemo] = useState(true);
  const answerOptions = useMemo(() => {
    switch (question.questionType) {
      case QuizQuestionTypeEnum.MCQ:
      case QuizQuestionTypeEnum.TFQ:
        return (
          <AdaptiveQuizSelectAnswerOptions
            type="radio"
            answers={question.answers}
          />
        );
      case QuizQuestionTypeEnum.MRQ:
        return (
          <AdaptiveQuizSelectAnswerOptions
            type="checkbox"
            answers={question.answers}
          />
        );
      default:
        return (
          <Controller
            name={`studentAnswer.studentAnswer.0`}
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
  }, [question]);
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
        {/* To remove */}
        <GenericButton
          className="bg-student-primary-600 hover:bg-student-primary-700 mt-4"
          text="Toggle For Demo"
          type="button"
          onClick={() => setShowDemo((prev) => !prev)}
        />
        <div
          className={`${
            showDemo ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 `}
        >
          <p>Difficulty: {question.difficulty}</p>
          <div>
            Correct Answers:
            {question.answers
              .filter((answer) => answer.isCorrect)
              .map((answer) => (
                <LexOutput key={answer.id} editorStateStr={answer.answer} />
              ))}
          </div>
        </div>
      </div>
      <div className="hidden">
        <QuizTimer<CreateAdaptiveTakeSchema>
          key={`studentAnswer.timeTaken`}
          name={`studentAnswer.timeTaken`}
        />
      </div>
    </>
  );
};
