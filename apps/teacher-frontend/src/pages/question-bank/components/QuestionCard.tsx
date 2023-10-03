import {
  GenericSelect,
  LexEditor,
  screamingSnakeToTitleCase,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import { useEffect } from 'react';
import { QuestionTypeSelect } from './QuestionTypeSelect';
import {
  CreateQuizQuestionType,
  LevelEnum,
  QuizQuestionDifficultyEnum,
  QuizQuestionStatusEnum,
  QuizQuestionTypeEnum,
  createQuestion,
  createQuizQuestionSchema,
} from '@acer-academy-learning/data-access';
import { Controller, FormProvider } from 'react-hook-form';
import { QuestionAnswers } from './QuestionAnswers';
import { QuestionTopicsCombo } from './QuestionTopicsCombo';
import { QuestionLevelsCombo } from './QuestionLevelsCombo';
import { useMutation } from 'react-query';

const difficulties = Object.values(QuizQuestionDifficultyEnum);

export const QuestionCard = () => {
  const { displayToast, ToastType } = useToast();
  const { mutate: createQuestionMutation } = useMutation(createQuestion, {
    onSuccess: () => {
      displayToast('Success!', ToastType.SUCCESS);
      console.log('success');
    },
    onError: (error) => {
      displayToast('Error :(', ToastType.ERROR);
      console.log(error);
    },
  });
  const formMethods = useZodForm({
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
      levels: [LevelEnum.P1],
      status: QuizQuestionStatusEnum.READY,
      difficulty: QuizQuestionDifficultyEnum.BASIC,
    },
    mode: 'all',
  });

  const handleSubmitForm = async (values: CreateQuizQuestionType) => {
    console.log(values);
    createQuestionMutation(values);
  };

  useEffect(() => {
    console.log('EROR');
    console.log(formMethods.formState.errors);
  }, [formMethods.formState.errors]);
  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit((values) =>
          handleSubmitForm(values),
        )}
        className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow space-y-4"
      >
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Question:
        </h3>
        <Controller
          control={formMethods.control}
          name="questionText"
          render={({ field: { onChange, value } }) => (
            <LexEditor onChange={onChange} value={value} />
          )}
        />
        <Controller
          control={formMethods.control}
          name="questionType"
          render={({ field: { onChange, value } }) => (
            <QuestionTypeSelect selected={value} onChange={onChange} />
          )}
        />
        <QuestionAnswers />
        <QuestionTopicsCombo control={formMethods.control} />
        <QuestionLevelsCombo control={formMethods.control} />
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Difficulty:
        </h3>
        <Controller
          control={formMethods.control}
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
    </FormProvider>
  );
};
