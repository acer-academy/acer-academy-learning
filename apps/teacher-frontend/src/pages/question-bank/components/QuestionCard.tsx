import { LexEditor, useZodForm } from '@acer-academy-learning/common-ui';
import { useEffect } from 'react';
import { QuestionTypeSelect } from './QuestionTypeSelect';
import {
  CreateQuizQuestionType,
  QuizQuestionTypeEnum,
  createQuizQuestionSchema,
} from '@acer-academy-learning/data-access';
import { Controller } from 'react-hook-form';

export const QuestionCard = () => {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useZodForm({
    schema: createQuizQuestionSchema,
    defaultValues: {
      questionType: QuizQuestionTypeEnum.MCQ,
      answers: [
        {
          answer: '',
        },
      ],
    },
    reValidateMode: 'onChange',
    mode: 'onBlur',
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
      className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow"
    >
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Question
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
    </form>
  );
};
