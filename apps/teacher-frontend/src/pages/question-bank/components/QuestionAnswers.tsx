import React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  UseFormRegister,
  useFieldArray,
} from 'react-hook-form';
import { CreateQuizQuestionType } from '@acer-academy-learning/data-access';
import { LexEditor, LexFloatingEditor } from '@acer-academy-learning/common-ui';

export type QuestionAnswerProps = {
  // register: UseFormRegister<CreateQuizQuestionType>;
  control: Control<CreateQuizQuestionType>;
};

export const QuestionAnswers = ({ control }: QuestionAnswerProps) => {
  const {
    fields: answers,
    append,
    prepend,
    remove,
  } = useFieldArray({
    name: 'answers',
    control,
  });
  return (
    <>
      {answers.map((answer, index) => (
        // <div key={answer.id}>
        //   <label>Answer</label>
        //   <input {...register(`answers.${index}.answer`)} />
        // </div>
        <Controller
          key={answer.id}
          control={control}
          name={`answers.${index}.answer`}
          render={({ field: { onChange, value } }) => <LexFloatingEditor />}
        />
      ))}
    </>
  );
};
