import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  CreateQuizQuestionType,
  QuizQuestionTypeEnum,
} from '@acer-academy-learning/data-access';
import { QuestionTypeOption } from './QuestionTypeOption';
import { QuestionTypeIcon } from './QuestionTypeIcon';
import { Controller, useFormContext } from 'react-hook-form';
import { LEX_DEFAULT_JSON_STRING } from '@acer-academy-learning/common-ui';
import { TRUE_FALSE_VALUES } from '../constants';

export const QuestionTypeSelect = () => {
  const { control, setValue, getValues } =
    useFormContext<CreateQuizQuestionType>();
  const onSelectChange = (
    selected: QuizQuestionTypeEnum,
    onChange: (selected: QuizQuestionTypeEnum) => void,
  ) => {
    // Set checkbox to empty
    const answers = getValues('answers');
    answers.forEach((answer, index) =>
      setValue(`answers.${index}`, { ...answer, isCorrect: false }),
    );
    if (selected === QuizQuestionTypeEnum.TFQ) {
      setValue(`answers`, TRUE_FALSE_VALUES);
    }
    onChange(selected);
  };
  return (
    <Controller
      control={control}
      name={`questionType`}
      render={({ field: { onChange, value: selected, onBlur } }) => (
        <Listbox
          value={selected}
          onChange={(selected) => onSelectChange(selected, onChange)}
        >
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-sm bg-white py-2 pl-3 pr-10 text-left border-slate-100 border-solid border-2">
              <span className="flex items-center truncate">
                <QuestionTypeIcon type={selected} />
                {selected}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-black"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-[1]">
                {Object.values(QuizQuestionTypeEnum).map((quiz, quizIdx) => (
                  <QuestionTypeOption key={quizIdx} type={quiz} />
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      )}
    />
  );
};
