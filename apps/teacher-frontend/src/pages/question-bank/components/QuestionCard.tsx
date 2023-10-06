import {
  GenericSelect,
  screamingSnakeToTitleCase,
  useToast,
  LexicEditor,
  ErrorField,
} from '@acer-academy-learning/common-ui';
import { useEffect } from 'react';
import { QuestionTypeSelect } from './QuestionTypeSelect';
import {
  CreateQuizQuestionType,
  QuizQuestionDifficultyEnum,
  QuizQuestionStatusEnum,
} from '@acer-academy-learning/data-access';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import { QuestionAnswers } from './QuestionAnswers';
import { QuestionTopicsCombo } from './QuestionTopicsCombo';
import { QuestionLevelsCombo } from './QuestionLevelsCombo';
import { omit } from 'lodash';

const difficulties = Object.values(QuizQuestionDifficultyEnum);
const statuses = Object.values(QuizQuestionStatusEnum);

export type QuestionCardProps = {
  onSubmitForm: (values: CreateQuizQuestionType) => Promise<void>;
  submitText?: string;
};

export const QuestionCard = ({
  onSubmitForm,
  submitText,
}: QuestionCardProps) => {
  const { displayToast, ToastType } = useToast();
  const { control, handleSubmit, getValues } =
    useFormContext<CreateQuizQuestionType>();

  const { isSubmitting, errors, dirtyFields } =
    useFormState<CreateQuizQuestionType>();

  const handleSubmitForm = async (values: CreateQuizQuestionType) => {
    onSubmitForm(values);
  };

  useEffect(() => {
    if (
      Object.keys(dirtyFields).length > 0 &&
      isSubmitting &&
      Object.keys(errors).length !== 0
    ) {
      const msg = Object.entries(errors)
        .filter(
          ([type, errorObj]) => errorObj.message || errorObj.root?.message,
        )
        .map(([type, errorObj]) => (
          <p key={type} className="space-y-1">
            <strong>
              {type.charAt(0).toLocaleUpperCase() + type.substring(1)} Error:{' '}
            </strong>
            {errorObj.message ?? errorObj.root?.message}
          </p>
        ));
      const answer = Object.entries(omit(errors.answers, 'root') ?? {})
        .filter?.(([key, answer]: [string, any]) => answer)
        .map?.(([key, answer]: [string, any]) => (
          <p key={key}>
            <strong>Answer Error {key}:</strong> {answer?.root?.message}
            {answer?.answer?.message}
            {answer?.explanation?.message}
            {answer?.isCorrect?.message}
          </p>
        ));
      displayToast(
        <div>
          {msg}
          {answer}
        </div>,
        ToastType.ERROR,
      );
    }
  }, [errors, displayToast, ToastType, isSubmitting, dirtyFields]);
  return (
    <form
      onSubmit={handleSubmit((values) => handleSubmitForm(values))}
      className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow space-y-4 flex flex-col"
    >
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Question:
      </h3>
      <Controller
        control={control}
        name="questionText"
        render={({ field: { onChange, value, onBlur }, fieldState }) => (
          <>
            <LexicEditor
              errorMessage={errors.questionText?.message}
              onChange={onChange}
              editorStateStr={getValues('questionText')}
              onBlur={onBlur}
            />
            <ErrorField message={errors.questionText?.message} />
            {/* <LexOutput htmlString={value} /> */}
          </>
        )}
      />
      <QuestionTypeSelect />
      <QuestionAnswers />
      <QuestionTopicsCombo />
      <QuestionLevelsCombo />
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Difficulty:
      </h3>
      <Controller
        control={control}
        name="difficulty"
        render={({ field: { onChange, value } }) => (
          <GenericSelect
            options={difficulties}
            onChange={onChange}
            selected={value}
            getDisplayValue={(option) => screamingSnakeToTitleCase(option)}
            placeholder="Choose Difficulty"
            errorMessage={errors.difficulty?.message}
          />
        )}
      />
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Status:
      </h3>
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <GenericSelect
            options={statuses}
            onChange={onChange}
            selected={value}
            getDisplayValue={(option) => screamingSnakeToTitleCase(option)}
            placeholder="Choose Status"
            errorMessage={errors.status?.message}
          />
        )}
      />
      <button
        className="inline-flex items-center gap-x-1.5 rounded-md bg-teacher-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teacher-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teacher-primary-600 text-center self-center"
        type="submit"
        style={{
          marginTop: '3rem',
        }}
      >
        {submitText ?? 'Submit'}
      </button>
    </form>
  );
};
