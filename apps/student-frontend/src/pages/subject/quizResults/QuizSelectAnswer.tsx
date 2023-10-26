import { LexOutput } from '@acer-academy-learning/common-ui';
import React from 'react';
import { Divider } from '@acer-academy-learning/common-ui';
import { QuizAnswer, TakeAnswerData } from '@acer-academy-learning/data-access';
import { useState } from 'react';

export type MCQAnswerOptions = {
  answers: QuizAnswer[];
  takeAnswers: TakeAnswerData[];
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const QuizSelectAnswer = ({
  answers,
  takeAnswers,
  type,
}: MCQAnswerOptions) => {
  return (
    <>
      {answers.map((answer) => (
        <>
          <label
            className={
              answer.isCorrect
                ? 'border border-green-400 bg-green-200 p-3 text-base rounded flex items-center space-x-3'
                : takeAnswers &&
                  takeAnswers.some((ans) => answer.answer === ans.studentAnswer)
                ? 'border border-red-400 bg-red-200 p-3 text-base rounded flex items-center space-x-3'
                : 'border border-gray-400 bg-white p-3 text-base rounded flex items-center space-x-3'
            }
            key={answer.id}
          >
            <input
              className="text-student-primary-600 focus:ring-student-primary-600"
              type={type}
              value={answer.answer}
              disabled={true}
              checked={
                takeAnswers
                  ? takeAnswers.some(
                      (ans) => answer.answer === ans.studentAnswer,
                    )
                  : false
              }
            />
            <LexOutput editorStateStr={answer.answer} />
          </label>
          {answer.explanation ? (
            <>
              <span className="font-bold">Explanation</span>
              <LexOutput editorStateStr={answer.explanation} />
            </>
          ) : (
            <></>
          )}
        </>
      ))}
    </>
  );
};
