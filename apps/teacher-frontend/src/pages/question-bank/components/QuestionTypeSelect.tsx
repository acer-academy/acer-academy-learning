import { ChangeEvent, Fragment, useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { QuizQuestionTypeEnum } from '@acer-academy-learning/data-access';
import { QuestionTypeOption } from './QuestionTypeOption';
import { QuestionTypeIcon } from './QuestionTypeIcon';

export type QuestionTypeSelectProps = {
  selected: QuizQuestionTypeEnum;
  onChange: (type: QuizQuestionTypeEnum) => void;
};

export const QuestionTypeSelect = ({
  selected,
  onChange,
}: QuestionTypeSelectProps) => {

  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative mt-1">
        {/* <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border-slate-100 border-solid border-2"> */}
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
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {Object.values(QuizQuestionTypeEnum).map((quiz, quizIdx) => (
              <QuestionTypeOption key={quizIdx} type={quiz} />
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
