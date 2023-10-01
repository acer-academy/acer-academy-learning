import React, { useEffect } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  useFieldArray,
} from 'react-hook-form';
import { CreateQuizQuestionType } from '@acer-academy-learning/data-access';
import { LexEditor, LexFloatingEditor } from '@acer-academy-learning/common-ui';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DEFAULT_QUESTION_ANSWER } from '../constants/questionAnswer';

export type QuestionAnswerProps = {
  register: UseFormRegister<CreateQuizQuestionType>;
  control: Control<CreateQuizQuestionType>;
  errors: FieldErrors<CreateQuizQuestionType>;
};

export const QuestionAnswers = ({
  control,
  register,
  errors,
}: QuestionAnswerProps) => {
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const {
    fields: answers,
    append,
    remove,
  } = useFieldArray({
    name: 'answers',
    control,
  });
  return (
    <fieldset className="owl-t-4">
      <legend className="sr-only">Question Answers</legend>
      {answers.map((answer, index) => (
        <section key={answer.id} className="flex flex-col owl-t-4">
          <div className="flex items-start owl-l-4">
            <input
              id={answer.id}
              aria-describedby={`${answer.id}.isCorrect`}
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-teacher-primary-600 focus:ring-teacher-primary-600"
              {...register(`answers.${index}.isCorrect`)}
            />
            <Controller
              key={answer.id}
              control={control}
              name={`answers.${index}.answer`}
              render={({ field: { onChange, value, onBlur } }) => (
                <LexFloatingEditor
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  className="flex-[5]"
                />
              )}
            />
            <button type="button" onClick={() => remove(index)}>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <span className="text-red-500">
            {errors.answers?.[index]?.answer?.message}
          </span>
        </section>
      ))}
      <span className="text-red-500">{errors.answers?.message}</span>
      <button
        className="inline-flex items-center gap-x-1.5 rounded-md bg-teacher-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teacher-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teacher-primary-600"
        type="button"
        onClick={() => append(DEFAULT_QUESTION_ANSWER)}
      >
        Add Question
      </button>
    </fieldset>
  );
};
