import {
  GenericSelect,
  LexEditor,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import { useEffect } from 'react';
import { QuestionTypeSelect } from './QuestionTypeSelect';
import {
  CreateQuizQuestionType,
  QuizQuestionDifficultyEnum,
} from '@acer-academy-learning/data-access';
import { Controller, useFormContext } from 'react-hook-form';
import { QuestionAnswers } from './QuestionAnswers';
import { QuestionTopicsCombo } from './QuestionTopicsCombo';
import { QuestionLevelsCombo } from './QuestionLevelsCombo';

const difficulties = Object.values(QuizQuestionDifficultyEnum);

export type QuestionCardProps = {
  onSubmitForm: (values: CreateQuizQuestionType) => Promise<void>;
};

export const QuestionCard = ({ onSubmitForm }: QuestionCardProps) => {
  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
  } = useFormContext<CreateQuizQuestionType>();

  const handleSubmitForm = async (values: CreateQuizQuestionType) => {
    console.log(values);
    // createQuestionMutation(values);
    onSubmitForm(values);
  };

  useEffect(() => {
    console.log('EROR');
    console.log(errors);
  }, [errors]);
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
        render={({ field: { onChange, value, onBlur } }) => (
          <LexEditor
            errorMessage={errors.questionText?.message}
            onChange={onChange}
            htmlString={getValues('questionText')}
            onBlur={onBlur}
          />
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
      <button
        className="inline-flex items-center gap-x-1.5 rounded-md bg-teacher-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teacher-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teacher-primary-600 text-center self-center"
        type="submit"
        style={{
          marginTop: '3rem',
        }}
      >
        Submit
      </button>
    </form>
  );
};
