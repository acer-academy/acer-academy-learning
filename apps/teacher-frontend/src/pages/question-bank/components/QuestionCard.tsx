import {
  GenericComboBox,
  GenericSelect,
  GenericSelectOption,
  LexEditor,
  screamingSnakeToTitleCase,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import { useEffect } from 'react';
import { QuestionTypeSelect } from './QuestionTypeSelect';
import {
  CreateQuizQuestionType,
  QuizQuestionDifficultyEnum,
  QuizQuestionTopicEnum,
  QuizQuestionTypeEnum,
  createQuizQuestionSchema,
} from '@acer-academy-learning/data-access';
import { Controller } from 'react-hook-form';
import { QuestionAnswers } from './QuestionAnswers';
import { QuestionTopicsCombo } from './QuestionTopicsCombo';
import { QuestionLevelsCombo } from './QuestionLevelsCombo';

const difficulties = Object.values(QuizQuestionDifficultyEnum);

export const QuestionCard = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    control,
  } = useZodForm({
    schema: createQuizQuestionSchema,
    defaultValues: {
      questionType: QuizQuestionTypeEnum.MCQ,
      answers: [
        {
          answer: '',
          isCorrect: false,
        },
      ],
      topics: [],
      levels: [],
    },
    mode: 'all',
  });

  const handleSubmitForm = async (values: CreateQuizQuestionType) => {
    console.log(values);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  return (
    <form
      onSubmit={handleSubmit((values) => handleSubmitForm(values))}
      className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow owl-t-4"
    >
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Question:
      </h3>
      {/* <LexEditor /> */}
      <Controller
        control={control}
        name="questionText"
        render={({ field: { onChange, value } }) => (
          <LexEditor onChange={onChange} value={value} />
        )}
      />
      <Controller
        control={control}
        name="questionType"
        render={({ field: { onChange, value } }) => (
          <QuestionTypeSelect selected={value} onChange={onChange} />
        )}
      />
      <QuestionAnswers register={register} control={control} errors={errors} />
      <QuestionTopicsCombo control={control} />
      <QuestionLevelsCombo control={control} />
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
          />
        )}
      />
      <button
        className="inline-flex items-center gap-x-1.5 rounded-md bg-teacher-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teacher-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teacher-primary-600"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};
