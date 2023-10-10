import React, { useEffect, useMemo } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import {
  CreateQuizQuestionType,
  QuizQuestionTypeEnum,
} from '@acer-academy-learning/data-access';
import {
  ErrorField,
  LexFloatingEditor,
} from '@acer-academy-learning/common-ui';
import { DocumentPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { DEFAULT_QUESTION_ANSWER } from '../constants';
import { AnswerFieldRadio } from './AnswerFieldRadio';
import { AnswerFieldCheckbox } from './AnswerFieldCheckbox';
import { TrueFalseField } from './TrueFalseField';
import { ErrorMessage } from '@hookform/error-message';
export const QuestionAnswers = () => {
  const {
    watch,
    control,
    register,
    setValue,
    formState: { errors },
    trigger,
  } = useFormContext<CreateQuizQuestionType>();
  // Hooks
  const {
    fields: answers,
    append,
    remove,
  } = useFieldArray({
    name: 'answers',
    control,
  });
  // States/Refs
  const watchQuestionType = watch('questionType');
  const watchAnswers = watch('answers');

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

  return (
    <fieldset className="space-y-4 flex flex-col">
      {(watchQuestionType === QuizQuestionTypeEnum.TFQ && (
        <TrueFalseField />
      )) || (
        <>
          {answers.map((answer, index) => {
            const explanation = watchAnswers[index].explanation;
            return (
              <section key={answer.id} className="flex flex-col">
                <div
                  onBlur={() => trigger(`answers`)}
                  className="flex space-x-4 items-center"
                >
                  <IsCorrectFieldTypeComponent
                    id={answer.id}
                    register={register}
                    index={index}
                    name={'is_correct'}
                    className={`self-center`}
                  />
                  <button
                    type="button"
                    title="Add Explanation"
                    className={`${
                      typeof explanation !== 'string' &&
                      'hover:text-teacher-primary-900'
                    } ${
                      typeof explanation === 'string'
                        ? 'text-teacher-primary-200'
                        : 'text-teacher-primary-600'
                    }`}
                    disabled={typeof explanation === 'string'}
                    onClick={() => {
                      setValue(`answers.${index}.explanation`, '');
                    }}
                  >
                    <DocumentPlusIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="flex flex-col flex-[5]">
                    <Controller
                      control={control}
                      name={`answers.${index}.answer`}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <>
                          <LexFloatingEditor
                            onChange={onChange}
                            onBlur={onBlur}
                            editorStateStr={answer.answer}
                            placeholder="Enter answer..."
                          />
                          <ErrorMessage
                            errors={errors}
                            name={`answers.${index}.answer`}
                            render={({ message }) => (
                              <ErrorField message={message} />
                            )}
                          />
                        </>
                      )}
                    />
                  </div>
                  <button
                    className={`${
                      answers.length > 2 ? 'visible' : 'invisible'
                    }`}
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                {typeof explanation === 'string' && (
                  <div className={`flex space-x-4 space-y-4 items-end`}>
                    <input type="checkbox" className="invisible h-4 w-4" />
                    <input type="checkbox" className="invisible h-6 w-6" />
                    <Controller
                      control={control}
                      name={`answers.${index}.explanation`}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <LexFloatingEditor
                          onChange={onChange}
                          onBlur={onBlur}
                          className="flex-[5]"
                          editorStateStr={explanation ?? ''}
                          placeholder="Enter explanation..."
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setValue(`answers.${index}.explanation`, null)
                      }
                    >
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </section>
            );
          })}
          <ErrorMessage
            errors={errors}
            name="answers"
            render={({ message }) => <ErrorField message={message} />}
          />
          <button
            className="inline-flex items-center gap-x-1.5 rounded-md bg-teacher-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teacher-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teacher-primary-600 w-fit"
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
