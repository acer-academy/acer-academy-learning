import { Listbox } from '@headlessui/react';
import React from 'react';
import { QuestionTypeIcon } from './QuestionTypeIcon';
import { CheckIcon } from '@heroicons/react/24/outline';
import { QuizQuestionTypeEnum } from '@acer-academy-learning/data-access';

export type QuestionTypeOptionProps = {
  type: QuizQuestionTypeEnum;
};

export const QuestionTypeOption = ({ type }: QuestionTypeOptionProps) => {
  return (
    <Listbox.Option
      className={({ active }) =>
        `relative cursor-default select-none py-2 pl-10 pr-4 ${
          active
            ? 'bg-teacher-primary-100 text-teacher-primary-900'
            : 'text-gray-900'
        }`
      }
      value={type}
    >
      {({ selected }) => (
        <>
          <span
            className={`flex items-center truncate ${
              selected ? 'font-medium' : 'font-normal'
            }`}
          >
            <QuestionTypeIcon type={type} />
            {type}
          </span>
          {selected ? (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teacher-primary-600">
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : null}
        </>
      )}
    </Listbox.Option>
  );
};
