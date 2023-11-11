import {
  QuizData,
  QuizPaginationFilter,
  Teacher,
  getPaginatedFilteredQuizzes as apiGetPaginatedFilteredQuizzes,
} from '@acer-academy-learning/data-access';
import { QuizQuestionPaginationFilter } from 'libs/data-access/src/lib/types/question';
import { useEffect, useState } from 'react';
import { LexOutput, useAuth, useToast } from '@acer-academy-learning/common-ui';
import { Filter } from '../question-bank/Filter';
import { LevelTag } from '../question-bank/LevelTag';
import { TopicTag } from '../question-bank/TopicTag';
import DifficultyTag from '../question-bank/DifficultyTag';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  GiftIcon,
  UserGroupIcon,
  LockOpenIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

export const QuizStatisticsManagement: React.FC = () => {
  const { user } = useAuth<Teacher>();
  const navigate = useNavigate();
  const location = useLocation();
  const { displayToast, ToastType } = useToast();
  const [filterOptions, setFilterOptions] = useState<QuizPaginationFilter>({});
  useState<QuizQuestionPaginationFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentQuizzes, setCurrentQuizzes] = useState<QuizData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const getPaginatedFilteredQuizzes = async () => {
    try {
      const response = await apiGetPaginatedFilteredQuizzes(
        currentPage,
        pageSize,
        filterOptions,
      );
      const quizzesData: {
        quizzes: QuizData[];
        totalCount: number;
      } = response.data;
      setCurrentQuizzes(quizzesData.quizzes);
      setTotalCount(quizzesData.totalCount);
    } catch (error) {
      displayToast(
        'Quizzes could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const isNextPageDisabled = () => {
    return currentPage * pageSize >= totalCount;
  };

  const isPrevPageDisabled = () => {
    return currentPage === 1;
  };

  const navToSelectedQuiz = (selectedQuizId: string) => {
    navigate(`${location.pathname}/${selectedQuizId}`);
  };

  const getTimeAllowedString = (timeAllowedInSeconds: number | undefined) => {
    if (!timeAllowedInSeconds) return 'None';
    if (timeAllowedInSeconds < 60) return 'Less than 1 minute';
    let numMins = Math.floor(timeAllowedInSeconds / 60);
    const numHrs = Math.floor(numMins / 60);
    numMins %= 60;
    return `${numHrs > 0 ? `${numHrs} hour` : ''} ${
      numMins > 0 ? `${numMins} minutes` : ''
    }`;
  };

  useEffect(() => {
    getPaginatedFilteredQuizzes();
  }, [currentPage, pageSize, filterOptions]);

  return (
    <div className="h-full">
      <div className="flex min-h-full flex-col gap-7 align-middle">
        <div className="flex align-middle justify-between">
          <div className="flex align-middle gap-4">
            <span className="text-2xl py-1 font-bold tracking-tight">
              View Quiz Statistics
            </span>
            <button
              className="text-blue-500 hover:text-blue-600"
              onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-7 h-7 fill-teacher-primary-900 hover:fill-teacher-secondary-700 transition-colors"
              >
                <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
              </svg>
            </button>
          </div>
        </div>

        <div className={isFilterVisible ? '' : ' hidden'}>
          <Filter
            filterSubmitCallback={(newFilterOptions: QuizPaginationFilter) => {
              setFilterOptions(newFilterOptions);
            }}
            isQuizFilter={true}
            isQuizStatisticsFilter={true}
          ></Filter>
        </div>

        <div className="min-w-max">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-3.5 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-6"
                      >
                        Quiz
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900 min-w-0"
                      >
                        Details
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentQuizzes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="whitespace-nowrap py-4 px-4 font-light italic text-gray-400 text-center"
                        >
                          No quizzes found.
                        </td>
                      </tr>
                    ) : (
                      currentQuizzes.map((quiz) => (
                        <tr
                          key={quiz.id}
                          className="hover:bg-slate-50 hover:cursor-pointer"
                          onClick={() => {
                            navToSelectedQuiz(quiz.id);
                          }}
                        >
                          <td className="py-4 pl-3.5 pr-3 text-xs font-medium text-gray-900">
                            <div>
                              <span className="font-bold text-sm">
                                {quiz.title}
                              </span>
                              <span>
                                <LexOutput
                                  editorStateStr={quiz.description}
                                  shorten
                                />
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <DocumentDuplicateIcon className="w-4 h-4 text-teacherBlue-700" />
                                <span className="font-semibold text-sm">
                                  {`${quiz.quizQuestions.length} questions`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DocumentCheckIcon className="w-4 h-4 text-teacherBlue-700" />
                                <span className="font-semibold text-sm">
                                  {`${String(quiz.totalMarks)} marks`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4 text-teacherBlue-700" />
                                <span className="font-semibold text-sm">
                                  {getTimeAllowedString(quiz.timeAllowed)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {quiz.isPublic ? (
                                  <LockOpenIcon className="w-4 h-4 text-teacherBlue-700" />
                                ) : (
                                  <LockClosedIcon className="w-4 h-4 text-teacherBlue-700" />
                                )}
                                <span className="font-semibold text-sm">
                                  {`${
                                    quiz.isPublic
                                      ? 'Public'
                                      : `${quiz.allocatedTo.length} students`
                                  }`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <UserGroupIcon className="w-4 h-4 text-teacherBlue-700" />
                                <span className="font-semibold text-sm">
                                  {`${quiz.takes.length} taken`}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900">
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm">{`v${quiz.version}`}</span>
                              <span className="text-xs text-gray-500">
                                {quiz.version == 1 ? 'Created:' : 'Updated:'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {String(quiz.createdAt).split('T')[0]}
                              </span>
                              <span className="text-xs text-gray-500">
                                {`${quiz.teacherCreated.firstName} ${quiz.teacherCreated.lastName}`}
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 font-medium text-gray-900">
                            <div className="flex flex-col gap-1">
                              {quiz.levels.map((level, index) => {
                                return (
                                  <LevelTag
                                    key={index}
                                    index={index}
                                    levelEnum={level}
                                  />
                                );
                              })}
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                            <div className="flex flex-col gap-1 max-w-min">
                              {quiz.topics.map((topic, index) => {
                                return (
                                  <TopicTag
                                    key={index}
                                    index={index}
                                    topicEnum={topic}
                                  />
                                );
                              })}
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                            <DifficultyTag difficulty={quiz.difficulty} />
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
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={isPrevPageDisabled()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={isPrevPageDisabled() ? 'grey' : 'currentColor'}
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
                    (currentPage - 1) * pageSize + currentQuizzes.length
                  } of ${totalCount}`
            }`}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={isNextPageDisabled()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={isNextPageDisabled() ? 'grey' : 'currentColor'}
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
  );
};
