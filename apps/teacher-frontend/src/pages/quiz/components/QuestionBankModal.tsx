import { LexOutput, useToast } from '@acer-academy-learning/common-ui';
import {
  QuizQuestionInQuizType,
  getPaginatedFilteredQuestions as apiGetPaginatedFilteredQuestions,
} from '@acer-academy-learning/data-access';
import { Dialog, Transition } from '@headlessui/react';
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  QuizQuestionData,
  QuizQuestionPaginationFilter,
} from 'libs/data-access/src/lib/types/question';
import { Fragment, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import DifficultyTag from '../../question-bank/DifficultyTag';
import { Filter } from '../../question-bank/Filter';
import { LevelTag } from '../../question-bank/LevelTag';
import TypeTag from '../../question-bank/QuestionTypeTag';
import { QuizStatusTag } from '../../question-bank/QuizStatusTag';
import { TopicTag } from '../../question-bank/TopicTag';
import { last } from 'lodash';

interface QuestionBankModalProps {
  selectedQuestions: QuizQuestionInQuizType[];
  setOpen: (open: boolean) => void;
  open: boolean;
  onClick: (newSelectedQuestions: QuizQuestionInQuizType[]) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = (
  props: QuestionBankModalProps,
) => {
  const { selectedQuestions, setOpen, open, onClick } = props;
  const [newSelectedQuestionsId, setNewSelectedQuestionsId] = useState<
    string[]
  >([]);
  console.log('QuestionBankModal: selectedQuestions', selectedQuestions);
  console.log(
    'QuestionBankModal: newSelectedQuestionsId',
    newSelectedQuestionsId,
  );
  const [toggleAllChecked, setToggleAllChecked] = useState(false);

  const location = useLocation();
  const { displayToast, ToastType } = useToast();
  const [filterOptions, setFilterOptions] =
    useState<QuizQuestionPaginationFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestionData[]>(
    [],
  );
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const getPaginatedFilteredQuestions = async () => {
    try {
      const response = await apiGetPaginatedFilteredQuestions(
        currentPage,
        pageSize,
        filterOptions,
      );
      const questionData: {
        questions: QuizQuestionData[];
        totalCount: number;
      } = response.data;
      console.log(questionData);
      setCurrentQuestions(questionData.questions);
      setTotalCount(questionData.totalCount);
    } catch (error) {
      displayToast(
        'Questions could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const isNextPageDisabled = () => {
    return currentPage * pageSize + currentQuestions.length >= totalCount;
  };

  const isPrevPageDisabled = () => {
    return currentPage === 1;
  };

  // Checks if question can be added to quiz
  // Only questions that have status of READY and were not previously added can be added.
  const isQuestionValid = (question: QuizQuestionData) =>
    question.status === 'READY' &&
    !selectedQuestions.some((q) => q.quizQuestionId === question.id);

  const toggleAll = () => {
    const questionIdsToAdd = currentQuestions
      .filter((q) => isQuestionValid(q))
      .map((question) => question.id);
    setNewSelectedQuestionsId(toggleAllChecked ? [] : questionIdsToAdd);
    setToggleAllChecked(!toggleAllChecked);
  };

  const handleAddQuestions = () => {
    let lastQuestionIndex = selectedQuestions.length;
    const newSelectedQuestions: QuizQuestionInQuizType[] =
      newSelectedQuestionsId
        .filter((id) => !selectedQuestions.some((q) => q.quizQuestionId === id))
        .map((id) => {
          lastQuestionIndex++;
          return {
            quizQuestionId: id,
            quizQuestionIndex: lastQuestionIndex,
            quizQuestionMarks: 1, // default marks per question
          };
        });

    console.log(
      'QuestionBankModal: newSelectedQuestions',
      newSelectedQuestions,
    );

    onClick(newSelectedQuestions);
    setOpen(false);
  };

  useEffect(() => {
    getPaginatedFilteredQuestions();
  }, [currentPage, pageSize, filterOptions]);

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
          <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-screen h-screen relative transform overflow-y-scroll rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="">
                  <div className="flex flex-col gap-7 align-middle">
                    <div className="flex align-middle justify-between">
                      <div className="flex align-middle gap-4">
                        <span className="text-2xl py-1 font-bold tracking-tight">
                          Question Bank
                        </span>
                        <button
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => setIsFilterVisible(!isFilterVisible)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-7 h-7 fill-teacherBlue-500 hover:fill-teacherBlue-700 transition-colors"
                          >
                            <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className={isFilterVisible ? '' : ' hidden'}>
                      <Filter
                        filterSubmitCallback={(
                          newFilterOptions: QuizQuestionPaginationFilter,
                        ) => {
                          setFilterOptions(newFilterOptions);
                        }}
                      ></Filter>
                    </div>
                    {/* Question Bank Table */}
                    <div
                      className="min-w-max overflow-y-scroll"
                      style={{ maxHeight: '30rem' }}
                    >
                      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-200">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-3.5 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-6"
                                  >
                                    <input
                                      type="checkbox"
                                      className="left-4 top-1/2 -mt-2 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                      checked={toggleAllChecked}
                                      onChange={toggleAll}
                                    />
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-3.5 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-6"
                                  >
                                    Question
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                                  >
                                    Version
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                                  >
                                    Level(s)
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                                  >
                                    Topic(s)
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-lg font-bold text-gray-900 "
                                  >
                                    Difficulty
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                                  >
                                    Type
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {currentQuestions.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan={7}
                                      className="whitespace-nowrap py-4 px-4 font-light italic text-gray-400 text-center"
                                    >
                                      No questions found.
                                    </td>
                                  </tr>
                                ) : (
                                  currentQuestions.map((question) => (
                                    <tr
                                      key={question.id}
                                      className={
                                        newSelectedQuestionsId.includes(
                                          question.id,
                                        ) ||
                                        selectedQuestions.some(
                                          (q) =>
                                            q.quizQuestionId === question.id,
                                        )
                                          ? 'bg-gray-100 hover:bg-indigo-50'
                                          : 'hover:bg-indigo-50'
                                      }
                                    >
                                      <td className="whitespace-nowrap py-4 px-3 font-medium text-gray-900">
                                        <div className="flex flex-col gap-1 pl-3">
                                          {isQuestionValid(question) && (
                                            <input
                                              type="checkbox"
                                              className="left-4 top-1/2 -mt-2 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                              value={question.id}
                                              checked={newSelectedQuestionsId.includes(
                                                question.id,
                                              )}
                                              onChange={(e) =>
                                                setNewSelectedQuestionsId(
                                                  e.target.checked
                                                    ? [
                                                        ...newSelectedQuestionsId,
                                                        question.id,
                                                      ]
                                                    : newSelectedQuestionsId.filter(
                                                        (id) =>
                                                          id !== question.id,
                                                      ),
                                                )
                                              }
                                            />
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-4 pl-3.5 pr-3 text-xs font-medium text-gray-900 max-w-0">
                                        <div>
                                          <span>
                                            <LexOutput
                                              editorStateStr={
                                                question.questionText
                                              }
                                              shorten
                                            />
                                          </span>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900">
                                        <div className="flex flex-col">
                                          <span className="font-semibold text-sm">{`v${question.version}`}</span>
                                          <span className="text-xs text-gray-500">
                                            {question.version == 1
                                              ? 'Created:'
                                              : 'Updated:'}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {
                                              String(question.createdAt).split(
                                                'T',
                                              )[0]
                                            }
                                          </span>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-4 px-3 font-medium text-gray-900">
                                        <div className="flex flex-col gap-1">
                                          {question.levels.map(
                                            (level, index) => {
                                              return (
                                                <LevelTag
                                                  key={index}
                                                  index={index}
                                                  levelEnum={level}
                                                />
                                              );
                                            },
                                          )}
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                                        <div className="flex flex-col gap-1 max-w-min">
                                          {question.topics.map(
                                            (topic, index) => {
                                              return (
                                                <TopicTag
                                                  key={index}
                                                  index={index}
                                                  topicEnum={topic}
                                                />
                                              );
                                            },
                                          )}
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                                        <DifficultyTag
                                          difficulty={question.difficulty}
                                        />
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                                        <QuizStatusTag
                                          status={question.status}
                                        />
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                                        <TypeTag type={question.questionType} />
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-5 justify-end">
                      <span className="py-2">Rows per page:</span>
                      <select
                        className=" rounded-md"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                      >
                        {[10, 20, 30, 40, 50].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setCurrentPage(currentPage - 1);
                          setToggleAllChecked(false);
                        }}
                        disabled={isPrevPageDisabled()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke={
                            isPrevPageDisabled() ? 'grey' : 'currentColor'
                          }
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>
                      <span className="py-2">
                        {`${
                          totalCount == 0
                            ? `0 of 0`
                            : `${(currentPage - 1) * pageSize + 1}-${
                                (currentPage - 1) * pageSize +
                                currentQuestions.length
                              } of ${totalCount}`
                        }`}
                      </span>
                      <button
                        onClick={() => {
                          setCurrentPage(currentPage + 1);
                          setToggleAllChecked(false);
                        }}
                        disabled={isNextPageDisabled()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke={
                            isNextPageDisabled() ? 'grey' : 'currentColor'
                          }
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-center">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-teacherBlue-500 px-3 py-2 font-semibold text-white shadow-sm hover:bg-teacherBlue-700 sm:ml-3 sm:w-auto"
                    onClick={() => handleAddQuestions()}
                  >
                    Add Questions
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

export default QuestionBankModal;
