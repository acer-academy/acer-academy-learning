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
        <div key={answer.id}>
          <label
            className={
              answer.isCorrect
                ? 'border border-green-400 bg-green-200 p-3 text-base rounded flex items-center space-x-3'
                : takeAnswers &&
                  takeAnswers.some((ans) => answer.answer === ans.studentAnswer)
                ? 'border border-red-400 bg-red-200 p-3 text-base rounded flex items-center space-x-3'
                : 'border border-gray-400 bg-white p-3 text-base rounded flex items-center space-x-3'
            }
          >
            <input
              className="text-student-secondary-700 focus:ring-student-primary-900"
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
            <div className="bg-white px-2 py-2 align-middle sm:px-2 lg:px-2 border border-gray">
              <span className="font-bold">Explanation</span>
              <LexOutput editorStateStr={answer.explanation} />
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
    </>
  );
};
