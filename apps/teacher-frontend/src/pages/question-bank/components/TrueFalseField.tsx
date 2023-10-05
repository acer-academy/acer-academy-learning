import {
  CreateQuizAnswerType,
  CreateQuizQuestionType,
} from '@acer-academy-learning/data-access';
import { Controller, useFormContext } from 'react-hook-form';
import { AnswerFieldRadio } from './AnswerFieldRadio';
import { LexOutput } from '@acer-academy-learning/common-ui';
import { useEffect } from 'react';

const TRUE_FALSE_VALUES: CreateQuizAnswerType[] = [
  {
    answer: '<p><span style="white-space: pre-wrap;">True</span></p>',
    isCorrect: false,
  },
  {
    answer: '<p><span style="white-space: pre-wrap;">False</span></p>',
    isCorrect: false,
  },
];

export type TrueFalseFieldProps = {
  answers?: CreateQuizAnswerType[];
};

export const TrueFalseField = () => {
  const { register, control, setValue } =
    useFormContext<CreateQuizQuestionType>();
  useEffect(() => {
    setValue('answers', TRUE_FALSE_VALUES);
  }, [setValue]);

  return (
    <>
      {TRUE_FALSE_VALUES.map((current, index) => (
        <div key={index} className="flex items-center text-center space-x-4">
          <AnswerFieldRadio
            id={current.answer}
            register={register}
            name="true-false-selection"
            index={index}
          />
          <Controller
            control={control}
            name={`answers.${index}.answer`}
            render={({ field: { onChange, value, onBlur } }) => (
              <LexOutput onChange={onChange} htmlString={current.answer} />
            )}
          />
        </div>
      ))}
    </>
  );
};
