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
    answer:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"True","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    isCorrect: false,
  },
  {
    answer:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"False","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
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
