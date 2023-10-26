import { Fragment, useState } from 'react';
import { Dialog, Transition, Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { QuizQuestionData } from '@acer-academy-learning/data-access';

interface SelectQuizQuestionVersionModalProps {
  oldQuestion: QuizQuestionData;
  oldQuestionIndex: number;
  futureQuestionVersions: QuizQuestionData[];
  setOpen: (open: boolean) => void;
  open: boolean;
  onClick: (newQuestionId: string) => void;
}

export const SelectQuizQuestionVersionModal: React.FC<
  SelectQuizQuestionVersionModalProps
> = (props: SelectQuizQuestionVersionModalProps) => {
  const {
    oldQuestion,
    oldQuestionIndex,
    futureQuestionVersions,
    setOpen,
    open,
    onClick,
  } = props;
  const [newQuestion, setNewQuestion] = useState<QuizQuestionData>();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h1"
                      className="text-base font-semibold leading-6 text-gray-900 mt-2"
                    >
                      Update Question Version
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 whitespace-pre-line">
                        {`Update version of `}
                        <strong>Question #{oldQuestionIndex} </strong>
                        from
                        <strong> V{oldQuestion.version} </strong>
                        to:
                      </p>

                      <Menu
                        as="div"
                        className="relative inline-block text-left mt-3"
                      >
                        <div>
                          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            {newQuestion?.version ?? 'Select version number'}
                            <ChevronDownIcon
                              className="-mr-1 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-20 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {futureQuestionVersions.map((question) => (
                                <Menu.Item key={question.id}>
                                  {({ active }) => (
                                    <a
                                      className={
                                        active
                                          ? 'bg-gray-100 text-gray-900 block px-4 py-2 text-sm'
                                          : 'text-gray-700 block px-4 py-2 text-sm'
                                      }
                                      onClick={() => setNewQuestion(question)}
                                    >
                                      {question.version}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={!newQuestion}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:cursor-not-allowed disabled:bg-gray-300"
                    onClick={() => {
                      if (newQuestion) {
                        onClick(newQuestion.id);
                      }
                      setOpen(false);
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SelectQuizQuestionVersionModal;
