import React, { useMemo } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import {
  CreateQuizQuestionType,
  QuizQuestionTypeEnum,
} from '@acer-academy-learning/data-access';
import { LexEditor, LexFloatingEditor } from '@acer-academy-learning/common-ui';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DEFAULT_QUESTION_ANSWER } from '../constants/questionAnswer';
import { AnswerFieldRadio } from './AnswerFieldRadio';
import { AnswerFieldCheckbox } from './AnswerFieldCheckbox';
import { TrueFalseField } from './TrueFalseField';

export const QuestionAnswers = () => {
  const { watch, control, register } = useFormContext<CreateQuizQuestionType>();
  // States/Refs
  const watchQuestionType = watch('questionType');

  const IsCorrectFieldTypeComponent = useMemo(() => {
    if (
      watchQuestionType === QuizQuestionTypeEnum.MCQ ||
      watchQuestionType === QuizQuestionTypeEnum.TFQ
    ) {
      return AnswerFieldRadio;
    } else {
      return AnswerFieldCheckbox;
    }
  }, [watchQuestionType]);

  // Hooks
  const {
    fields: answers,
    append,
    remove,
  } = useFieldArray({
    name: 'answers',
    control,
  });

  return (
    <fieldset className="space-y-4">
      <legend className="sr-only">Question Answers</legend>
      {(watchQuestionType === QuizQuestionTypeEnum.TFQ && (
        <TrueFalseField />
      )) || (
        <>
          {answers.map((answer, index) => (
            <section
              key={answer.id}
              className="flex space-x-4 space-y-4 items-end"
            >
              <IsCorrectFieldTypeComponent
                id={answer.id}
                register={register}
                index={index}
                name={'is_correct'}
              />
              <Controller
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
              <button
                className={`${answers.length > 2 ? 'visible' : 'invisible'}`}
                type="button"
                onClick={() => remove(index)}
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </section>
          ))}
          <button
            className="inline-flex items-center gap-x-1.5 rounded-md bg-teacher-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teacher-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teacher-primary-600"
            type="button"
            onClick={() => append(DEFAULT_QUESTION_ANSWER)}
          >
            Add Answer Option
          </button>
        </>
      )}
    </fieldset>
  );
};
