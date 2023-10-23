import { GenericButton } from '@acer-academy-learning/common-ui';
import { RadioGroup } from '@headlessui/react';
import { useState } from 'react';

const options = [
  {
    name: 'Manual selection',
    description: 'Select questions from the question bank to add to the quiz',
    modeId: 'MANUAL_SELECTION',
  },
  {
    name: 'Auto-generate',
    description:
      'Quiz questions are automatically selected based on specified parameters',
    modeId: 'AUTO_GENERATE',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface QuestionSelectionModeRadioProps {
  handleSelectMode: (selectedModeId: string) => void;
}

export const QuestionSelectionModeRadio: React.FC<
  QuestionSelectionModeRadioProps
> = (props: QuestionSelectionModeRadioProps) => {
  const { handleSelectMode } = props;
  const [selected, setSelected] = useState(options[0]);

  return (
    <>
      <RadioGroup value={selected} onChange={setSelected}>
        <div className="mt-10">
          <RadioGroup.Label className="text-2xl font-semibold leading-6 text-gray-900">
            Select a question selection mode
          </RadioGroup.Label>
        </div>
        <div className="-space-y-px rounded-md bg-white mt-4 mb-4">
          {options.map((option, optionIdx) => (
            <RadioGroup.Option
              key={option.name}
              value={option}
              className={({ checked }) =>
                classNames(
                  optionIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                  optionIdx === options.length - 1
                    ? 'rounded-bl-md rounded-br-md'
                    : '',
                  checked
                    ? 'z-10 border-indigo-200 bg-indigo-50'
                    : 'border-gray-200',
                  'relative flex cursor-pointer border p-4 focus:outline-none',
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <span
                    className={classNames(
                      checked
                        ? 'bg-indigo-600 border-transparent'
                        : 'bg-white border-gray-300',
                      active ? 'ring-2 ring-offset-2 ring-indigo-600' : '',
                      'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center',
                    )}
                    aria-hidden="true"
                  >
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>
                  <span className="ml-3 flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className={classNames(
                        checked ? 'text-indigo-900' : 'text-gray-900',
                        'block text-sm font-medium',
                      )}
                    >
                      {option.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className={classNames(
                        checked ? 'text-indigo-700' : 'text-gray-500',
                        'block text-sm',
                      )}
                    >
                      {option.description}
                    </RadioGroup.Description>
                  </span>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <div className="flex justify-center">
        <GenericButton
          className="hover:bg-gray-700"
          onClick={() => handleSelectMode(selected.modeId)}
        />
      </div>
    </>
  );
};
