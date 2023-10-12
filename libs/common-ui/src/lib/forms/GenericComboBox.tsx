import { Fragment, useMemo, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export type GenericComboBoxProps<T> = {
  options: T[];
  selected: T[];
  displayValue: (option: T) => string;
  onChange: (option: T[]) => void;
  hasError?: boolean;
  placeholder?: string;
  containerStyle?: string;
};

export const GenericComboBox = <T,>({
  options,
  selected,
  onChange,
  displayValue,
  hasError,
  placeholder,
  containerStyle,
}: GenericComboBoxProps<T>) => {
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(
    () =>
      query === ''
        ? options
        : options.filter((option) =>
            displayValue(option)
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, '')),
          ),
    [options, query, displayValue],
  );

  return (
    <Combobox value={selected} onChange={onChange} multiple>
      <div className={`relative mt-1 ${containerStyle}`}>
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-gray-900 sm:text-sm">
          <Combobox.Button className={`w-full`}>
            <Combobox.Input<T[]>
              className={`placeholder-gray-400 placeholder:text-sm w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-600 break-normal ring-1 ring-inset ${
                hasError ? 'ring-red-500' : 'ring-gray-300'
              }
              rounded-lg`}
              placeholder={placeholder ?? 'Search here...'}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 ">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options
            className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-900 ring-opacity-5 focus:outline-none sm:text-sm z-[1]`}
          >
            {filteredOptions.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option, idx) => (
                <Combobox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? 'bg-teacher-primary-600 text-white'
                        : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {displayValue(option)}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teacher-primary-600'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};
