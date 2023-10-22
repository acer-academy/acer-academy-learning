import { LexOutput } from '@acer-academy-learning/common-ui';
import {
  CreateTakeSchema,
  QuizAnswer,
} from '@acer-academy-learning/data-access';
import React, { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export type MCQAnswerOptions = {
  questionNumber: number;
  answers: QuizAnswer[];
};

const MCQAnswerOptions = ({ answers, questionNumber }: MCQAnswerOptions) => {
  const { register, watch } = useFormContext<CreateTakeSchema>();
  const studentAns = watch('studentAnswers');
  useEffect(() => {
    console.log(studentAns);
  }, [studentAns]);

  return (
    <>
      {answers.map((answer) => (
        <label
          htmlFor={
            register(`studentAnswers.${questionNumber - 1}.studentAnswer`).name
          }
          key={answer.id}
          className="border border-gray-400 bg-white p-3 text-base rounded flex items-center space-x-2"
        >
          <input
            type="radio"
            value={answer.answer}
            {...register(
              `studentAnswers.${questionNumber - 1}.studentAnswer.0`,
            )}
          />
          <LexOutput editorStateStr={answer.answer} />
        </label>
      ))}
    </>
  );
};

export default MCQAnswerOptions;
